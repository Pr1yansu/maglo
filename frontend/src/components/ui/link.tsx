import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useTransition,
  TransitionType,
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
  transitionType?: TransitionType;
}

const Link = ({
  to,
  children,
  replace = false,
  state,
  preventTransition = false,
  transitionDirection,
  transitionType, // Remove default, let it use context default
  className,
  onClick,
  ...props
}: LinkProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    startTransition,
    setTransitionDirection,
    setTransitionType,
    isTransitioning,
    transitionType: contextTransitionType, // Get from context
  } = useTransition();

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
      ];

      const currentIndex = routeHierarchy.indexOf(currentPath);
      const targetIndex = routeHierarchy.indexOf(targetPath);

      if (currentIndex === -1 || targetIndex === -1) {
        return "forward";
      }

      return targetIndex > currentIndex ? "forward" : "backward";
    };

    if (onClick) {
      onClick(e);
    }

    if (isTransitioning || location.pathname === to) {
      return;
    }

    const direction =
      transitionDirection || determineDirection(location.pathname, to);
    setTransitionDirection(direction);

    // Only set transition type if explicitly provided, otherwise use context default
    if (transitionType) {
      setTransitionType(transitionType);
    }

    if (preventTransition) {
      navigate(to, { replace, state });
    } else {
      await startTransition(() => {
        navigate(to, { replace, state });
      }, transitionType || contextTransitionType);
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
