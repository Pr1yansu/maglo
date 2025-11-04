import { SEO } from "@/components/SEO";
import Link from "@/components/ui/link";

const Home = () => {
  return (
    <>
      <SEO
        title="Home - Modern Financial Dashboard"
        description="Welcome to Maglo, your modern financial dashboard for managing transactions, invoices, and wallets. Take control of your finances with our intuitive platform."
        keywords="financial dashboard, home, money management, personal finance, wallet, transactions, invoices"
        schema="WebPage"
        breadcrumbs={[{ name: "Home", url: "/" }]}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header>
          <h1 className="text-4xl font-bold mb-6">
            Welcome to <span className="text-primary">Maglo</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Your comprehensive financial management platform for the modern
            world. Track transactions, create invoices, manage wallets, and gain
            insights into your financial health.
          </p>
        </header>

        <main>
          <section aria-labelledby="features-heading" className="mb-12">
            <h2 id="features-heading" className="text-3xl font-semibold mb-6">
              Key Features
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <article className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-medium mb-3">
                  💳 Wallet Management
                </h3>
                <p className="text-muted-foreground">
                  Manage multiple wallets, track balances, and organize your
                  financial accounts in one place.
                </p>
              </article>

              <article className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-medium mb-3">
                  📊 Transaction Tracking
                </h3>
                <p className="text-muted-foreground">
                  Monitor all your transactions with detailed analytics and
                  categorization for better insights.
                </p>
              </article>

              <article className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-medium mb-3">
                  🧾 Invoice Creation
                </h3>
                <p className="text-muted-foreground">
                  Create professional invoices, track payments, and manage your
                  billing efficiently.
                </p>
              </article>
            </div>
          </section>

          <section aria-labelledby="getting-started" className="mb-12">
            <h2 id="getting-started" className="text-3xl font-semibold mb-6">
              Getting Started
            </h2>

            <div className="bg-muted/50 rounded-lg p-6 mb-6">
              <h3 className="text-2xl font-medium mb-4">
                Ready to take control of your finances?
              </h3>
              <p className="text-lg mb-6 text-muted-foreground">
                Join thousands of users who trust Maglo for their financial
                management needs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
                  aria-label="Create your free Maglo account"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-foreground bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
                  aria-label="Sign in to your existing Maglo account"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </section>

          <section aria-labelledby="tech-specs" className="mb-12">
            <h2 id="tech-specs" className="text-3xl font-semibold mb-6">
              Technical Excellence
            </h2>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg mb-4 text-muted-foreground">
                Built with modern web technologies for optimal performance,
                security, and user experience.
              </p>

              <h3 className="text-2xl font-medium mb-3">
                Architecture Highlights
              </h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Frontend:</strong> React 18 with TypeScript for
                  type-safe development
                </li>
                <li>
                  <strong>Styling:</strong> Tailwind CSS with ShadCN UI
                  components
                </li>
                <li>
                  <strong>Animations:</strong> GSAP for smooth, professional
                  interactions
                </li>
                <li>
                  <strong>Backend:</strong> NestJS with GraphQL for efficient
                  data fetching
                </li>
                <li>
                  <strong>Database:</strong> PostgreSQL with Drizzle ORM for
                  type-safe queries
                </li>
                <li>
                  <strong>Build Tool:</strong> Vite for lightning-fast
                  development and builds
                </li>
              </ul>

              <h4 className="text-xl font-medium mb-2">Performance Features</h4>
              <ul className="list-disc pl-6 mb-4 space-y-1 text-sm text-muted-foreground">
                <li>Server-side rendering ready</li>
                <li>Code splitting and lazy loading</li>
                <li>Optimized bundle sizes</li>
                <li>Progressive Web App capabilities</li>
                <li>Advanced caching strategies</li>
              </ul>
            </div>
          </section>
        </main>

        <footer className="text-center pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            © 2024 Maglo. Built with ❤️ for modern financial management.
          </p>
        </footer>
      </div>
    </>
  );
};

export default Home;
