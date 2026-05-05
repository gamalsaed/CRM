"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useLogin } from "@/shared/hooks/use-login";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/lib/schemas/auth.s";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const { login, error, isPending } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  function onSubmit(data: z.infer<typeof loginSchema>) {
    login(data);
  }
  return (
    <form
      id="form-rhf-demo"
      className="w-96 max-sm:w-11/12"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-email">Email</FieldLabel>
              <Input
                {...field}
                id="form-email"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your email"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-password">Password</FieldLabel>
              <Input
                {...field}
                type="password"
                id="form-password"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your Password"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="rememberMe"
          control={form.control}
          render={({ field }) => (
            <Field orientation="horizontal" className="mb-2 ">
              <Checkbox
                id="rememberMe-checkbox"
                name="rememberMe-checkbox"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="cursor-pointer "
              />
              <Label
                htmlFor="rememberMe-checkbox"
                className="cursor-pointer capitalize"
              >
                Remember Me
              </Label>
            </Field>
          )}
        />
      </FieldGroup>
      <Button
        type="submit"
        form="form-rhf-demo"
        className="w-full cursor-pointer  duration-75 transition-colors py-5 rounded-xl bg-linear-to-r from-primary-500 to-primary-600 hover:bg-linear-to-r hover:from-primary-600 hover:to-primary-700"
        disabled={isPending}
      >
        {isPending ? "Signing in..." : "Sign in to G-CRM"}
      </Button>
    </form>
  );
}
// <Card className="w-full sm:max-w-md flex ">
{
  /* <CardContent> */
}
{
  /* </CardContent> */
}
{
  /* <CardFooter>
        <Field orientation="horizontal">

        </Field>
      </CardFooter> */
}
// </Card>
