"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useLogin } from "@/shared/hooks/use-login";
import * as z from "zod";
import { ErrorBox } from "@/shared/components/error_box";
// Shadcn
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/shared/lib/schemas/auth.s";
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
  // Custom Hook
  const { login, error, isPending } = useLogin();
  console.log("Error: ", error);
  // React Hook Form
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Functions
  function onSubmit(data: z.infer<typeof loginSchema>) {
    console.log(data);
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
      {error && <ErrorBox error={`${error}`} />}
      <Button type="submit" form="form-rhf-demo" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in to G-CRM"}
      </Button>
    </form>
  );
}
