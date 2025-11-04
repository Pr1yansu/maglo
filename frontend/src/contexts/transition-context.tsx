import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import { animationUtils } from "@/lib/animations";

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

  const setTransitionDirection = (direction: TransitionDirection) => {
    directionRef.current = direction;
    _setTransitionDirection(direction);
  };

  useEffect(() => {
    return () => {
      animationUtils.transitionUtils.showScrollbars();
      if (containerRef.current) {
        animationUtils.transitionUtils.cleanup(containerRef.current);
      }
    };
  }, []);

  const startTransition = useCallback(
    async (callback: () => void, _type?: TransitionType) => {
      if (isTransitioning || !containerRef.current) return;

      setIsTransitioning(true);

      const restoreScrollbars = () => {
        animationUtils.transitionUtils.showScrollbars();
        setIsTransitioning(false);
      };

      try {
        // Just perform the navigation without any animations
        callback();
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Immediately restore scrollbars and finish transition
        restoreScrollbars();
      } catch (error) {
        console.error("Transition error:", error);
        restoreScrollbars();
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
