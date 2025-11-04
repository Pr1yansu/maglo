"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import SendIcon from "@/components/assets/send";

gsap.registerPlugin(MorphSVGPlugin);

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

const Login = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    if (loading) return;
    setLoading(true);
  };

  return (
    <>
      <SEO
        title="Login - Access Your Financial Dashboard"
        description="Sign in to your Maglo account to access your personal financial dashboard, track transactions, manage wallets, and control your finances."
        keywords="login, sign in, financial dashboard access, account login, secure login"
        schema="WebPage"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Login", url: "/login" },
        ]}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="username">Email</FormLabel>
                <FormControl>
                  <Input
                    id="username"
                    type="email"
                    placeholder="Example@email.com"
                    autoComplete="email"
                    aria-describedby="username-error"
                    {...field}
                  />
                </FormControl>
                <FormMessage id="username-error" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    aria-describedby="password-error"
                    {...field}
                  />
                </FormControl>
                <FormMessage id="password-error" />
              </FormItem>
            )}
          />
          <div className="w-full text-end">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
              aria-label="Reset your forgotten password"
            >
              Forgot Password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2"
            ref={btnRef}
            disabled={loading}
            aria-label={loading ? "Signing in..." : "Sign in to your account"}
          >
            {loading ? "Signing in..." : "Submit"}
            <SendIcon aria-hidden="true" />
          </Button>
        </form>
      </Form>
    </>
  );
};

export default Login;
