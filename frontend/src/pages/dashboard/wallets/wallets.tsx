import { useMemo, useRef, useState, useEffect } from "react";
import StackedCards from "@/components/ui/stacked-credit-cards";
import { useGSAP } from "@gsap/react";
import { type CreditCard } from "@/components/ui/credit-card";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import GrowthIcon from "@/components/assets/growth";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { gsap } from "@/lib/animations";
import SearchBox from "@/components/ui/search-box";
import ListData from "@/pages/dashboard/wallets/list-data";
import { formatCurrency, cn } from "@/lib/utils";
import { Plus, CreditCard as CreditCardIcon } from "lucide-react";
import Link from "@/components/ui/link";
import paymentData from "@/pages/dashboard/wallets/payment-data.json";
import cardsData from "@/pages/dashboard/wallets/data.json";
import { ScrollArea } from "@/components/ui/scroll-area";

const cards = cardsData as CreditCard[];
const payments = paymentData as typeof paymentData;

const Wallets = () => {
  const [activeTab, setActiveTab] = useState<"All" | "Regular">("All");
  const containerRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const allTabRef = useRef<HTMLButtonElement>(null);
  const regularTabRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Animate tab underline
  useGSAP(() => {
    if (!underlineRef.current || !containerRef.current) return;
    const activeTabRef =
      activeTab === "All" ? allTabRef.current : regularTabRef.current;
    if (activeTabRef) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tabRect = activeTabRef.getBoundingClientRect();
      gsap.to(underlineRef.current, {
        x: tabRect.left - containerRect.left,
        width: activeTabRef.offsetWidth,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [activeTab]);

  // Initial underline position
  useGSAP(() => {
    if (!underlineRef.current || !allTabRef.current || !containerRef.current)
      return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const tabRect = allTabRef.current.getBoundingClientRect();
    gsap.set(underlineRef.current, {
      x: tabRect.left - containerRect.left,
      width: allTabRef.current.offsetWidth,
    });
  }, []);

  // ✅ Fade animation when tab content changes
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [activeTab]);

  // ✅ Fixed filter logic
  const filteredPayments = useMemo(() => {
    return activeTab === "Regular"
      ? payments.filter((p) => p.regular)
      : payments;
  }, [activeTab]);

  const upcomingPayments = useMemo(() => {
    return payments.filter((p) => new Date(p.upcoming).getTime() > Date.now());
  }, [payments]);

  return (
    <div className="min-h-screen p-4 py-8 lg:flex">
      <div className="lg:w-1/2">
        <StackedCards cards={cards} />
        <div className="px-4 pt-8 pb-4">
          <Card className="bg-secondary/10">
            <CardHeader className="text-sm text-secondary">
              Your balance
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span>{formatCurrency(5240)}</span>
              <div className="flex gap-4 items-center">
                <span className="flex gap-2 text-emerald-500 text-sm items-end">
                  <GrowthIcon className="size-6 fill-emerald-500" />
                  23.65%
                </span>
                <span className="flex gap-2 text-red-500 text-sm items-end">
                  <GrowthIcon className="size-6 fill-red-500 rotate-180" />
                  23.65%
                </span>
              </div>
            </CardContent>
            <div className="px-6 pb-6">
              <Separator className="bg-white" />
            </div>
            <CardFooter className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary">Currency</p>
                <span className="text-sm">USD / US Dollar</span>
              </div>
              <div>
                <p className="text-sm text-secondary">Status</p>
                <span className="text-sm">Active</span>
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="px-4 space-y-4">
          <Button variant="secondary" className="w-full text-emerald-500">
            <Plus /> Add New Card
          </Button>
          <Button
            asChild
            variant="secondary"
            className="w-full text-emerald-600 hover:text-emerald-700"
            aria-label="View all cards"
          >
            <Link to="/dashboard/wallets/cards">
              <CreditCardIcon />
              View all cards
            </Link>
          </Button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="lg:w-1/2 p-5" ref={contentRef}>
        <h4 className="text-lg pb-6">My Payments</h4>

        <div>
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-4 text-secondary relative"
              ref={containerRef}
            >
              <button
                ref={allTabRef}
                onClick={() => setActiveTab("All")}
                className={cn(
                  "relative pb-2 transition-colors",
                  activeTab === "All"
                    ? "text-foreground font-medium"
                    : "text-secondary hover:text-foreground"
                )}
              >
                All payments
              </button>
              <button
                ref={regularTabRef}
                onClick={() => setActiveTab("Regular")}
                className={cn(
                  "relative pb-2 transition-colors",
                  activeTab === "Regular"
                    ? "text-foreground font-medium"
                    : "text-secondary hover:text-foreground"
                )}
              >
                Regular payments
              </button>
            </div>
            <SearchBox
              placeholder="Search..."
              className="bg-transparent w-32 focus-within:ring-0 outline-none"
              iconClassName="size-4"
              inputClassName="w-full"
            />
          </div>

          <div className="relative">
            <div className="bg-secondary/50 h-0.5 rounded-md my-2" />
            <div
              ref={underlineRef}
              className="absolute top-0 left-0 h-0.5 bg-emerald-500 rounded-md w-0 z-10"
            />
          </div>
        </div>

        <div className="py-2 space-y-2">
          <h6 className="text-sm text-secondary">
            {activeTab === "All" ? "Today" : "Regular Payments"}
          </h6>
          <ScrollArea className="h-[300px] rounded-md border px-4">
            {filteredPayments.map((p, i) => (
              <ListData
                key={i}
                image={p.image}
                name={p.name}
                date={new Date(p.date)}
                amount={p.amount}
              />
            ))}
          </ScrollArea>
        </div>

        {activeTab === "All" && (
          <div className="py-2 space-y-2">
            <h4 className="text-lg py-2">Upcoming Payments</h4>
            <h6 className="text-sm text-secondary">Next month</h6>
            <ScrollArea className="h-[200px] rounded-md border px-4">
              {upcomingPayments.map((p, i) => (
                <ListData
                  key={i}
                  image={p.image}
                  name={p.name}
                  date={new Date(p.upcoming)}
                  amount={p.amount}
                />
              ))}
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallets;
