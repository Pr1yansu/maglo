import { Link, Outlet, useLocation } from 'react-router-dom'
import Image from '@/components/ui/image';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const AuthLayout = () => {
    const pathname = useLocation().pathname;
    return (
        <main className='p-3 min-h-screen h-screen'>
            <section className='grid grid-cols-2 h-full w-full'>
                <div className='flex justify-center items-center w-full h-full'>
                    <div className='flex flex-col justify-between h-full'>
                        <div
                            className='pointer-events-none'
                        />
                        <div className='space-y-4'>
                            <h2 className='text-2xl font-semibold'>
                                {
                                    pathname.match("/login") ? "Welcome Back 👋" : "Welcome to Our App"
                                }
                            </h2>
                            <div className='text-sm text-muted-foreground space-y-1'>
                                {
                                    pathname.match("/login") && <p>Today is a new day.</p>
                                }
                                <p>
                                    {
                                        pathname.match("/login") ? "To manage your finance, please log in to your account." : "Join us today and take control of your finances!"
                                    }
                                </p>
                            </div>
                            <Outlet />
                            <Separator label="or" className="my-4" />
                            <div className='space-y-4'>
                                <Button variant={"secondary"} className="w-full">
                                    Continue with Google
                                </Button>
                                <Button variant={"secondary"} className="w-full">
                                    Continue with Facebook
                                </Button>
                            </div>
                            <div>
                                {
                                    pathname.match("/login") ? (
                                        <p className='text-sm text-center text-muted-foreground'>
                                            Don't have an account? <Link to="/register" className='text-primary hover:underline'>Register</Link>
                                        </p>
                                    ) : (
                                        <p className='text-sm text-center text-muted-foreground'>
                                            Already have an account? <Link to="/login" className='text-primary hover:underline'>Login</Link>
                                        </p>
                                    )
                                }
                            </div>
                        </div>
                        <div>
                            <p className='text-xs text-center text-muted-foreground'>
                                &copy; {new Date().getFullYear()} Maglo. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
                <div className='relative hidden md:block rounded-md overflow-hidden'>
                    <Image src="https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1169" alt="Auth Illustration" layout='fill' className="w-full h-full object-cover object-left" />
                </div>
            </section>
        </main>
    )
}

export default AuthLayout
