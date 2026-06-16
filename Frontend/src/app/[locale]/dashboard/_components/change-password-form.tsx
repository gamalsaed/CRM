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
  adminChangePasswordSchema,
  AdminChangePasswordValues,
  userChangePasswordSchema,
  UserChangePasswordValues,
} from "@/shared/lib/schemas/users.s";
import { useSession } from "next-auth/react";
import { changePasswordAction } from "@/shared/lib/actions/user.action";

type ChangePasswordFormProps = {
  userId: string;
};

// ─── Admin form (password + confirm only) ────────────────────────────────────

function AdminPasswordForm({ userId }: { userId: string }) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<AdminChangePasswordValues>({
    resolver: zodResolver(adminChangePasswordSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (_data: AdminChangePasswordValues) => {
      await changePasswordAction(_data, userId);
    },
    onSuccess: () => {
      toast.success("Password updated successfully", {
        position: "bottom-right",
      });
      reset();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Something went wrong!", {
        position: "bottom-right",
      });
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => mutate(v))} className="space-y-5">
      <div className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-100 px-4 py-3">
        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">
          As an admin, you can set a new password directly without providing the
          current one.
        </p>
      </div>

      <Field label="New Password" required error={errors.newPassword?.message}>
        <PasswordInput
          placeholder="Enter new password"
          error={!!errors.newPassword}
          {...register("newPassword")}
        />
      </Field>

      <Field
        label="Confirm Password"
        required
        error={errors.confirmPassword?.message}
      >
        <PasswordInput
          placeholder="Re-enter new password"
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
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

// ─── User/non-admin form (current + new + confirm) ───────────────────────────

function UserPasswordForm({ userId }: { userId: string }) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UserChangePasswordValues>({
    resolver: zodResolver(userChangePasswordSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (_data: UserChangePasswordValues) => {
      // TODO: wire up changePasswordAction(data, userId)
      await new Promise((r) => setTimeout(r, 800));
      return { userId };
    },
    onSuccess: () => {
      toast.success("Password updated successfully", {
        position: "bottom-right",
      });
      reset();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Something went wrong!", {
        position: "bottom-right",
      });
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => mutate(v))} className="space-y-5">
      <Field
        label="Current Password"
        required
        error={errors.currentPassword?.message}
      >
        <PasswordInput
          placeholder="Enter your current password"
          error={!!errors.currentPassword}
          {...register("currentPassword")}
        />
      </Field>

      <Field label="New Password" required error={errors.newPassword?.message}>
        <PasswordInput
          placeholder="Enter new password"
          error={!!errors.newPassword}
          {...register("newPassword")}
        />
      </Field>

      <Field
        label="Confirm New Password"
        required
        error={errors.confirmPassword?.message}
      >
        <PasswordInput
          placeholder="Re-enter new password"
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
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

// ─── Shell (shared header + card) ────────────────────────────────────────────

export default function ChangePasswordForm({
  userId,
}: ChangePasswordFormProps) {
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
            Change Password
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {isAdmin
              ? "Set a new password for this user directly."
              : "Update your password by verifying your current one first."}
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
