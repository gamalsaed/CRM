"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { KeyRound, Save, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils/utils";
import Field from "@/shared/components/field";
import PasswordInput from "@/shared/components/password-input";
import {
  makeAdminChangePasswordSchema,
  AdminChangePasswordValues,
  makeUserChangePasswordSchema,
  UserChangePasswordValues,
} from "@/shared/lib/schemas/users.s";
import { useSession } from "next-auth/react";
import { changePasswordAction } from "@/shared/lib/actions/user.action";
import { useTranslations } from "next-intl";

type ChangePasswordFormProps = {
  userId: string;
};

// ─── Admin form ───────────────────────────────────────────────────────────────

/**
 * Password form for admins. Lets an admin set a new password directly
 * without needing to know the user's current password.
 */
function AdminPasswordForm({ userId }: { userId: string }) {
  const t = useTranslations("ChangePasswordForm");
  const tv = useTranslations("Validation");

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<AdminChangePasswordValues>({
    resolver: zodResolver(makeAdminChangePasswordSchema(tv)),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (_data: AdminChangePasswordValues) => {
      await changePasswordAction(_data, userId);
    },
    onSuccess: () => {
      toast.success(t("successToast"), {
        position: "bottom-right",
      });
      reset();
    },
    onError: (err: Error) => {
      toast.error(err.message || t("errorFallback"), {
        position: "bottom-right",
      });
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => mutate(v))} className="space-y-5">
      <div className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-100 px-4 py-3">
        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">{t("adminNote")}</p>
      </div>

      <Field label={t("newPassword")} required error={errors.newPassword?.message}>
        <PasswordInput
          placeholder={t("newPasswordPlaceholder")}
          error={!!errors.newPassword}
          {...register("newPassword")}
        />
      </Field>

      <Field
        label={t("confirmPassword")}
        required
        error={errors.confirmPassword?.message}
      >
        <PasswordInput
          placeholder={t("reEnterPlaceholder")}
          error={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
      </Field>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
        <Button
          type="submit"
          disabled={isPending || !isDirty}
          className="rounded-lg gap-2"
        >
          <Save className="w-4 h-4" />
          {isPending ? t("saving") : t("saveChanges")}
        </Button>
      </div>
    </form>
  );
}

// ─── User form ────────────────────────────────────────────────────────────────

/**
 * Password form for regular users. Requires the current password before
 * allowing a new one to be set.
 */
function UserPasswordForm({ userId }: { userId: string }) {
  const t = useTranslations("ChangePasswordForm");
  const tv = useTranslations("Validation");

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UserChangePasswordValues>({
    resolver: zodResolver(makeUserChangePasswordSchema(tv)),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (_data: UserChangePasswordValues) => {
      // TODO: wire up changePasswordAction(data, userId)
      await new Promise((r) => setTimeout(r, 800));
      return { userId };
    },
    onSuccess: () => {
      toast.success(t("successToast"), {
        position: "bottom-right",
      });
      reset();
    },
    onError: (err: Error) => {
      toast.error(err.message || t("errorFallback"), {
        position: "bottom-right",
      });
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => mutate(v))} className="space-y-5">
      <Field
        label={t("currentPassword")}
        required
        error={errors.currentPassword?.message}
      >
        <PasswordInput
          placeholder={t("currentPasswordPlaceholder")}
          error={!!errors.currentPassword}
          {...register("currentPassword")}
        />
      </Field>

      <Field label={t("newPassword")} required error={errors.newPassword?.message}>
        <PasswordInput
          placeholder={t("newPasswordPlaceholder")}
          error={!!errors.newPassword}
          {...register("newPassword")}
        />
      </Field>

      <Field
        label={t("confirmNewPassword")}
        required
        error={errors.confirmPassword?.message}
      >
        <PasswordInput
          placeholder={t("reEnterPlaceholder")}
          error={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
      </Field>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
        <Button
          type="submit"
          disabled={isPending || !isDirty}
          className="rounded-lg gap-2"
        >
          <Save className="w-4 h-4" />
          {isPending ? t("saving") : t("saveChanges")}
        </Button>
      </div>
    </form>
  );
}

// ─── Shell ────────────────────────────────────────────────────────────────────

/**
 * Container that renders either the admin or user password form depending
 * on the current session role.
 */
export default function ChangePasswordForm({
  userId,
}: ChangePasswordFormProps) {
  const t = useTranslations("ChangePasswordForm");
  const session = useSession();
  const isAdmin = session.data?.user.role === "admin";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "p-2 rounded-lg",
            isAdmin ? "bg-amber-50" : "bg-blue-50",
          )}
        >
          <KeyRound
            className={cn(
              "w-4 h-4",
              isAdmin ? "text-amber-500" : "text-blue-500",
            )}
          />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            {t("title")}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {isAdmin ? t("adminSubtitle") : t("userSubtitle")}
          </p>
        </div>
      </div>

      {isAdmin ? (
        <AdminPasswordForm userId={userId} />
      ) : (
        <UserPasswordForm userId={userId} />
      )}
    </div>
  );
}
