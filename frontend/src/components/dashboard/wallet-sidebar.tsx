import StackedCards from "@/components/ui/stacked-credit-cards";
import ListData from "@/pages/dashboard/wallets/list-data";
import cardsData from "@/pages/dashboard/wallets/data.json";
import paymentData from "@/pages/dashboard/wallets/payment-data.json";
import { CreditCard } from "@/components/ui/credit-card";

const cards = cardsData as CreditCard[];

const WalletSidebar = () => {
  return (
    <div className="space-y-6">
      <div>
        <header className="mb-4">
          <h2 className="text-lg font-semibold">Your Wallets</h2>
          <p className="text-muted-foreground text-sm">
            Manage your payment methods
          </p>
        </header>
        <StackedCards cards={cards} className="w-full max-w-96" />
      </div>

      <div>
        <header className="mb-4">
          <h2 className="text-lg font-semibold">Scheduled Payments</h2>
        </header>
        {paymentData.length > 0 ? (
          <div className="space-y-2">
            {paymentData.map((payment, indx) => (
              <ListData
                key={indx}
                amount={payment.amount}
                date={new Date(payment.date)}
                image={payment.image}
                name={payment.name}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No scheduled payments found.</p>
        )}
      </div>
    </div>
  );
};

export default WalletSidebar;
