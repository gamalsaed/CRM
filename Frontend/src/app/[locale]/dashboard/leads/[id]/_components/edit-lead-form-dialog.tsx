"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useUpdateLead } from "@/shared/hooks/use-update-lead";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Field from "@/shared/components/field";
import { Pencil } from "lucide-react";

import {
  EditLeadFormValues,
  editLeadFormSchema,
} from "@/shared/lib/schemas/leads.s";

interface EditLeadDialogProps {
  defaultValues: Partial<EditLeadFormValues>;
}

export default function EditLeadFormDialog({
  defaultValues,
}: EditLeadDialogProps) {
  const t = useTranslations("EditLeadDialog");
  const [open, setOpen] = useState<boolean>(false);
  const params = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<EditLeadFormValues>({
    resolver: zodResolver(editLeadFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      whatsApp: "",
      email: "",
      ...defaultValues,
    },
  });

  const { updateLead, isPending } = useUpdateLead({
    successMessage: t("successMessage"),
    reset,
  });

  async function onValid(values: Partial<EditLeadFormValues>) {
    const dirtyValues: Partial<EditLeadFormValues> = Object.fromEntries(
      Object.keys(dirtyFields).map((key) => [
        key,
        values[key as keyof EditLeadFormValues],
      ]),
    );

    if (Object.keys(dirtyValues).length === 0) {
      setOpen(false);
      return;
    }

    await updateLead({
      body: dirtyValues,
      leadId: params.id as string,
    });
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 text-xs font-medium hover:bg-blue-50 transition-colors">
          <Pencil size={13} />
          {t("editButton")}
        </button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValid)} className="space-y-4">
          <Field label={t("name")} required error={errors.name?.message}>
            <Input placeholder="Ahmed Hassan" {...register("name")} />
          </Field>

          <Field label={t("phone")} required error={errors.phone?.message}>
            <Input placeholder="+2010 123 456 78" {...register("phone")} />
          </Field>

          <Field label={t("whatsApp")} error={errors.whatsApp?.message}>
            <Input placeholder="+2010 123 456 78" {...register("whatsApp")} />
          </Field>

          <Field label={t("email")} error={errors.email?.message}>
            <Input
              placeholder="ahmed.hassan@example.com"
              type="email"
              {...register("email")}
            />
          </Field>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="submit" disabled={isPending || !isDirty}>
              {isPending ? t("saving") : t("saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
