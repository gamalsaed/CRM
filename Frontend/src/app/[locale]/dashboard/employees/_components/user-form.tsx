"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { createUserAction } from "@/shared/lib/actions/user.action";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/shared/lib/utils/utils";
import PasswordInput from "@/shared/components/password-input";
import {
  newUserSchema,
  type NewUserFormValues,
} from "@/shared/lib/schemas/users.s";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

// ─── Role Options ─────────────────────────────────────────────────────────────

const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "data entry", label: "Data Entry" },
  { value: "team leader", label: "Team Leader" },
  { value: "admin", label: "Admin" },
];

// ─── Reusable Field ───────────────────────────────────────────────────────────

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function UserForm({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: createUserAction,
    onSuccess: () => {
      toast.success("User has been added successfully", {
        position: "bottom-right",
      });
      setOpen(false);
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!", {
        position: "bottom-right",
      });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewUserFormValues>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleFormSubmit = async (values: NewUserFormValues) => {
    mutate(values);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[520px] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create New User
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-5 pt-2"
        >
          {/* Name */}
          <Field label="Full Name" required error={errors.name?.message}>
            <Input
              placeholder="e.g. Mona Khaled"
              autoFocus
              className={cn(errors.name && "border-destructive")}
              {...register("name")}
            />
          </Field>
          {/* Email */}
          <Field label="Email Address" required error={errors.email?.message}>
            <Input
              type="email"
              placeholder="e.g. mona@example.com"
              className={cn(errors.email && "border-destructive")}
              {...register("email")}
            />
          </Field>
          {/* Phone + Role — side by side */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone Number" required error={errors.phone?.message}>
              <Input
                type="tel"
                placeholder="+201012345678"
                className={cn(errors.phone && "border-destructive")}
                {...register("phone")}
              />
            </Field>

            <Field label="Role" required error={errors.role?.message}>
              <Select
                onValueChange={(val) =>
                  setValue("role", val as NewUserFormValues["role"], {
                    shouldValidate: true,
                  })
                }
                defaultValue={watch("role")}
              >
                <SelectTrigger
                  className={cn(
                    "w-full rounded-xl ",
                    errors.role && "border-destructive",
                  )}
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">
                Security
              </span>
            </div>
          </div>
          {/* Password */}
          <Field label="Password" required error={errors.password?.message}>
            <PasswordInput
              placeholder="Min 8 chars, uppercase, number, special"
              error={!!errors.password}
              {...register("password")}
            />
          </Field>
          {/* Confirm Password */}
          <Field
            label="Confirm Password"
            required
            error={errors.confirmPassword?.message}
          >
            <PasswordInput
              placeholder="Re-enter the password"
              error={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
          </Field>

          <DialogFooter className="pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
