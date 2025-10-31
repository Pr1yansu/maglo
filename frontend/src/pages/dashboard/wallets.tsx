import StackedCards from "@/components/ui/stacked-credit-cards";
import { type CreditCard as CreditCardType } from "@/components/ui/credit-card";

export const demoCards: CreditCardType[] = [
  {
    id: "1",
    cardName: "Personal Account",
    cardNumber: "4111 1111 1111 4729",
    cardholderName: "Priyansu Chowdhury",
    expiryDate: "12/27",
    brand: "visa",
    color: "indigo",
    balance: "$4,250.32",
    cvv: "274",
  },
  {
    id: "2",
    cardName: "Daily Expenses",
    cardNumber: "5555 5555 5555 8352",
    cardholderName: "Priyansu Chowdhury",
    expiryDate: "08/26",
    brand: "mastercard",
    color: "amber",
    balance: "$1,578.45",
    cvv: "832",
  },
  {
    id: "3",
    cardName: "Business Wallet",
    cardNumber: "3782 8224 6310 005",
    cardholderName: "Priyansu Chowdhury",
    expiryDate: "03/29",
    brand: "amex",
    color: "emerald",
    balance: "$12,890.00",
    cvv: "8341",
  },
  {
    id: "4",
    cardName: "Travel Rewards",
    cardNumber: "6011 0009 9013 2204",
    cardholderName: "Priyansu Chowdhury",
    expiryDate: "11/28",
    brand: "discover",
    color: "purple",
    balance: "$2,431.76",
    cvv: "220",
  },
];

const Wallets = () => {
  return (
    <div className="min-h-screen p-4 py-8">
      <StackedCards cards={demoCards} />
    </div>
  );
};

export default Wallets;
