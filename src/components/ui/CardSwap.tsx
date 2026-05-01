"use client";

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
} from "react";
import gsap from "gsap";

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic" | "expo.inOut";
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`absolute top-1/2 left-1/2 rounded-2xl border border-[#fffef1]/20 bg-zinc-950 shadow-2xl will-change-transform ${
        customClass ?? ""
      } ${rest.className ?? ""}`}
    />
  )
);

Card.displayName = "Card";

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (
  i: number,
  distX: number,
  distY: number,
  total: number
): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.8,
  zIndex: total - i,
});

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = true,
  onCardClick,
  skewAmount = 6,
  easing = "elastic",
  children,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const order = useRef<number[]>([]);
  const intervalRef = useRef<number | null>(null);
  const activeTimeline = useRef<gsap.core.Timeline | null>(null);

  const childArr = useMemo(
    () => Children.toArray(children) as ReactElement<CardProps>[],
    [children]
  );

  const config = useMemo(() => {
    return easing === "elastic"
      ? {
          ease: "elastic.out(0.8, 0.6)",
          durDrop: 1.5,
          durMove: 1.2,
          durReturn: 1.2,
          overlap: 0.8,
          retDelay: 0.1,
        }
      : {
          ease: "expo.inOut",
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          overlap: 0.5,
          retDelay: 0.2,
        };
  }, [easing]);

  useEffect(() => {
    if (!container.current) return;

    const ctx = gsap.context(() => {
      const total = childArr.length;
      order.current = Array.from({ length: total }, (_, i) => i);

      // Initial placement
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, total);

        gsap.set(el, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          xPercent: -50,
          yPercent: -50,
          skewY: skewAmount,
          zIndex: slot.zIndex,
          force3D: true,
        });
      });

      const swap = () => {
        if (order.current.length < 2) return;

        // ✅ kill previous timeline
        activeTimeline.current?.kill();

        const [front, ...rest] = order.current;
        const elFront = cardRefs.current[front];
        if (!elFront) return;

        const tl = gsap.timeline({
          onComplete: () => {
            order.current = [...rest, front];
          },
        });

        activeTimeline.current = tl;

        // Drop
        tl.to(elFront, {
          y: "+=600",
          opacity: 0,
          scale: 0.8,
          duration: config.durDrop,
          ease: config.ease,
        });

        // Promote
        tl.addLabel("promote", `-=${config.durDrop * config.overlap}`);

        rest.forEach((idx, i) => {
          const el = cardRefs.current[idx];
          if (!el) return;

          const slot = makeSlot(i, cardDistance, verticalDistance, total);

          tl.set(el, { zIndex: slot.zIndex }, "promote");
          tl.to(
            el,
            {
              x: slot.x,
              y: slot.y,
              z: slot.z,
              duration: config.durMove,
              ease: config.ease,
            },
            `promote+=${i * 0.1}`
          );
        });

        // Return
        const backSlot = makeSlot(
          total - 1,
          cardDistance,
          verticalDistance,
          total
        );

        tl.addLabel("return", `promote+=${config.durMove * config.retDelay}`);

        tl.set(elFront, { zIndex: backSlot.zIndex }, "return");

        tl.to(elFront, {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          opacity: 1,
          scale: 1,
          duration: config.durReturn,
          ease: config.ease,
        });
      };

      const start = () => {
        if (intervalRef.current) return; // ✅ prevent stacking
        intervalRef.current = window.setInterval(swap, delay);
      };

      const stop = () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };

      start();

      if (pauseOnHover && container.current) {
        const node = container.current;

        const pause = () => stop();
        const resume = () => start();

        node.addEventListener("mouseenter", pause);
        node.addEventListener("mouseleave", resume);

        return () => {
          node.removeEventListener("mouseenter", pause);
          node.removeEventListener("mouseleave", resume);
          stop();
        };
      }

      return stop;
    }, container);

    return () => {
      ctx.revert();
      activeTimeline.current?.kill();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    cardDistance,
    verticalDistance,
    delay,
    skewAmount,
    config,
    childArr.length,
    pauseOnHover,
  ]);

  return (
    <div
      ref={container}
      className="absolute bottom-10 right-10 perspective-distant overflow-visible max-md:scale-75 max-md:translate-x-10"
      style={{ width, height }}
    >
      {childArr.map((child, i) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<any>, {
              key: i,
              ref: (el: HTMLDivElement | null) =>
                (cardRefs.current[i] = el),
              style: { width, height, ...(child.props.style ?? {}) },
              onClick: (e: React.MouseEvent<HTMLDivElement>) => {
                child.props.onClick?.(e);
                onCardClick?.(i);
              },
            })
          : child
      )}
    </div>
  );
};

export default CardSwap;