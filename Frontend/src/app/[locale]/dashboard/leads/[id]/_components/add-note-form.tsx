"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noteSchema, NoteFormValues } from "@/shared/lib/schemas/leads.s";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addNoteAction } from "@/shared/lib/actions/leads.action";
import { toast } from "sonner";

interface AddNoteDialogProps {
  id: string;
}

export function AddNoteDialog({ id }: AddNoteDialogProps) {
  const t = useTranslations("AddNoteDialog");
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (variables: { note: string; id: string }) => {
      return addNoteAction(variables.note, variables.id);
    },
    onSuccess: () => {
      toast.success(t("successMsg"), { position: "bottom-right" });
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
    watch,
    reset,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: { note: "" },
  });

  const charCount = watch("note").length;

  async function onValid(values: NoteFormValues) {
    await mutate({ ...values, id });
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 rounded-xl text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          <PlusCircle className="h-4 w-4" />
          {t("addNoteButton")}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValid)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="note">
              {t("noteLabel")} <span className="text-destructive">*</span>
            </Label>

            <Textarea
              id="note"
              placeholder={t("placeholder")}
              className="min-h-[100px] resize-none mt-2"
              maxLength={1000}
              {...register("note")}
            />

            <div className="flex items-start justify-between">
              {errors.note ? (
                <p className="text-xs text-destructive">
                  {errors.note.message}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">{t("minChars")}</p>
              )}
              <span
                className={`ml-auto text-xs tabular-nums ${
                  charCount >= 1000
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {charCount} / 1000
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="submit" disabled={isPending}>
              {isPending ? t("saving") : t("saveNote")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
