"use client";

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CardSwapHandle {
  next: () => void;
  prev: () => void;
}

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
      className={`absolute top-1/2 left-1/2 rounded-2xl border border-[#fffef1]/20 bg-zinc-950 shadow-2xl will-change-transform backface-hidden ${
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

const CardSwap = forwardRef<CardSwapHandle, CardSwapProps>(
  (
    {
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
    },
    ref
  ) => {
    const container = useRef<HTMLDivElement>(null);

    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const order = useRef<number[]>([]);

    const intervalRef = useRef<number | null>(null);
    const activeTimeline = useRef<gsap.core.Timeline | null>(null);
    const isAnimating = useRef(false);

    const childArr = useMemo(
      () => Children.toArray(children) as ReactElement<CardProps>[],
      [children]
    );

    const config = useMemo(() => {
      return easing === "elastic"
        ? {
            ease: "elastic.out(0.8, 0.6)",
            durDrop: 1.2,
            durMove: 1,
            durReturn: 1,
            overlap: 0.75,
            retDelay: 0.08,
          }
        : {
            ease: "expo.inOut",
            durDrop: 0.8,
            durMove: 0.8,
            durReturn: 0.8,
            overlap: 0.5,
            retDelay: 0.1,
          };
    }, [easing]);

    const positionCards = useCallback(() => {
      const total = childArr.length;

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
    }, [cardDistance, verticalDistance, skewAmount, childArr.length]);

    const swapForward = useCallback(() => {
      if (isAnimating.current) return;
      if (order.current.length < 2) return;

      isAnimating.current = true;

      activeTimeline.current?.kill();

      const total = childArr.length;

      const [front, ...rest] = order.current;

      const elFront = cardRefs.current[front];

      if (!elFront) {
        isAnimating.current = false;
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          order.current = [...rest, front];
          isAnimating.current = false;
        },
      });

      activeTimeline.current = tl;

      tl.to(elFront, {
        y: "+=600",
        opacity: 0,
        scale: 0.82,
        duration: config.durDrop,
        ease: config.ease,
      });

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
          `promote+=${i * 0.04}`
        );
      });

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
    }, [
      cardDistance,
      verticalDistance,
      childArr.length,
      config,
    ]);

    const swapBackward = useCallback(() => {
      if (isAnimating.current) return;
      if (order.current.length < 2) return;

      isAnimating.current = true;

      activeTimeline.current?.kill();

      const total = childArr.length;

      const currentOrder = [...order.current];

      const last = currentOrder[currentOrder.length - 1];
      const rest = currentOrder.slice(0, -1);

      const newOrder = [last, ...rest];

      order.current = newOrder;

      newOrder.forEach((cardIdx, visualIndex) => {
        const el = cardRefs.current[cardIdx];

        if (!el) return;

        const slot = makeSlot(
          visualIndex,
          cardDistance,
          verticalDistance,
          total
        );

        gsap.to(el, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          zIndex: slot.zIndex,
          duration: 1,
          ease: config.ease,
        });
      });

      gsap.delayedCall(1, () => {
        isAnimating.current = false;
      });
    }, [
      cardDistance,
      verticalDistance,
      childArr.length,
      config.ease,
    ]);

    const stopAutoPlay = useCallback(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, []);

    const startAutoPlay = useCallback(() => {
      if (intervalRef.current) return;

      intervalRef.current = window.setInterval(() => {
        swapForward();
      }, delay);
    }, [delay, swapForward]);

    useImperativeHandle(ref, () => ({
      next: swapForward,
      prev: swapBackward,
    }));

    useEffect(() => {
      if (!container.current) return;

      const ctx = gsap.context(() => {
        order.current = Array.from(
          { length: childArr.length },
          (_, i) => i
        );

        positionCards();

        startAutoPlay();

        if (pauseOnHover && container.current) {
          const node = container.current;

          const pause = () => stopAutoPlay();
          const resume = () => startAutoPlay();

          node.addEventListener("mouseenter", pause);
          node.addEventListener("mouseleave", resume);

          return () => {
            node.removeEventListener("mouseenter", pause);
            node.removeEventListener("mouseleave", resume);
          };
        }
      }, container);

      return () => {
        ctx.revert();

        activeTimeline.current?.kill();

        stopAutoPlay();
      };
    }, [
      childArr.length,
      pauseOnHover,
      positionCards,
      startAutoPlay,
      stopAutoPlay,
    ]);

    return (
      <div
        className="relative isolate"
        style={{
          width,
          height,
        }}
      >
        <div
          ref={container}
          className="absolute inset-0 perspective-[2000px] overflow-visible max-md:scale-[0.82] max-md:translate-x-4"
        >
          {childArr.map((child, i) =>
            isValidElement(child)
              ? cloneElement(child as ReactElement<any>, {
                  key: i,
                  ref: (el: HTMLDivElement | null) =>
                    (cardRefs.current[i] = el),
                  style: {
                    width,
                    height,
                    ...(child.props.style ?? {}),
                  },
                  onClick: (e: React.MouseEvent<HTMLDivElement>) => {
                    child.props.onClick?.(e);
                    onCardClick?.(i);
                  },
                })
              : child
          )}
        </div>

        {/* Minimal Controls */}
        <div className="pointer-events-none absolute -bottom-16 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3">
          <button
            type="button"
            aria-label="Previous card"
            onClick={swapBackward}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-[#fffef1]/80 text-black backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-black/20 hover:bg-white active:scale-95"
          >
            <ChevronLeft size={16} strokeWidth={2} />
          </button>

          <button
            type="button"
            aria-label="Next card"
            onClick={swapForward}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-[#fffef1]/80 text-black backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-black/20 hover:bg-white active:scale-95"
          >
            <ChevronRight size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  }
);

CardSwap.displayName = "CardSwap";

export default CardSwap;