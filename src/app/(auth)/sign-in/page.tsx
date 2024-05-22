"use client";

import Icons from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AuthCredentialsValidator,
  TauthCredentialsValidator,
} from "@/lib/validators/auth-credentials-validator";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TauthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const Router = useRouter();
  const searchParams = useSearchParams();

  const isSeller = searchParams.get("as") === "seller";
  const origin = searchParams.get("origin");

  const continueAsSeller = () => {
    Router.push("?as=seller");
  };
  const continueAsBuyer = () => {
    Router.replace("/sign-in", undefined);
  };

  const { mutate: signIn, isLoading } = trpc.auth.SignIn.useMutation({
    onSuccess: () => {
      toast.success("Sign in successfully");

      if (origin) {
        Router.push(`/${origin}`);
        return;
      }
      if (isSeller) {
        Router.replace("/sell");
        return;
      }
      Router.push("/");
      Router.refresh();
    },

    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        toast.error("Email or Password is Wrong.");
      }
    },
  });

  const onsubmit = ({ email, password }: TauthCredentialsValidator) => {
    signIn({ email, password });
  };

  return (
    <>
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo className="h-20 w-20" />
            <h1 className="text-2xl font-bold">
              {" "}
              Sign in to your {isSeller ? "seller" : ""} account
            </h1>
            <Link
              href="/sign-up"
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
            >
              Don&#39;t have an account? Sign-up
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onsubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register("email")}
                    className={cn({
                      "focus-visible:ring-red-500": errors.email,
                    })}
                    placeholder="you@example.com"
                  />
                  {errors?.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-1 py-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    {...register("password")}
                    type="password"
                    className={cn({
                      "focus-visible:ring-red-500":
                        errors.password || errors.root,
                    })}
                    placeholder="Password"
                  />
                  {errors?.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button>Sign-in</Button>
              </div>
            </form>
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 items-center flex"
              >
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center uppercase text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  OR
                </span>
              </div>
            </div>
            {isSeller ? (
              <Button
                variant="secondary"
                onClick={continueAsBuyer}
                disabled={isLoading}
              >
                Continue as a Customer
              </Button>
            ) : (
              <Button
                onClick={continueAsSeller}
                variant="secondary"
                disabled={isLoading}
              >
                Continue as a Seller
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
