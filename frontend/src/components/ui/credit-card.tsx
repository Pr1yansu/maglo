"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export interface CreditCard {
  id: string;
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  cardType?: "visa" | "mastercard" | "amex" | "discover";
  brand?: "visa" | "mastercard" | "amex" | "discover";
  color?:
    | "blue"
    | "purple"
    | "emerald"
    | "rose"
    | "amber"
    | "teal"
    | "slate"
    | "indigo"
    | "cyan"
    | "fuchsia";
  balance?: string;
}

interface CreditCardComponentProps {
  card: CreditCard;
  className?: string;
  isFlipped?: boolean;
  onFlip?: (flipped: boolean) => void;
}

export default function CreditCardComponent({
  card,
  className,
  isFlipped = false,
  onFlip,
}: CreditCardComponentProps) {
  const [flipped, setFlipped] = useState(isFlipped);

  const handleFlip = () => {
    const newFlipped = !flipped;
    setFlipped(newFlipped);
    onFlip?.(newFlipped);
  };

  const brand = card.brand ?? card.cardType ?? "visa";
  const { cardNumber, expiryDate, cardholderName, cardName, cvv } = card;

  const maskedCardNumber = useMemo(() => {
    const digits = cardNumber.replace(/\s+/g, "");
    const masked = digits
      .split("")
      .map((ch: string, idx: number) =>
        idx < digits.length - 4 && /\d/.test(ch) ? "•" : ch,
      )
      .join("")
      .replace(/(.{4})/g, "$1 ")
      .trim();
    return masked;
  }, [cardNumber]);

  const gradientClass = useMemo(() => {
    if (card.color) {
      const c = card.color;
      const map: Record<string, string> = {
        blue: "from-blue-500 to-blue-800",
        purple: "from-violet-600 to-fuchsia-700",
        emerald: "from-emerald-500 to-emerald-800",
        rose: "from-rose-500 to-pink-700",
        amber: "from-amber-500 to-orange-700",
        teal: "from-teal-500 to-cyan-700",
        slate: "from-slate-600 to-slate-900",
        indigo: "from-indigo-500 to-indigo-800",
        cyan: "from-cyan-500 to-sky-700",
        fuchsia: "from-fuchsia-500 to-purple-700",
      };
      return map[c] ?? map.blue;
    }
    switch (brand) {
      case "mastercard":
        return "from-orange-500 to-red-600";
      case "amex":
        return "from-sky-600 to-blue-900";
      case "discover":
        return "from-amber-500 to-zinc-800";
      case "visa":
      default:
        return "from-blue-500 to-blue-700";
    }
  }, [brand, card.color]);

  const BrandLogo = () => {
    switch (brand) {
      case "mastercard":
        return (
          <div className="flex items-center gap-1">
            <span className="relative inline-flex">
              <span className="w-6 h-6 rounded-full bg-red-500/90" />
              <span className="w-6 h-6 rounded-full bg-orange-400/90 -ml-3 mix-blend-screen" />
            </span>
          </div>
        );
      case "amex":
        return <div className="text-sm font-black tracking-wider">AMEX</div>;
      case "discover":
        return (
          <div className="text-sm font-bold tracking-wider">
            <span className="text-white">DISC</span>
            <span className="text-amber-300">OVER</span>
          </div>
        );
      case "visa":
      default:
        return <div className="text-xl font-black tracking-wide">VISA</div>;
    }
  };

  return (
    <div
      className={cn(
        "relative w-full aspect-video cursor-pointer perspective border-0 outline-none",
        className,
      )}
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleFlip();
        }
      }}
      aria-label={`${cardName} card, click to flip`}
    >
      <div
        className={cn("relative w-full h-full card-3d", flipped && "flipped")}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br",
            gradientClass,
            "p-6 text-white shadow-xl",
            "flex flex-col justify-between",
            "backface-hidden",
          )}
        >
          <div className="absolute inset-0">
            <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute inset-0 opacity-20 card-dots-overlay" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <div className="text-[10px] uppercase tracking-wider opacity-80">
                  {card.cardType ? card.cardType : brand}
                </div>
                <div className="text-lg font-semibold">{cardName}</div>
              </div>
              <BrandLogo />
            </div>

            <div>
              <div className="text-xs opacity-80 mb-2">Card Number</div>
              <div className="text-xl font-mono tracking-widest">
                {maskedCardNumber}
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs opacity-80 mb-1">Card Holder</div>
                <div className="text-sm font-semibold">{cardholderName}</div>
              </div>
              <div>
                <div className="text-xs opacity-80 mb-1">Expires</div>
                <div className="text-sm font-mono">{expiryDate}</div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br",
            gradientClass,
            "p-6 text-white shadow-xl",
            "flex flex-col justify-center items-center",
            "backface-hidden rotate-y-180",
          )}
        >
          <div className="absolute inset-0">
            <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative z-10 w-full">
            <div className="mb-8">
              <div className="bg-black/40 h-12 rounded mb-4" />
              <p className="text-xs text-center opacity-70">
                Authorized Signature
              </p>
              <div className="mt-2 border-b border-white/30" />
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded p-4 text-center">
              <p className="text-xs opacity-70 mb-2">Security Code</p>
              <p className="text-2xl font-mono tracking-widest">{cvv}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flip hint */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        Click to flip
      </div>
    </div>
  );
}
