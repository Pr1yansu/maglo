import { SEO } from "@/components/SEO";

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
        <header>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your financial activity.
          </p>
        </header>

        <main>
          <section aria-labelledby="overview-heading" className="mb-8">
            <h2 id="overview-heading" className="sr-only">
              Financial Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <article className="p-6 rounded-lg border bg-card">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Total Balance
                </h3>
                <p
                  className="text-2xl font-bold"
                  aria-label="Total balance: $12,345.67"
                >
                  $12,345.67
                </p>
                <p
                  className="text-xs text-green-600 mt-1"
                  aria-label="Up 12% from last month"
                >
                  +12% from last month
                </p>
              </article>

              <article className="p-6 rounded-lg border bg-card">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Monthly Income
                </h3>
                <p
                  className="text-2xl font-bold"
                  aria-label="Monthly income: $3,245.00"
                >
                  $3,245.00
                </p>
                <p
                  className="text-xs text-green-600 mt-1"
                  aria-label="Up 8% from last month"
                >
                  +8% from last month
                </p>
              </article>

              <article className="p-6 rounded-lg border bg-card">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Monthly Expenses
                </h3>
                <p
                  className="text-2xl font-bold"
                  aria-label="Monthly expenses: $1,987.32"
                >
                  $1,987.32
                </p>
                <p
                  className="text-xs text-red-600 mt-1"
                  aria-label="Up 3% from last month"
                >
                  +3% from last month
                </p>
              </article>

              <article className="p-6 rounded-lg border bg-card">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Pending Invoices
                </h3>
                <p
                  className="text-2xl font-bold"
                  aria-label="3 pending invoices"
                >
                  3
                </p>
                <p
                  className="text-xs text-yellow-600 mt-1"
                  aria-label="2 due this week"
                >
                  2 due this week
                </p>
              </article>
            </div>
          </section>

          <section aria-labelledby="recent-activity" className="mb-8">
            <h2 id="recent-activity" className="text-xl font-semibold mb-4">
              Recent Activity
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <article className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-medium mb-4">
                  Recent Transactions
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>
                      <p className="font-medium">Coffee Shop</p>
                      <p className="text-sm text-muted-foreground">
                        Today, 2:30 PM
                      </p>
                    </div>
                    <p className="font-semibold text-red-600">-$4.50</p>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>
                      <p className="font-medium">Salary Deposit</p>
                      <p className="text-sm text-muted-foreground">
                        Yesterday, 9:00 AM
                      </p>
                    </div>
                    <p className="font-semibold text-green-600">+$3,245.00</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Grocery Store</p>
                      <p className="text-sm text-muted-foreground">
                        Dec 2, 6:15 PM
                      </p>
                    </div>
                    <p className="font-semibold text-red-600">-$87.23</p>
                  </div>
                </div>
              </article>

              <article className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-medium mb-4">Wallet Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Primary Checking</span>
                    <span className="font-semibold">$8,432.15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Savings Account</span>
                    <span className="font-semibold">$3,913.52</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Credit Card</span>
                    <span className="font-semibold text-red-600">-$245.89</span>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section aria-labelledby="quick-actions" className="mb-8">
            <h2 id="quick-actions" className="text-xl font-semibold mb-4">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left">
                <div className="text-2xl mb-2">💸</div>
                <h3 className="font-medium">Add Transaction</h3>
                <p className="text-sm text-muted-foreground">
                  Record a new transaction
                </p>
              </button>

              <button className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left">
                <div className="text-2xl mb-2">🧾</div>
                <h3 className="font-medium">Create Invoice</h3>
                <p className="text-sm text-muted-foreground">
                  Generate a new invoice
                </p>
              </button>

              <button className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left">
                <div className="text-2xl mb-2">💳</div>
                <h3 className="font-medium">Add Wallet</h3>
                <p className="text-sm text-muted-foreground">
                  Connect a new account
                </p>
              </button>

              <button className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-medium">View Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Analyze your finances
                </p>
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
