import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import { animations, animationUtils } from "@/lib/animations";

export type TransitionType = "slide" | "fade" | "scale";
export type TransitionDirection = "forward" | "backward";

interface TransitionContextType {
  containerRef: React.RefObject<HTMLDivElement>;
  isTransitioning: boolean;
  startTransition: (
    callback: () => void,
    type?: TransitionType,
  ) => Promise<void>;
  setTransitionDirection: (direction: TransitionDirection) => void;
  setTransitionType: (type: TransitionType) => void;
  transitionDirection: TransitionDirection;
  transitionType: TransitionType;
}

const TransitionContext = createContext<TransitionContextType | undefined>(
  undefined,
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
    defaultTransitionType,
  );

  // ✅ Keep direction state + ref fully in sync instantly
  const [transitionDirection, _setTransitionDirection] =
    useState<TransitionDirection>("forward");
  const directionRef = useRef<TransitionDirection>("forward");

  // custom setter that updates both immediately
  const setTransitionDirection = (direction: TransitionDirection) => {
    directionRef.current = direction;
    _setTransitionDirection(direction);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      animationUtils.transitionUtils.showScrollbars();
      if (containerRef.current) {
        animationUtils.transitionUtils.cleanup(containerRef.current);
      }
    };
  }, []);

  const startTransition = useCallback(
    async (callback: () => void, type: TransitionType = transitionType) => {
      if (isTransitioning || !containerRef.current) return;

      setIsTransitioning(true);
      const container = containerRef.current;

      const restoreScrollbars = () => {
        animationUtils.transitionUtils.showScrollbars();
        setIsTransitioning(false);
      };

      try {
        animationUtils.transitionUtils.hideScrollbars();

        const currentDirection = directionRef.current;

        // -------- EXIT Animation --------
        let exitAnimation: gsap.core.Tween;
        switch (type) {
          case "slide":
            exitAnimation =
              currentDirection === "forward"
                ? animations.routeTransitions.slideLeft.exit(container)
                : animations.routeTransitions.slideRight.exit(container);
            break;
          case "fade":
            exitAnimation = animations.routeTransitions.fade.exit(container);
            break;
          case "scale":
            exitAnimation = animations.routeTransitions.scale.exit(container);
            break;
          default:
            exitAnimation = animations.routeTransitions.fade.exit(container);
        }

        await exitAnimation.then();

        // -------- NAVIGATION --------
        callback();
        await new Promise((resolve) => setTimeout(resolve, 50));

        // -------- ENTER Animation --------
        let enterAnimation: gsap.core.Tween;
        switch (type) {
          case "slide":
            enterAnimation =
              currentDirection === "forward"
                ? animations.routeTransitions.slideLeft.enter(container)
                : animations.routeTransitions.slideRight.enter(container);
            break;
          case "fade":
            enterAnimation = animations.routeTransitions.fade.enter(container);
            break;
          case "scale":
            enterAnimation = animations.routeTransitions.scale.enter(container);
            break;
          default:
            enterAnimation = animations.routeTransitions.fade.enter(container);
        }

        enterAnimation.eventCallback("onComplete", restoreScrollbars);
      } catch (error) {
        console.error("Transition error:", error);
        restoreScrollbars();
      }
    },
    [isTransitioning, transitionType],
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
