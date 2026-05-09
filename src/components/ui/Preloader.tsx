"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, CustomEase);

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface PreloaderProps {
  onComplete: () => void;

  images?: string[];

  logo?: string;

  logoText?: string;

  /**
   * 0.7 = faster
   * 1 = default
   * 1.3 = slower
   */
  speed?: number;

  /**
   * Lower = smoother continuous flow
   */
  flowSpeed?: number;

  grain?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              DEFAULT IMAGES                                */
/* -------------------------------------------------------------------------- */

const DEFAULT_IMAGES = [
  "/images/parallax1.avif",
  "/images/parallax2.avif",
  "/images/parallax6.avif",
  "/images/awwards1.jpg",
  "/images/awards2.jpg",
  "/images/awards3.jpg",
  "/images/parallax4.avif",
  "/images/parallax5.avif",
  "/images/parallax3.avif"
];

/* -------------------------------------------------------------------------- */
/*                              CUSTOM EASINGS                                */
/* -------------------------------------------------------------------------- */

CustomEase.create(
  "smoothReveal",
  "0.23,1,0.32,1"
);

CustomEase.create(
  "smoothExit",
  "0.23,1,0.32,1"
);

CustomEase.create(
  "counterEase",
  "0.23,1,0.32,1"
);

/* -------------------------------------------------------------------------- */
/*                              PRELOAD UTILITY                               */
/* -------------------------------------------------------------------------- */

const preloadImages = async (
  sources: string[]
) => {
  await Promise.all(
    sources.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();

          img.src = src;

          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );
};

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function Preloader({
  onComplete,
  images = DEFAULT_IMAGES,
  logo,
  logoText = "TFL CLUB",
  speed = 0.6,
  flowSpeed = 0.32,
  grain = true,
}: PreloaderProps) {
  /* ------------------------------------------------------------------------ */
  /*                                   REFS                                   */
  /* ------------------------------------------------------------------------ */

  const containerRef =
    useRef<HTMLDivElement>(null);

  const overlayRef =
    useRef<HTMLDivElement>(null);

  const counterRef =
    useRef<HTMLDivElement>(null);

  const logoRef =
    useRef<HTMLDivElement>(null);

  const logoTextRef =
    useRef<HTMLDivElement>(null);

  /* ------------------------------------------------------------------------ */
  /*                                  STATE                                   */
  /* ------------------------------------------------------------------------ */

  const [progress, setProgress] =
    useState(0);

  const [assetsLoaded, setAssetsLoaded] =
    useState(false);

  /* ------------------------------------------------------------------------ */
  /*                             MEMOIZED ASSETS                              */
  /* ------------------------------------------------------------------------ */

  const allAssets = useMemo(() => {
    return logo ? [logo, ...images] : images;
  }, [images, logo]);

  /* ------------------------------------------------------------------------ */
  /*                              PRELOAD FLOW                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    const loadAssets = async () => {
      await preloadImages(allAssets);

      if (mounted) {
        setAssetsLoaded(true);
      }
    };

    loadAssets();

    return () => {
      mounted = false;
    };
  }, [allAssets]);

  /* ------------------------------------------------------------------------ */
  /*                               GSAP FLOW                                  */
  /* ------------------------------------------------------------------------ */

  useGSAP(
    () => {
      if (!assetsLoaded) return;

      const ctx = gsap.context(() => {
        const imageLayers =
          gsap.utils.toArray<HTMLElement>(
            ".preloader-image"
          );

        /* ------------------------------------------------------------------ */
        /*                           INITIAL STATES                            */
        /* ------------------------------------------------------------------ */

        gsap.set(imageLayers, {
          scale: 0.0001,

          opacity: 1,

          clipPath:
            "inset(49.95% 49.95% 49.95% 49.95% round 3rem)",

          transformOrigin: "center center",

          force3D: true,

          willChange:
            "transform, clip-path, opacity, filter",
        });

        gsap.set(logoTextRef.current, {
          opacity: 0,
          y: 20,
        });

        gsap.set(overlayRef.current, {
          clipPath: "inset(0% 0% 0% 0%)",
          backgroundColor: "transparent",
        });

        /* ------------------------------------------------------------------ */
        /*                            COUNTER OBJ                              */
        /* ------------------------------------------------------------------ */

        const counter = {
          value: 0,
        };

        /* ------------------------------------------------------------------ */
        /*                               TIMELINE                              */
        /* ------------------------------------------------------------------ */

        const tl = gsap.timeline({
          defaults: {
            ease: "smoothReveal",
          },

          onComplete: () => {
            onComplete();
          },
        });

        /* ------------------------------------------------------------------ */
        /*                           LOGO FADE IN                              */
        /* ------------------------------------------------------------------ */

        tl.to(
          logoTextRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1.2 * speed,
          },
          0
        );

        /* ------------------------------------------------------------------ */
        /*                           COUNTER FLOW                              */
        /* ------------------------------------------------------------------ */

        tl.to(
          counter,
          {
            value: 100,

            duration:
              images.length *
                flowSpeed *
                speed +
              2.2 * speed,

            ease: "counterEase",

            onUpdate: () => {
              setProgress(
                Math.round(counter.value)
              );
            },
          },
          0
        );

        /* ------------------------------------------------------------------ */
        /*                      CONTINUOUS IMAGE FLOW                          */
        /* ------------------------------------------------------------------ */

        imageLayers.forEach((layer, index) => {
          /* -------------------------------------------------------------- */
          /*                           REVEAL                                */
          /* -------------------------------------------------------------- */

          tl.to(
            layer,
            {
              scale: 1,

              clipPath:
                "inset(0% 0% 0% 0% round 0rem)",

              duration: 2.2 * speed,

              ease: "smoothReveal",
            },

            index * flowSpeed * speed
          );

          /* -------------------------------------------------------------- */
          /*                             EXIT                                */
          /* -------------------------------------------------------------- */

          if (
            index !== imageLayers.length - 1
          ) {
            tl.to(
              layer,
              {
                opacity: 0,

                scale: 1.08,

                filter: "blur(10px)",

                duration: 1.7 * speed,

                ease: "smoothExit",
              },

              index *
                flowSpeed *
                speed +
                0.75
            );
          }
        });

        /* ------------------------------------------------------------------ */
        /*                    FADE UI AFTER IMAGES COMPLETE                    */
        /* ------------------------------------------------------------------ */

        tl.to(
          [
            counterRef.current,
            logoRef.current,
            logoTextRef.current,
          ],
          {
            opacity: 0,

            y: 24,

            filter: "blur(10px)",

            duration: 0.9 * speed,

            stagger: 0.04,

            ease: "smoothExit",
          },

          `>-=0.1`
        );

        /* ------------------------------------------------------------------ */
        /*                       ULTRA FAST FINAL EXIT                         */
        /* ------------------------------------------------------------------ */

        tl.to(
          overlayRef.current,
          {
            clipPath:
              "inset(0% 0% 100% 0% round 0rem)",

            duration: 0.7 * speed,

            ease: "smoothReveal",
          },

          "-=0.12"
        );
      }, containerRef);

      return () => ctx.revert();
    },

    {
      scope: containerRef,
      dependencies: [assetsLoaded],
    }
  );

  /* ------------------------------------------------------------------------ */
  /*                                   JSX                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <div
      ref={containerRef}
      className="
        fixed
        inset-0
        z-99999
        overflow-hidden
        pointer-events-none
      "
    >
      {/* ------------------------------------------------------------------- */}
      {/*                               OVERLAY                                */}
      {/* ------------------------------------------------------------------- */}

      <div
        ref={overlayRef}
        className="
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* ---------------------------------------------------------------- */}
        {/*                           IMAGE STACK                             */}
        {/* ---------------------------------------------------------------- */}

        <div className="absolute inset-0">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="
                preloader-image
                absolute
                inset-0
                overflow-hidden
              "
            >
              <img
                src={image}
                alt=""
                draggable={false}
                className="
                  h-full
                  w-full
                  object-cover
                  select-none
                  pointer-events-none
                "
              />
            </div>
          ))}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*                              GRAIN                                */}
        {/* ---------------------------------------------------------------- */}

        {grain && (
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-[0.028]
              mix-blend-soft-light
              overflow-hidden
            "
          >
            <div
              className="
                absolute
                inset-[-200%]
                animate-grain
                bg-[url('https://cdn.texturize.app/textures/noise-cloud-layer/noise-cloud-layer.png')]
                bg-repeat
                bg-size-[220px]
              "
            />
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/*                           TEXT LOGO                               */}
        {/* ---------------------------------------------------------------- */}

        <div
          ref={logoTextRef}
          className="
            absolute
            left-1/2
            top-1/2
            z-30
            -translate-x-1/2
            -translate-y-1/2
            text-[#fffef1]
            pointer-events-none
          "
        >
          <h1
            className="
              dirtyline
              font-black
              uppercase
              tracking-tight
              leading-none
              text-[3rem]
              sm:text-[4rem]
              md:text-[6rem]
              lg:text-[5rem]
            "
          >
            {logoText}
          </h1>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*                           IMAGE LOGO                              */}
        {/* ---------------------------------------------------------------- */}

        {logo && (
          <div
            ref={logoRef}
            className="
              absolute
              left-1/2
              top-1/2
              z-20
              -translate-x-1/2
              -translate-y-1/2
            "
          >
            <img
              src={logo}
              alt="Logo"
              className="
                w-24
                sm:w-32
                md:w-40
                object-contain
                select-none
              "
            />
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/*                              COUNTER                              */}
        {/* ---------------------------------------------------------------- */}

        <div
          ref={counterRef}
          className="
            absolute
            bottom-6
            right-6
            sm:bottom-10
            sm:right-10
            md:bottom-14
            md:right-14
            z-30
            flex
            items-end
            gap-1
            text-[#fffef1]
            pointer-events-none
          "
        >
          <span
            className="
              font-dirtyline
              leading-none
              tracking-tight
              text-[4rem]
              sm:text-[5rem]
              md:text-[8vw]
            "
          >
            {String(progress).padStart(
              2,
              "0"
            )}
          </span>

          <span
            className="
              mb-5
              text-sm
              sm:text-base
              md:text-lg
              font-medium
              tracking-wide
              pb-2
            "
          >
            %
          </span>
        </div>
      </div>
    </div>
  );
}