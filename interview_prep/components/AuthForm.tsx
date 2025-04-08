"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-up"
        ? z.string().min(3).max(50)
        : z.string().min(3).max(50).optional(),
    email: z.string().min(3).max(50).email(),
    password: z.string().min(3).max(50),
  });
};
const AuthForm = ({ type }: { type: FormType }) => {
  const formSchema = authFormSchema(type);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        toast.success("Signed up successfully");
        router.push("/")
      } else {
        console.log("Signin called", values);
        toast.success("Signed in successfully");
        router.push("/")
      }
    } catch (err) {
      console.log(err);
      toast.error(`Something went wrong:${err}`);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>
        <h3 className="text-center">Practice job interview with AI</h3>
     

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6 mt-4 form"
        >
          {!isSignIn && (
            <FormField
              control={form.control}
              name="name"
              label="name"
              placeholder="Your name"
            />
          )}
          <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />
          <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Your password"
              type="password"
            />
          <Button type="submit" className="btn" typeof="submit">
            {isSignIn ? "Sign in" : "Create an account"}
          </Button>
        </form>
      </Form>
      <p className="text-center">
        {isSignIn ? "No acccount yet" : "Have an account already"}
        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="font-bold text-user-primary ml-1"
        >
          {isSignIn ? "Sign up" : "Sign in"}
        </Link>
      </p>
    </div>
    </div>
  );
};

export default AuthForm;
