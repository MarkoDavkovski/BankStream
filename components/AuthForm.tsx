"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.actions";
import PlaidLink from "./PlaidLink";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      //Sign up with Appwrite & create plain link token
      const userData = {
        firstName: data.firstName!,
        lastName: data.lastName!,
        address1: data.address1!,
        city: data.city!,
        state: data.state!,
        postalCode: data.postalCode!,
        dateOfBirth: data.dateOfBirth!,
        ssn: data.ssn!,
        email: data.email,
        password: data.password,
      };
      if (type === "sign-up") {
        const newUser = await signUp(userData);
        setUser(newUser);
      } else if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });
        if (response) router.push("/");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-1 ">
          <Image
            src="/icons/bankstream_logo_full.svg"
            width={350}
            height={34}
            alt="BankStream Logo"
          />
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          <p className="text-16 font-normal text-gray-600">
            {user
              ? "Link your account to get started."
              : "Please enter your details."}
          </p>
        </div>
      </header>

      {user ? (
        <div className="flex flex-col gap-4">
          <PlaidLink user={user} variant="primary" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {type === "sign-up" && (
              <>
                <div className="flex gap-4">
                  <CustomInput
                    formControl={form.control}
                    name="firstName"
                    label="First name"
                    placeholder="Enter your first name"
                  />
                  <CustomInput
                    formControl={form.control}
                    name="lastName"
                    label="Last name"
                    placeholder="Enter your last name"
                  />
                </div>
                <CustomInput
                  formControl={form.control}
                  name="address1"
                  label="Address"
                  placeholder="Enter your specific address"
                />
                <CustomInput
                  formControl={form.control}
                  name="city"
                  label="City"
                  placeholder="Enter your city"
                />
                <div className="flex gap-4">
                  <CustomInput
                    formControl={form.control}
                    name="state"
                    label="State"
                    placeholder="Example: NY"
                  />
                  <CustomInput
                    formControl={form.control}
                    name="postalCode"
                    label="Postal Code"
                    placeholder="Example: 1040"
                  />
                </div>
                <div className="flex gap-4">
                  <CustomInput
                    formControl={form.control}
                    name="dateOfBirth"
                    label="Date of Birth"
                    placeholder="Example: YYYY-MM-DD"
                  />
                  <CustomInput
                    formControl={form.control}
                    name="ssn"
                    label="SSN"
                    placeholder="Example: 223305"
                  />
                </div>
              </>
            )}

            <CustomInput
              formControl={form.control}
              name="email"
              label="Email"
              placeholder="Enter your email"
            />
            <CustomInput
              formControl={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
            />
            <div className="flex flex-col gap-4">
              <Button type="submit" className="form-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> &nbsp;
                    Loading..
                  </>
                ) : type === "sign-in" ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
      <footer className="flex justify-center gap-1">
        <p className="text-14 font-normal text-gray-600">
          {type === "sing-in"
            ? "Don't have an account?"
            : "Already have an account? "}
        </p>
        <Link
          href={`/${type === "sign-in" ? "sign-up" : "sign-in"}`}
          className="form-link">
          {type === "sign-in" ? "Sign Up" : "Sign In"}
        </Link>
      </footer>
    </section>
  );
};

export default AuthForm;
