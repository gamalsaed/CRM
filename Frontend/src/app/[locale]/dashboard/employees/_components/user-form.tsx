"use client";

import { useState } from "react";
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
  makeNewUserSchema,
  type NewUserFormValues,
} from "@/shared/lib/schemas/users.s";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Selectable role options for the new-user form. */
const ROLE_OPTION_VALUES = ["user", "data entry", "team leader", "admin"] as const;

// ─── Field ────────────────────────────────────────────────────────────────────

/** Labelled form field wrapper with an optional required indicator and error message. */
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

/**
 * Dialog-based form for creating a new user. Resets all fields when closed.
 * The dialog trigger is the `children` element passed by the parent.
 */
export default function UserForm() {
  const tv = useTranslations("Validation");
  const t = useTranslations("UserForm");

  const ROLE_OPTIONS = [
    { value: "user", label: t("roleUser") },
    { value: "data entry", label: t("roleDataEntry") },
    { value: "team leader", label: t("roleTeamLeader") },
    { value: "admin", label: t("roleAdmin") },
  ];

  // State
  const [open, setOpen] = useState(false);

  // Navigation
  const router = useRouter();

  // Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: createUserAction,
    onSuccess: () => {
      toast.success(t("successMsg"), {
        position: "bottom-right",
      });
      setOpen(false);
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message || t("errorFallback"), {
        position: "bottom-right",
      });
    },
  });

  // Form & Validation
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewUserFormValues>({
    resolver: zodResolver(makeNewUserSchema(tv)),
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
      <DialogTrigger asChild>
        <Button className="w-fit">{t("newEmployee")}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {t("createTitle")}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-5 pt-2"
        >
          {/* Name */}
          <Field label={t("fullName")} required error={errors.name?.message}>
            <Input
              placeholder={t("namePlaceholder")}
              autoFocus
              className={cn(errors.name && "border-destructive")}
              {...register("name")}
            />
          </Field>
          {/* Email */}
          <Field label={t("emailAddress")} required error={errors.email?.message}>
            <Input
              type="email"
              placeholder={t("emailPlaceholder")}
              className={cn(errors.email && "border-destructive")}
              {...register("email")}
            />
          </Field>
          {/* Phone + Role — side by side */}
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("phoneNumber")} required error={errors.phone?.message}>
              <Input
                type="tel"
                placeholder={t("phonePlaceholder")}
                className={cn(errors.phone && "border-destructive")}
                {...register("phone")}
              />
            </Field>

            <Field label={t("role")} required error={errors.role?.message}>
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
                  <SelectValue placeholder={t("selectRole")} />
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
                {t("security")}
              </span>
            </div>
          </div>
          {/* Password */}
          <Field label={t("password")} required error={errors.password?.message}>
            <PasswordInput
              placeholder={t("passwordPlaceholder")}
              error={!!errors.password}
              {...register("password")}
            />
          </Field>
          {/* Confirm Password */}
          <Field
            label={t("confirmPassword")}
            required
            error={errors.confirmPassword?.message}
          >
            <PasswordInput
              placeholder={t("confirmPasswordPlaceholder")}
              error={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
          </Field>

          <DialogFooter className="pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? t("creating") : t("createUser")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
