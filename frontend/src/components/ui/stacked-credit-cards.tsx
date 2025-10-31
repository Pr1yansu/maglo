"use client";

import type React from "react";

import { useMemo, useState, useRef } from "react";
import CreditCardComponent, {
  type CreditCard,
} from "@/components/ui/credit-card";
import { gsap } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";

type StackedCardsProps = {
  cards: CreditCard[];
  className?: string;
  initialActiveId?: string;
  onSelect?: (card: CreditCard) => void;
};

export default function StackedCards({
  cards,
  className,
  initialActiveId,
  onSelect,
}: StackedCardsProps) {
  const initialIndex = useMemo(() => {
    if (!initialActiveId) return 0;
    const idx = cards.findIndex((c) => c.id === initialActiveId);
    return idx >= 0 ? idx : 0;
  }, [cards, initialActiveId]);

  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const startX = useRef(0);
  const currentX = useRef(0);

  useGSAP(() => {
    setFlippedCardId(null);
    const timer = setTimeout(() => updateLayout(true), 10);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  useGSAP(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && activeIndex > 0) {
        handleSelect(activeIndex - 1);
      } else if (e.key === "ArrowRight" && activeIndex < cards.length - 1) {
        handleSelect(activeIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, cards.length]);

  const updateLayout = (animate = true) => {
    const els = itemRefs.current.filter(Boolean) as HTMLLIElement[];
    els.forEach((el, i) => {
      const isActive = i === activeIndex;
      let transform = "translateX(-50%)  translateY(-50%) scale(1)";
      let zIndex = 50;
      let opacity = 1;

      if (!isActive) {
        const offset = Math.abs(i - activeIndex);
        transform = `translateX(-50%)  translateY(-50%) translateY(${offset * 16}px) scale(${1 - offset * 0.04})`;
        zIndex = 50 - offset;
        opacity = Math.max(0.5, 1 - offset * 0.12);
      } else {
        zIndex = 100;
      }

      const vars = {
        transform,
        zIndex,
        opacity,
        duration: animate ? 0.5 : 0,
        ease: "power2.out" as const,
      };
      gsap.to(el, vars);
    });
  };

  useGSAP(() => {
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;
    const els = itemRefs.current.filter(Boolean) as HTMLLIElement[];
    if (!els.length) return;

    const ctx = gsap.context(() => {
      updateLayout(false);

      if (!prefersReduced) {
        gsap.fromTo(
          els,
          {
            opacity: 0,
          },
          {
            opacity: (i) => {
              const isActive = i === activeIndex;
              const offset = Math.abs(i - activeIndex);
              return isActive ? 1 : Math.max(0.5, 1 - offset * 0.12);
            },
            duration: 0.6,
            ease: "power2.out",
          },
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, [cards]);

  if (!cards || cards.length === 0) {
    return (
      <div
        className={cn(
          "w-full text-center text-sm text-muted-foreground py-8",
          className,
        )}
      >
        No cards available
      </div>
    );
  }

  const handleSelect = (index: number) => {
    if (index < 0 || index >= cards.length) return;
    setActiveIndex(index);
    onSelect?.(cards[index]);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    currentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const diff = startX.current - currentX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && activeIndex < cards.length - 1) {
        handleSelect(activeIndex + 1);
      } else if (diff < 0 && activeIndex > 0) {
        handleSelect(activeIndex - 1);
      }
    }

    setIsDragging(false);
    startX.current = 0;
    currentX.current = 0;
  };

  return (
    <div className={cn("relative w-full max-w-lg", className)}>
      <div
        ref={containerRef}
        className="relative h-[280px] w-full flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <ul className="relative list-none p-0 m-0 h-full w-full flex items-center justify-center">
          {cards.map((card, i) => {
            const isActive = i === activeIndex;
            const isFlipped = flippedCardId === card.id;

            return (
              <li
                key={card.id}
                ref={(el) => (itemRefs.current[i] = el)}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] will-change-transform"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (isActive) {
                      setFlippedCardId(isFlipped ? null : card.id);
                    } else {
                      handleSelect(i);
                    }
                  }}
                  onFocus={() => handleSelect(i)}
                  className={cn(
                    "block w-full text-left focus:outline-none rounded-2xl",
                    "transition-all duration-300 ease-out group cursor-pointer",
                    isActive && "drop-shadow-[0_10px_25px_rgba(0,0,0,0.25)]",
                  )}
                  aria-label={`Select card ${card.cardName}`}
                  tabIndex={isActive ? 0 : -1}
                  onMouseMove={(e) => {
                    if (!isActive) return;
                    const target = (e.currentTarget.querySelector(
                      ".tilt-wrapper",
                    ) as HTMLDivElement)!;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const px = (e.clientX - rect.left) / rect.width - 0.5;
                    const py = (e.clientY - rect.top) / rect.height - 0.5;
                    const rotateY = px * 8;
                    const rotateX = -py * 8;
                    gsap.to(target, {
                      rotateY,
                      rotateX,
                      transformPerspective: 800,
                      duration: 0.2,
                      ease: "power2.out",
                    });
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget.querySelector(
                      ".tilt-wrapper",
                    ) as HTMLDivElement;
                    if (!target) return;
                    gsap.to(target, {
                      rotateX: 0,
                      rotateY: 0,
                      duration: 0.4,
                      ease: "power2.out",
                    });
                  }}
                >
                  <div className="tilt-wrapper will-change-transform">
                    <CreditCardComponent
                      card={card}
                      isFlipped={isFlipped}
                      className={cn("transition-all duration-300")}
                    />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {cards.length > 1 && (
        <div className="mt-12 space-y-3 pb-4">
          <div className="flex items-center justify-center gap-2">
            {cards.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelect(i)}
                className={cn(
                  "relative h-2 rounded-full transition-all duration-300 hover:opacity-100 hover:scale-110",
                  i === activeIndex
                    ? "w-8 bg-primary shadow-sm"
                    : "w-2 bg-muted-foreground/50 hover:bg-muted-foreground/70",
                )}
                aria-label={`Go to card ${i + 1}`}
                aria-current={i === activeIndex}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
