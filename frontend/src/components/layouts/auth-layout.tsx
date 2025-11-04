import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";

import Image from "@/components/ui/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/assets/google";
import FacebookIcon from "@/components/assets/facebook";

const AuthLayout = () => {
  const pathname = useLocation().pathname;
  const leftContainer = useRef<HTMLDivElement>(null);
  const rightContainer = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentPath, setCurrentPath] = useState(pathname);

  // --- Animation Effect on Route Change ---
  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });

    if (pathname.includes("register")) {
      tl.to(leftContainer.current, { x: "100%" }, 0).to(
        rightContainer.current,
        { x: "-100%" },
        0
      );
    } else if (pathname.includes("login")) {
      tl.to(leftContainer.current, { x: "0%" }, 0).to(
        rightContainer.current,
        { x: "0%" },
        0
      );
    }

    return () => tl.kill();
  }, [pathname]);

  // --- Animate Outlet smoothly ---
  useGSAP(() => {
    if (pathname === currentPath) return;
    const tl = gsap.timeline({
      defaults: { duration: 0.4, ease: "power2.out" },
      onComplete: () => setCurrentPath(pathname),
    });

    tl.to(contentRef.current, { opacity: 0, y: 10 });
    return () => tl.kill();
  }, [pathname]);

  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [currentPath]);

  return (
    <>
      {/* Skip to main content for accessibility */}
      <a
        href="#auth-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-medium"
      >
        Skip to main content
      </a>

      <main
        id="auth-main-content"
        className="p-5 min-h-screen h-screen overflow-hidden"
        role="main"
        aria-label="Authentication page"
      >
        <section
          className="grid grid-cols-2 h-full w-full relative"
          aria-label="Authentication form and illustration"
        >
          {/* Left Container - Authentication Form */}
          <div
            ref={leftContainer}
            className="flex justify-center items-center w-full h-full bg-background z-10 px-4"
            role="region"
            aria-label="Authentication form area"
          >
            <div className="flex flex-col justify-between h-full max-w-md w-full">
              <div className="pointer-events-none" aria-hidden="true" />

              <div className="space-y-4" ref={contentRef}>
                <header>
                  <h1 className="text-2xl font-semibold">
                    {pathname.includes("login")
                      ? "Welcome back! 👋"
                      : "Join the Maglo community 🚀"}
                  </h1>
                  <div className="text-sm text-muted-foreground space-y-1 mt-2">
                    {pathname.includes("login") && (
                      <p>Let&apos;s pick up right where you left off.</p>
                    )}
                    <p>
                      {pathname.includes("login")
                        ? "Log in to track your finances, set smart goals, and make confident money moves."
                        : "Create your free account and start managing your finances smarter — all in one place."}
                    </p>
                  </div>
                </header>

                <div
                  key={currentPath}
                  role="form"
                  aria-label="Authentication form"
                >
                  <Outlet />
                </div>

                <Separator label="or" className="my-4" />

                <section aria-label="Social authentication options">
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      aria-label="Continue with Google account"
                    >
                      <GoogleIcon aria-hidden="true" />
                      Continue with Google
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      aria-label="Continue with Facebook account"
                    >
                      <FacebookIcon aria-hidden="true" />
                      Continue with Facebook
                    </Button>
                  </div>
                </section>

                <nav aria-label="Authentication options">
                  {pathname.includes("login") ? (
                    <p className="text-sm text-center text-muted-foreground">
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                        aria-label="Go to registration page"
                      >
                        Register
                      </Link>
                    </p>
                  ) : (
                    <p className="text-sm text-center text-muted-foreground">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                        aria-label="Go to login page"
                      >
                        Login
                      </Link>
                    </p>
                  )}
                </nav>
              </div>

              <footer>
                <p className="text-xs text-center text-muted-foreground">
                  &copy; {new Date().getFullYear()} Maglo. All rights reserved.
                </p>
              </footer>
            </div>
          </div>

          {/* Right Container (Image) */}
          <aside
            ref={rightContainer}
            className="relative hidden md:block rounded-md overflow-hidden px-4"
            role="img"
            aria-label="Decorative illustration"
          >
            <Image
              src="https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b?auto=format&fit=crop&q=80&w=1169"
              alt="Modern office workspace with financial charts and graphs representing financial management"
              layout="fill"
              className="w-full h-full object-cover object-left"
            />
          </aside>
        </section>
      </main>
    </>
  );
};

export default AuthLayout;
