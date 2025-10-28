import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';

import Image from '@/components/ui/image';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import GoogleIcon from '@/components/assets/google';
import FacebookIcon from '@/components/assets/facebook';

const AuthLayout = () => {
    const pathname = useLocation().pathname;
    const leftContainer = useRef<HTMLDivElement>(null);
    const rightContainer = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [currentPath, setCurrentPath] = useState(pathname);

    // --- Animation Effect on Route Change ---
    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { duration: 1, ease: "power2.inOut" } });

        if (pathname.includes("register")) {
            tl.to(leftContainer.current, { x: "100%" }, 0)
                .to(rightContainer.current, { x: "-100%" }, 0);
        } else if (pathname.includes("login")) {
            tl.to(leftContainer.current, { x: "0%" }, 0)
                .to(rightContainer.current, { x: "0%" }, 0);
        }

        return () => tl.kill();
    }, [pathname]);

    // --- Animate Outlet smoothly ---
    useGSAP(() => {

        if (pathname === currentPath) return;
        const tl = gsap.timeline({
            defaults: { duration: 0.4, ease: 'power2.out' },
            onComplete: () => setCurrentPath(pathname),
        });

        tl.to(contentRef.current, { opacity: 0, y: 10 });
        return () => tl.kill();
    }, [pathname]);

    useEffect(() => {
        gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
    }, [currentPath]);


    return (
        <main className="p-5 min-h-screen h-screen overflow-hidden">
            <section className="grid grid-cols-2 h-full w-full relative">
                {/* Left Container */}
                <div
                    ref={leftContainer}
                    className="flex justify-center items-center w-full h-full bg-background z-10 px-4"
                >
                    <div className="flex flex-col justify-between h-full">
                        <div className="pointer-events-none" />
                        <div className="space-y-4" ref={contentRef}>
                            <h2 className="text-2xl font-semibold">
                                {pathname.includes("login")
                                    ? "Welcome back! 👋"
                                    : "Join the Maglo community 🚀"}
                            </h2>
                            <div className="text-sm text-muted-foreground space-y-1">
                                {pathname.includes("login") && (
                                    <p>Let&apos;s pick up right where you left off.</p>
                                )}
                                <p>
                                    {pathname.includes("login")
                                        ? "Log in to track your finances, set smart goals, and make confident money moves."
                                        : "Create your free account and start managing your finances smarter — all in one place."}
                                </p>
                            </div>
                            <div key={currentPath}>
                                <Outlet />

                            </div>
                            <Separator label="or" className="my-4" />
                            <div className="space-y-4">
                                <Button variant="outline" className="w-full">
                                    <GoogleIcon />
                                    Continue with Google
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <FacebookIcon />
                                    Continue with Facebook
                                </Button>
                            </div>

                            <div>
                                {pathname.includes("login") ? (
                                    <p className="text-sm text-center text-muted-foreground">
                                        Don't have an account?{" "}
                                        <Link to="/register" className="text-primary hover:underline">
                                            Register
                                        </Link>
                                    </p>
                                ) : (
                                    <p className="text-sm text-center text-muted-foreground">
                                        Already have an account?{" "}
                                        <Link to="/login" className="text-primary hover:underline">
                                            Login
                                        </Link>
                                    </p>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                            &copy; {new Date().getFullYear()} Maglo. All rights reserved.
                        </p>
                    </div>
                </div>

                {/* Right Container (Image) */}
                <div
                    ref={rightContainer}
                    className="relative hidden md:block rounded-md overflow-hidden px-4"
                >
                    <Image
                        src="https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b?auto=format&fit=crop&q=80&w=1169"
                        alt="Auth Illustration"
                        layout="fill"
                        className="w-full h-full object-cover object-left"
                    />
                </div>
            </section>
        </main>
    );
};

export default AuthLayout;
