import { SEO } from "@/components/SEO";
import { usePerformanceMetrics } from "@/lib/performance";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import MainLayout from "@/components/layouts/main-layout";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import AuthLayout from "@/components/layouts/auth-layout";
import ProtectedRoute from "@/components/protected-route";
import Loader from "@/components/loader";

const Home = lazy(() => import("../src/pages/home"));
const Login = lazy(() => import("../src/pages/login"));
const Register = lazy(() => import("../src/pages/register"));
const Dashboard = lazy(() => import("./pages/dashboard/dashboard"));
const Transactions = lazy(
  () => import("./pages/dashboard/transaction/transaction")
);
const Invoices = lazy(() => import("./pages/dashboard/invoices/invoices"));
const CreateInvoice = lazy(
  () => import("./pages/dashboard/invoices/new-invoice")
);
const Wallets = lazy(() => import("./pages/dashboard/wallets/wallets"));
const WalletCards = lazy(() => import("./pages/dashboard/wallets/cards"));
const DashboardSettings = lazy(
  () => import("./pages/dashboard/settings/settings")
);
const Help = lazy(() => import("../src/pages/dashboard/help/help"));
const NotFound = lazy(() => import("../src/pages/not-found"));
const AuthCallback = lazy(() => import("./pages/auth/callback"));

function App() {
  usePerformanceMetrics();
  return (
    <>
      <SEO />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/transactions" element={<Transactions />} />
            <Route path="/dashboard/invoices" element={<Invoices />} />
            <Route path="/dashboard/invoices/new" element={<CreateInvoice />} />
            <Route path="/dashboard/wallets" element={<Wallets />} />
            <Route path="/dashboard/wallets/cards" element={<WalletCards />} />
            <Route path="/dashboard/settings" element={<DashboardSettings />} />
          </Route>

          <Route path="/help" element={<Help />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
export default App;
