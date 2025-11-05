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
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

gsap.registerPlugin(MorphSVGPlugin);

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

const Login = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const { login, isProcessing } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isProcessing) return;

    try {
      setErrorMessage(null);
      await login({ email: values.email, password: values.password });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign in.";
      setErrorMessage(message);
    }
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Example@email.com"
                    autoComplete="email"
                    aria-describedby="email-error"
                    {...field}
                  />
                </FormControl>
                <FormMessage id="email-error" />
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
            disabled={isProcessing}
            aria-label={
              isProcessing ? "Signing in..." : "Sign in to your account"
            }
          >
            {isProcessing ? "Signing in..." : "Submit"}
            <SendIcon aria-hidden="true" />
          </Button>
          {errorMessage && (
            <p className="text-sm text-destructive text-center" role="alert">
              {errorMessage}
            </p>
          )}
        </form>
      </Form>
    </>
  );
};

export default Login;
