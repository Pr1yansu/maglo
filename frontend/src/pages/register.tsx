import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SEO } from "@/components/SEO";

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
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z
      .string()
      .min(6, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, isProcessing } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    if (isProcessing) return;

    try {
      setErrorMessage(null);
      await registerUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to create account.";
      setErrorMessage(message);
    }
  };

  return (
    <>
      <SEO
        title="Create Account - Sign Up for Maglo"
        description="Join Maglo today and start managing your finances with professional invoicing, payment tracking, and comprehensive financial tools. Create your free account in minutes."
        keywords="sign up, create account, register, join Maglo, financial management, invoicing platform"
        schema="WebPage"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Register", url: "/register" },
        ]}
      />

      <main>
        <h1 className="sr-only">Create Your Maglo Account</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            aria-label="Account registration form"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      aria-describedby="name-requirements"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      {...field}
                      aria-describedby="email-requirements"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                      aria-describedby="password-requirements"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Re-enter password"
                      {...field}
                      aria-describedby="confirm-password-requirements"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              aria-label="Create your Maglo account"
              disabled={isProcessing}
            >
              {isProcessing ? "Creating..." : "Create Account"}
            </Button>
            {errorMessage && (
              <p className="text-sm text-destructive text-center" role="alert">
                {errorMessage}
              </p>
            )}
          </form>
        </Form>
      </main>
    </>
  );
};

export default Register;
