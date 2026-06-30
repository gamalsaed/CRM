"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserAction } from "@/shared/lib/actions/user.action";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Info, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/shared/lib/utils/utils";
import { makeBasicInfoSchema, BasicInfoValues } from "@/shared/lib/schemas/users.s";
import Field from "@/shared/components/field";
import { useTranslations } from "next-intl";

// ─── Types ────────────────────────────────────────────────────────────────────

type BasicInfoFormProps = {
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: "admin" | "team leader" | "data entry" | "user";
  };
};

/**
 * Form for editing a user's name, email, and phone number.
 * Resets to the server-returned values on successful save.
 */
export default function BasicInfoForm({ user }: BasicInfoFormProps) {
  const t = useTranslations("BasicInfoForm");
  const tv = useTranslations("Validation");

  // Navigation
  const router = useRouter();

  // Form & Validation
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<BasicInfoValues>({
    resolver: zodResolver(makeBasicInfoSchema(tv)),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });

  // Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: BasicInfoValues) => {
      return await updateUserAction(data, user._id);
    },
    onSuccess: (data) => {
      toast.success(t("successToast"), { position: "bottom-right" });
      router.refresh();
      reset({
        name: data?.data?.user.name,
        email: data?.data?.user.email,
        phone: data?.data?.user.phone,
      });
    },
    onError: (err: Error) => {
      toast.error(err.message || t("errorFallback"), {
        position: "bottom-right",
      });
    },
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-gray-900">
          {t("title")}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">{t("subtitle")}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit((v) => mutate(v))} className="space-y-5">
        {/* Row 1: Name + Email */}
        <Field label={t("fullName")} required error={errors.name?.message}>
          <Input
            placeholder={t("namePlaceholder")}
            className={cn("rounded-lg", errors.name && "border-destructive ")}
            {...register("name")}
          />
        </Field>

        <Field label={t("email")} required error={errors.email?.message}>
          <Input
            type="email"
            placeholder={t("emailPlaceholder")}
            className={cn("rounded-lg", errors.email && "border-destructive ")}
            {...register("email")}
          />
        </Field>

        {/* Row 2: Phone + Role */}
        <Field label={t("phoneNumber")} required error={errors.phone?.message}>
          <Input
            type="tel"
            placeholder={t("phonePlaceholder")}
            className={cn("rounded-lg", errors.phone && "border-destructive ")}
            {...register("phone")}
          />
        </Field>

        {/* Info Banner */}
        <div className="flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
          <Info className="w-4 h-4 text-blue-500 shrink-0" />
          <p className="text-sm text-blue-600">{t("infoNote")}</p>
        </div>

        {/* Footer */}
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
    </div>
  );
}
