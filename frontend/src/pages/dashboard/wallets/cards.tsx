import { useRef } from "react";
import CreditCard, {
  type CreditCard as CreditCardType,
} from "@/components/ui/credit-card";
import cardsData from "@/pages/dashboard/wallets/data.json";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animations";

const cards = cardsData as CreditCardType[];

export default function AllCards() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll(".card-item");
    gsap.fromTo(
      items,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.08 }
    );
  }, []);

  return (
    <div className="p-4" ref={containerRef}>
      <h3 className="text-lg font-semibold mb-4">All Cards</h3>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card, idx) => (
          <div key={card.id || idx} className="card-item">
            <CreditCard card={card} />
          </div>
        ))}
      </div>
    </div>
  );
}
