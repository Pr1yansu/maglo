import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useTransition,
  TransitionDirection,
} from "@/contexts/transition-context";
import { cn } from "@/lib/utils";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
  replace?: boolean;
  state?: any;
  preventTransition?: boolean;
  transitionDirection?: TransitionDirection;
}

const Link = ({
  to,
  children,
  replace = false,
  state,
  preventTransition = false,
  transitionDirection,
  className,
  onClick,
  ...props
}: LinkProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { startTransition, setTransitionDirection, isTransitioning } =
    useTransition();

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const determineDirection = (
      currentPath: string,
      targetPath: string
    ): TransitionDirection => {
      const routeHierarchy = [
        "/",
        "/login",
        "/register",
        "/dashboard",
        "/dashboard/transactions",
        "/dashboard/invoices",
        "/dashboard/invoices/new",
        "/dashboard/wallets",
        "/dashboard/wallets/cards",
        "/dashboard/settings",
        "/help",
      ];

      // Normalize paths by removing trailing slashes
      const normalizedCurrent = currentPath.replace(/\/$/, "");
      const normalizedTarget = targetPath.replace(/\/$/, "");

      const currentIndex = routeHierarchy.indexOf(normalizedCurrent);
      const targetIndex = routeHierarchy.indexOf(normalizedTarget);

      // If exact match not found, try to find parent route
      const findClosestIndex = (path: string) => {
        let index = routeHierarchy.indexOf(path);
        if (index !== -1) return index;

        // Try to find the closest parent route
        for (let i = routeHierarchy.length - 1; i >= 0; i--) {
          if (path.startsWith(routeHierarchy[i]) && routeHierarchy[i] !== "/") {
            return i;
          }
        }
        return 0; // Default to home
      };

      const currentIdx =
        currentIndex !== -1
          ? currentIndex
          : findClosestIndex(normalizedCurrent);
      const targetIdx =
        targetIndex !== -1 ? targetIndex : findClosestIndex(normalizedTarget);

      return targetIdx > currentIdx ? "forward" : "backward";
    };

    if (onClick) {
      onClick(e);
    }

    if (isTransitioning || location.pathname === to) {
      console.log(
        "🚫 Link click blocked - already transitioning or same route"
      );
      return;
    }

    const direction =
      transitionDirection || determineDirection(location.pathname, to);

    console.log(`🔗 Link clicked: ${location.pathname} → ${to} (${direction})`);

    setTransitionDirection(direction);

    if (preventTransition) {
      console.log("🚀 Direct navigation (no transition)");
      navigate(to, { replace, state });
    } else {
      console.log("🎭 Starting transition animation...");
      await startTransition(() => {
        navigate(to, { replace, state });
      });
    }
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={cn(
        "transition-colors duration-200 hover:opacity-80",
        isTransitioning && "pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
};

export default Link;
