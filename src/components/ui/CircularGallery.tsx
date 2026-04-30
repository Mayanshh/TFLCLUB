import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef } from 'react';

type GL = Renderer['gl'];

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: number;
  return function (this: any, ...args: Parameters<T>) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: any): void {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach(key => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function createTextTexture(
  gl: GL,
  text: string,
  subText: string = '',
  mainFontSize: number = 30,
  mainColor: string = '#000000',
  subFontSize?: number,
  subColor: string = '#3f3f46',
  fontFamily: string = 'nohemi'
): { texture: Texture; width: number; height: number } {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get 2d context');

  const finalSubFontSize = subFontSize || Math.floor(mainFontSize * 0.6);

  context.font = `bold ${mainFontSize}px ${fontFamily}`;
  const mainWidth = context.measureText(text).width;

  context.font = `${finalSubFontSize}px ${fontFamily}`;
  const subWidth = context.measureText(subText).width;

  const width = Math.ceil(Math.max(mainWidth, subWidth));
  const height = Math.ceil(mainFontSize + finalSubFontSize * 1.4);

  canvas.width = width + 40; 
  canvas.height = height + 20;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.textAlign = 'center';
  context.textBaseline = 'top';

  // main text
  context.font = `bold ${mainFontSize}px ${fontFamily}`;
  context.fillStyle = mainColor;
  context.fillText(text, canvas.width / 2, 10);

  // sub text
  context.font = `${finalSubFontSize}px ${fontFamily}`;
  context.fillStyle = subColor;
  context.letterSpacing = "4px";
  context.fillText(subText, canvas.width / 2, 10 + mainFontSize + 4);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;

  return { texture, width: canvas.width, height: canvas.height };
}

interface TitleProps {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  subText?: string;
  mainColor?: string;
  mainFontSize?: number;
  subFontSize?: number;
}

class Title {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  subText: string;
  mainColor: string;
  mainFontSize: number;
  subFontSize?: number;
  mesh!: Mesh;

  constructor({ gl, plane, renderer, mainColor = '#000000', text, subText = '', mainFontSize = 30, subFontSize }: TitleProps) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.subText = subText;
    this.mainColor = mainColor;
    this.mainFontSize = mainFontSize;
    this.subFontSize = subFontSize;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(
      this.gl,
      this.text,
      this.subText,
      this.mainFontSize,
      this.mainColor,
      this.subFontSize
    );

    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.01) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true
    });

    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeightScaled = this.plane.scale.y * 0.15;
    const textWidthScaled = textHeightScaled * aspect;

    this.mesh.scale.set(textWidthScaled, textHeightScaled, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeightScaled * 0.5 - 0.05;
    this.mesh.setParent(this.plane);
  }
}

interface MediaItem {
  image: string;
  text: string;
  subText?: string;
  mainFontSize?: number;
  mainColor?: string;
  subFontSize?: number | string; // Supporting string from your input like '30px'
}

interface MediaProps extends MediaItem {
  geometry: Plane;
  gl: GL;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: { width: number; height: number };
  viewport: { width: number; height: number };
  bend: number;
  borderRadius?: number;
}

class Media {
  extra: number = 0;
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: { width: number; height: number };
  text: string;
  subText: string;
  viewport: { width: number; height: number };
  bend: number;
  borderRadius: number;
  
  mainFontSize: number;
  mainColor: string;
  subFontSize?: number;

  program!: Program;
  plane!: Mesh;
  title!: Title;
  widthTotal!: number;
  width!: number;
  x!: number;
  speed: number = 0;

  constructor({
    geometry, gl, image, index, length, renderer, scene, screen, text, subText = '',
    viewport, bend, borderRadius = 0, mainFontSize = 30, mainColor = '#000000', subFontSize
  }: MediaProps) {
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.subText = subText;
    this.viewport = viewport;
    this.bend = bend;
    this.borderRadius = borderRadius;
    
    this.mainFontSize = mainFontSize;
    this.mainColor = mainColor;
    // Clean '30px' strings to numbers if passed
    this.subFontSize = typeof subFontSize === 'string' ? parseInt(subFontSize) : subFontSize;

    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(vUv.x * ratio.x + (1.0 - ratio.x) * 0.5, vUv.y * ratio.y + (1.0 - ratio.y) * 0.5);
          vec4 color = texture2D(tMap, uv);
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-0.002, 0.002, d);
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius }
      },
      transparent: true
    });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      subText: this.subText,
      mainColor: this.mainColor,
      mainFontSize: this.mainFontSize,
      subFontSize: this.subFontSize
    });
  }

  update(scroll: { current: number; last: number }, direction: 'right' | 'left') {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend !== 0) {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      this.plane.position.y = this.bend > 0 ? -arc : arc;
      this.plane.rotation.z = (this.bend > 0 ? -1 : 1) * Math.sign(x) * Math.asin(effectiveX / R);
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    if (direction === 'right' && this.plane.position.x + planeOffset < -viewportOffset) this.extra -= this.widthTotal;
    if (direction === 'left' && this.plane.position.x - planeOffset > viewportOffset) this.extra += this.widthTotal;
  }

  onResize({ screen, viewport }: { screen?: any; viewport?: any } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;
    const scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (900 * scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (700 * scale)) / this.screen.width;
    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.width = this.plane.scale.x + 2;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class App {
  container: HTMLElement;
  scrollSpeed: number;
  scroll: { ease: number; current: number; target: number; last: number; position?: number };
  renderer!: Renderer;
  gl!: GL;
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;
  medias: Media[] = [];
  screen!: { width: number; height: number };
  viewport!: { width: number; height: number };
  raf: number = 0;
  isDown: boolean = false;
  start: number = 0;

  constructor(container: HTMLElement, config: any) {
    this.container = container;
    this.scrollSpeed = config.scrollSpeed || 2;
    this.scroll = { ease: config.scrollEase || 0.05, current: 0, target: 0, last: 0 };
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(config);
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio, 2) });
    this.gl = this.renderer.gl;
    this.container.appendChild(this.gl.canvas as HTMLCanvasElement);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() { this.scene = new Transform(); }

  createGeometry() { this.planeGeometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 }); }

  createMedias(config: any) {
    const items = config.items || [];
    this.medias = [...items, ...items].map((data: any, index: number) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: items.length * 2,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        subText: data.subText,
        viewport: this.viewport,
        bend: config.bend,
        borderRadius: config.borderRadius,
        mainFontSize: data.mainFontSize || 30,
        mainColor: data.mainColor || config.textColor,
        subFontSize: data.subFontSize
      });
    });
  }

  onTouchDown(e: any) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientX : e.clientX;
  }

  onTouchMove(e: any) {
    if (!this.isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    this.scroll.target = (this.scroll.position || 0) + (this.start - x) * (this.scrollSpeed * 0.025);
  }

  onTouchUp() { this.isDown = false; }

  onWheel(e: any) {
    this.scroll.target += (e.deltaY > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
  }

  onResize() {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    this.viewport = { width: height * this.camera.aspect, height };
    if (this.medias) this.medias.forEach(m => m.onResize({ screen: this.screen, viewport: this.viewport }));
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    this.medias.forEach(m => m.update(this.scroll, direction));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('wheel', this.onWheel.bind(this));
    window.addEventListener('mousedown', this.onTouchDown.bind(this));
    window.addEventListener('mousemove', this.onTouchMove.bind(this));
    window.addEventListener('mouseup', this.onTouchUp.bind(this));
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    this.gl.canvas.remove();
  }
}

export default function CircularGallery({ items, bend = 3, textColor = '#ffffff', borderRadius = 0.05, scrollSpeed = 2, scrollEase = 0.05 }: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const app = new App(containerRef.current, { items, bend, textColor, borderRadius, scrollSpeed, scrollEase });
    return () => app.destroy();
  }, [items, bend, textColor, borderRadius, scrollSpeed, scrollEase]);
  return <div className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing" ref={containerRef} />;
}