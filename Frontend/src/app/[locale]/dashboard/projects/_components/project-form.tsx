"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { handleProjectFormAction } from "@/shared/lib/actions/projects.action";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/shared/lib/utils/utils";
import {
  newProjectSchema,
  type NewProjectFormValues,
} from "@/shared/lib/schemas/projects.s";
import { ErrorBox } from "@/shared/components/error_box";
import { toast } from "sonner";

interface NewProjectFormProps {
  children?: React.ReactNode;
  name?: string;
  description?: string;
  method: "POST" | "PATCH";
  id?: string;
}

export default function ProjectForm({
  children,
  name,
  description,
  method,
  id,
}: NewProjectFormProps) {
  const t = useTranslations("ProjectForm");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["create-project"],
    mutationFn: handleProjectFormAction,
    onSuccess: () => {
      toast.success(
        method === "POST" ? t("createSuccess") : t("updateSuccess"),
        { position: "bottom-right" },
      );
      setOpen(false);
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message || t("errorFallback"), {
        position: "bottom-right",
      });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<NewProjectFormValues>({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      name: name || "",
      description: description || "",
    },
  });

  const descriptionValue = watch("description") ?? "";

  const handleFormSubmit = async (values: NewProjectFormValues) => {
    if (method === "PATCH") {
      mutate({ ...values, method, id });
    } else {
      mutate({ ...values, method });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children ? children : <Button className="w-fit">{t("addProject")}</Button>}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {t("createTitle")}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-5 pt-2"
        >
          <div className="space-y-2">
            <Label htmlFor="name">
              {t("projectName")} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder={t("namePlaceholder")}
              className={cn(errors.name && "border-destructive ")}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {t("description")} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder={t("descriptionPlaceholder")}
              className={cn(
                "resize-none min-h-[100px]",
                errors.description && "border-destructive ",
              )}
              {...register("description")}
            />
            <div className="flex justify-between items-center">
              {errors.description ? (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {descriptionValue.length}/500
              </span>
            </div>
          </div>

          {error && <ErrorBox className="w-full" error={error?.message} />}
          <DialogFooter className="pt-2 flex flex-col">
            <Button type="submit" disabled={isPending || !isDirty}>
              {isPending ? t("creating") : t("createProject")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
