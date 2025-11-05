import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useStaggerAnimation } from "@/hooks/use-animations";
import { RealTimeCardData } from "@/pages/dashboard/dashboard";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// Hook for animated counting
const useCountingAnimation = (
  endValue: number,
  duration: number = 2,
  prefix: string = "",
  suffix: string = "",
  decimals: number = 0
) => {
  const [currentValue, setCurrentValue] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    // Create the counting animation
    const obj = { value: 0 };

    animationRef.current = gsap.to(obj, {
      value: endValue,
      duration: duration,
      ease: "power2.out",
      onUpdate: () => {
        setCurrentValue(obj.value);
      },
      delay: 0.5, // Delay to sync with card appearance
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [endValue, duration]);

  const formatValue = (value: number) => {
    let formattedValue: string;

    if (decimals > 0) {
      formattedValue = value.toFixed(decimals);
    } else {
      formattedValue = Math.floor(value).toString();
    }

    // Add commas for thousands
    formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return `${prefix}${formattedValue}${suffix}`;
  };

  return {
    ref: elementRef,
    displayValue: formatValue(currentValue),
  };
};

// Helper function to parse value from string
const parseValueFromString = (valueString: string) => {
  // Remove currency symbols, commas, and other non-numeric characters except decimal point
  const cleanString = valueString.replace(/[$,]/g, "");
  const numericValue = parseFloat(cleanString);

  // Determine prefix and suffix
  const prefix = valueString.includes("$") ? "$" : "";
  const suffix = "";

  // Determine decimal places
  const decimals = valueString.includes(".") ? 2 : 0;

  return {
    value: isNaN(numericValue) ? 0 : numericValue,
    prefix,
    suffix,
    decimals,
  };
};

// Individual card component with counting animation
const AnimatedCard = ({ item, index }: { item: any; index: number }) => {
  const { itemsRef } = useStaggerAnimation(0.1);

  // Parse the value string to get numeric value and formatting
  const parsedValue = parseValueFromString(item.value);

  const { ref: countingRef, displayValue } = useCountingAnimation(
    parsedValue.value,
    2, // 2 second duration
    parsedValue.prefix,
    parsedValue.suffix,
    parsedValue.decimals
  );

  const IconComponent = item.icon;

  return (
    <Card
      ref={(el) => (itemsRef.current[index] = el)}
      className={cn(
        "opacity-0 hover:shadow-lg transition-all duration-300 cursor-pointer group ",
        "border-l-4",
        item.isPositive
          ? "!border-l-emerald-500 border-emerald-500/10"
          : "!border-l-red-500 border-red-500/10",
        item.isPositive ? " hover:bg-emerald-500/10" : "hover:bg-red-500/10"
      )}
      role="article"
      aria-labelledby={`card-title-${index}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3
          id={`card-title-${index}`}
          className="text-sm font-medium text-muted-foreground"
        >
          {item.title}
        </h3>
        <IconComponent
          className={cn(
            "h-4 w-4 text-muted-foreground",
            item.isPositive ? "text-emerald-500" : "text-red-500"
          )}
        />
      </CardHeader>
      <CardContent>
        <div
          ref={countingRef}
          className="text-2xl font-bold mb-1 font-mono tabular-nums"
        >
          {displayValue}
        </div>
        <p
          className={cn(
            "text-xs flex items-center gap-1",
            item.isPositive ? "text-emerald-500" : "text-red-500"
          )}
        >
          {item.isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {item.trend} from last month
        </p>
      </CardContent>
    </Card>
  );
};

const RealTimeCards = ({ data }: { data: RealTimeCardData }) => {
  if (data.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No real-time data available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item, index) => (
        <AnimatedCard key={index} item={item} index={index} />
      ))}
    </div>
  );
};

export default RealTimeCards;
