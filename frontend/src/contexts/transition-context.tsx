import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import { animationUtils, gsap } from "@/lib/animations";

export type TransitionType = "slide" | "fade" | "scale";
export type TransitionDirection = "forward" | "backward";

interface TransitionContextType {
  containerRef: React.RefObject<HTMLDivElement>;
  isTransitioning: boolean;
  startTransition: (
    callback: () => void,
    type?: TransitionType
  ) => Promise<void>;
  setTransitionDirection: (direction: TransitionDirection) => void;
  setTransitionType: (type: TransitionType) => void;
  transitionDirection: TransitionDirection;
  transitionType: TransitionType;
}

const TransitionContext = createContext<TransitionContextType | undefined>(
  undefined
);

interface TransitionProviderProps {
  children: React.ReactNode;
  defaultTransitionType?: TransitionType;
}

export const TransitionProvider = ({
  children,
  defaultTransitionType = "slide",
}: TransitionProviderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState<TransitionType>(
    defaultTransitionType
  );

  const [transitionDirection, _setTransitionDirection] =
    useState<TransitionDirection>("forward");
  const directionRef = useRef<TransitionDirection>("forward");

  // Refs for overlay elements
  const whiteOverlayRef = useRef<HTMLDivElement | null>(null);
  const blackOverlayRef = useRef<HTMLDivElement | null>(null);

  const setTransitionDirection = (direction: TransitionDirection) => {
    directionRef.current = direction;
    _setTransitionDirection(direction);
  };

  useEffect(() => {
    // Create overlay elements
    const whiteOverlay = document.createElement("div");
    const blackOverlay = document.createElement("div");

    // Style white overlay
    whiteOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: white;
      z-index: 9998;
      transform: translateX(-100%);
      pointer-events: none;
    `;

    // Style black overlay
    blackOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: black;
      z-index: 9999;
      transform: translateX(-100%);
      pointer-events: none;
    `;

    document.body.appendChild(whiteOverlay);
    document.body.appendChild(blackOverlay);

    whiteOverlayRef.current = whiteOverlay;
    blackOverlayRef.current = blackOverlay;

    return () => {
      animationUtils.transitionUtils.showScrollbars();
      if (containerRef.current) {
        animationUtils.transitionUtils.cleanup(containerRef.current);
      }
      // Clean up overlay elements
      if (whiteOverlay.parentNode) {
        whiteOverlay.parentNode.removeChild(whiteOverlay);
      }
      if (blackOverlay.parentNode) {
        blackOverlay.parentNode.removeChild(blackOverlay);
      }
    };
  }, []);

  const startTransition = useCallback(
    async (callback: () => void, _type?: TransitionType) => {
      if (
        isTransitioning ||
        !containerRef.current ||
        !whiteOverlayRef.current ||
        !blackOverlayRef.current
      )
        return;

      console.log("🎬 Starting route transition animation...");
      setIsTransitioning(true);
      animationUtils.transitionUtils.hideScrollbars();

      const direction = directionRef.current;
      const whiteOverlay = whiteOverlayRef.current;
      const blackOverlay = blackOverlayRef.current;
      const container = containerRef.current;

      console.log(`📍 Direction: ${direction}`);

      // Set initial positions based on direction
      const fromX = direction === "forward" ? "-100%" : "100%";
      const toX = direction === "forward" ? "100%" : "-100%";

      try {
        // Reset overlay positions
        gsap.set([whiteOverlay, blackOverlay], { x: fromX });

        // Create the animation timeline
        const tl = gsap.timeline();

        console.log("⚪ White box sliding in...");
        // Step 1: White box comes from left/right across screen
        tl.to(whiteOverlay, {
          x: "0%",
          duration: 0.4,
          ease: "power3.out",
        });

        console.log("⚫ Black box overlapping...");
        // Step 2: Black box overlaps white box (slight delay for overlap effect)
        tl.to(
          blackOverlay,
          {
            x: "0%",
            duration: 0.3,
            ease: "power3.out",
          },
          "-=0.1"
        );

        // Step 3: Pre-hide the container to prevent flicker
        tl.call(() => {
          console.log("🫥 Pre-hiding container to prevent flicker...");
          gsap.set(container, { opacity: 0 });
        });

        // Step 4: Execute the route change callback during black overlay
        tl.call(() => {
          console.log("🔄 Executing route change...");
          callback();
        });

        // Small delay to ensure route change is processed
        tl.to({}, { duration: 0.1 });

        console.log("⚫ Black box sliding out...");
        // Step 5: Black box exits to right/left
        tl.to(blackOverlay, {
          x: toX,
          duration: 0.3,
          ease: "power3.in",
        });

        console.log("⚪ White box sliding out...");
        // Step 6: White box exits to right/left (overlapping with black box exit)
        tl.to(
          whiteOverlay,
          {
            x: toX,
            duration: 0.4,
            ease: "power3.in",
          },
          "-=0.15"
        );

        // Step 7: Start fading in content slightly before overlays finish exiting
        console.log("✨ Fading in new content...");
        tl.to(
          container,
          {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.2"
        );

        // Wait for the timeline to complete
        await tl;

        console.log("🎉 Route transition complete!");
        // Reset overlay positions for next transition
        gsap.set([whiteOverlay, blackOverlay], { x: fromX });
      } catch (error) {
        console.error("❌ Transition error:", error);
        // Reset states on error
        gsap.set([whiteOverlay, blackOverlay], { x: fromX });
        gsap.set(container, { opacity: 1 });
      } finally {
        animationUtils.transitionUtils.showScrollbars();
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
    setTransitionType,
    transitionDirection,
    transitionType,
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
