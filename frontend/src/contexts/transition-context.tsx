import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
} from "react";
import { gsap } from "gsap";

export type TransitionDirection = "forward" | "backward";

interface TransitionContextType {
  containerRef: React.RefObject<HTMLDivElement>;
  isTransitioning: boolean;
  startTransition: (callback: () => void) => Promise<void>;
  setTransitionDirection: (direction: TransitionDirection) => void;
  transitionDirection: TransitionDirection;
}

const TransitionContext = createContext<TransitionContextType | undefined>(
  undefined
);

interface TransitionProviderProps {
  children: React.ReactNode;
}

export const TransitionProvider = ({ children }: TransitionProviderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [transitionDirection, _setTransitionDirection] =
    useState<TransitionDirection>("forward");
  const directionRef = useRef<TransitionDirection>("forward");

  const setTransitionDirection = (direction: TransitionDirection) => {
    directionRef.current = direction;
    _setTransitionDirection(direction);
  };

  const startTransition = useCallback(
    async (callback: () => void) => {
      if (isTransitioning || !containerRef.current) return;

      setIsTransitioning(true);

      try {
        const container = containerRef.current;

        // Create background overlay for better visual contrast
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.backgroundColor = "hsl(var(--background))"; // Use CSS variable for theme support
        overlay.style.zIndex = "-1";
        overlay.style.opacity = "0";
        overlay.classList.add("transition-overlay");

        container.parentElement?.appendChild(overlay);

        // Set transform origin to center for proper scaling
        gsap.set(container, {
          transformOrigin: "center center",
        });

        // Phase 1: Scale down current page to center AND fade in background
        const scaleDownTl = gsap.timeline();

        scaleDownTl
          .to(container, {
            scale: 0.7,
            duration: 0.6,
            ease: "power2.out",
          })
          .to(
            overlay,
            {
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
            },
            0
          ); // Start overlay fade at same time

        // Wait for scale-down to complete and hold for a moment
        await scaleDownTl;

        // Brief pause to let user see the scaled-down state
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Phase 2: Fade out current page
        const fadeOutTl = gsap.timeline();

        fadeOutTl.to(container, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });

        await fadeOutTl;

        // Execute the callback (route change)
        callback();

        // Delay to ensure DOM updates
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Phase 3: Prepare new page (start from the right side)
        gsap.set(container, {
          scale: 0.7,
          x: "100%", // Start from right side
          opacity: 1,
          transformOrigin: "center center",
        });

        // Phase 4: Slide in from right and scale up new page
        const entranceTl = gsap.timeline();

        entranceTl
          .to(container, {
            x: "0%", // Slide to center
            duration: 0.5,
            ease: "power2.out",
          })
          .to(
            container,
            {
              scale: 1, // Scale up to full size
              duration: 0.6,
              ease: "power2.out",
            },
            "-=0.2" // Overlap scaling with sliding
          )
          .to(
            overlay,
            {
              opacity: 0,
              duration: 0.4,
              ease: "power2.out",
            },
            "-=0.4"
          ); // Fade out overlay during scale-up

        await entranceTl;

        // Cleanup overlay
        overlay.remove();
      } catch (error) {
        console.error("❌ Transition error:", error);

        // Emergency cleanup - ensure container is visible and positioned correctly
        if (containerRef.current) {
          gsap.set(containerRef.current, {
            scale: 1,
            x: "0%",
            opacity: 1,
            transformOrigin: "center center",
            clearProps: "all",
          });
        }

        // Cleanup overlay in case of error
        const overlay = document.querySelector(".transition-overlay");
        if (overlay) {
          overlay.remove();
        }
      } finally {
        setIsTransitioning(false);
      }
    },
    [isTransitioning]
  );

  const value: TransitionContextType = {
    containerRef,
    isTransitioning,
    startTransition,
    setTransitionDirection,
    transitionDirection,
  };

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
};
