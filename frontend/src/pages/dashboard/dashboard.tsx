import { SEO } from "@/components/SEO";
import { CreditCard } from "@/components/ui/credit-card";
import StackedCards from "@/components/ui/stacked-credit-cards";
import cardsData from "@/pages/dashboard/wallets/data.json";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  CreditCard as CreditCardIcon,
} from "lucide-react";
import RealTimeCards from "@/components/dashboard/realtime-cards";
import WorkingCapitalChart from "@/components/dashboard/working-capital-chart";
import { dashboardColumns } from "@/pages/dashboard/transaction/transaction-table/dashboard-columns";
import { DataTable } from "@/components/ui/data-table";
import ListData from "@/pages/dashboard/wallets/list-data";
import paymentData from "@/pages/dashboard/wallets/payment-data.json";

const cards = cardsData as CreditCard[];

const RealTimeCardData = [
  {
    title: "Total Wallet Balance",
    value: "$12,450.75",
    icon: Wallet,
    trend: "+12.5%",
    isPositive: true,
  },
  {
    title: "Monthly Transactions",
    value: "1,250",
    icon: TrendingUp,
    trend: "+8.2%",
    isPositive: true,
  },
  {
    title: "Pending Invoices",
    value: "15",
    icon: Receipt,
    trend: "-3.1%",
    isPositive: false,
  },
  {
    title: "Completed Payments",
    value: "$8,300.00",
    icon: CreditCardIcon,
    trend: "+15.3%",
    isPositive: true,
  },
  {
    title: "Total Spending",
    value: "$5,200.50",
    icon: TrendingDown,
    trend: "-5.7%",
    isPositive: false,
  },
  {
    title: "Total Saved",
    value: "$3,150.25",
    icon: DollarSign,
    trend: "+23.4%",
    isPositive: true,
  },
];

export type RealTimeCardData = typeof RealTimeCardData;

const workingCapitalData = [
  {
    type: "income" as const,
    amount: 7500,
    date: new Date(),
  },
  {
    type: "expense" as const,
    amount: 3200,
    date: new Date().setDate(new Date().getDate() - 1),
  },
  {
    type: "income" as const,
    amount: 4200,
    date: new Date().setDate(new Date().getDate() - 2),
  },
  {
    type: "expense" as const,
    amount: 1500,
    date: new Date().setDate(new Date().getDate() - 3),
  },
  {
    type: "income" as const,
    amount: 3800,
    date: new Date().setDate(new Date().getDate() - 4),
  },
  {
    type: "expense" as const,
    amount: 2100,
    date: new Date().setDate(new Date().getDate() - 5),
  },
  {
    type: "income" as const,
    amount: 5200,
    date: new Date().setDate(new Date().getDate() - 6),
  },
  {
    type: "expense" as const,
    amount: 1800,
    date: new Date().setDate(new Date().getDate() - 7),
  },
];

const Dashboard = () => {
  return (
    <>
      <SEO
        title="Dashboard - Financial Overview"
        description="View your complete financial overview with real-time data on transactions, wallet balances, recent invoices, and key financial metrics in your Maglo dashboard."
        keywords="dashboard, financial overview, wallet balance, transaction summary, financial metrics, money management"
        schema="Dashboard"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Dashboard", url: "/dashboard" },
        ]}
      />

      <div className="space-y-6">
        {/* Main Dashboard Content */}
        <div className="lg:flex lg:gap-6 w-full">
          {/* Left Section - Overview Cards */}
          <section
            className="lg:w-2/3 space-y-6"
            aria-labelledby="overview-heading"
          >
            <div>
              <header className="mb-4">
                <h1 id="overview-heading" className="text-2xl font-semibold">
                  Financial Overview
                </h1>
                <p className="text-muted-foreground">
                  Track your financial metrics and performance
                </p>
              </header>
              <RealTimeCards data={RealTimeCardData} />
            </div>

            <div>
              <WorkingCapitalChart data={workingCapitalData} />
            </div>

            <div>
              <header className="mb-4">
                <h2 className="text-lg font-semibold">Recent Transaction</h2>
              </header>
              <DataTable columns={dashboardColumns} data={[]} />
            </div>
          </section>

          <aside
            className="lg:w-1/3 mt-8 lg:mt-0"
            aria-labelledby="wallet-heading"
          >
            <header className="mb-4">
              <h2 id="wallet-heading" className="text-lg font-semibold">
                Your Wallets
              </h2>
              <p className="text-muted-foreground text-sm">
                Manage your payment methods
              </p>
            </header>
            <StackedCards cards={cards} />
            <div>
              <header className="mt-6 mb-4">
                <h2 className="text-lg font-semibold">Scheduled Payments</h2>
              </header>
              {paymentData.length > 0 ? (
                paymentData.map((payment, indx) => (
                  <ListData
                    key={indx}
                    amount={payment.amount}
                    date={new Date(payment.date)}
                    image={payment.image}
                    name={payment.name}
                  />
                ))
              ) : (
                <p className="text-muted-foreground">
                  No scheduled payments found.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
