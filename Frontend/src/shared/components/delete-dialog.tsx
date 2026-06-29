"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type DeleteProps = {
  args: string[];
  deleteFn: (...args: string[]) => Promise<any>;
  successMsg: string;
  failMsg: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  afterSuccess?: () => void;
};

export default function DeleteDialog({
  deleteFn,
  successMsg,
  failMsg,
  title,
  description,
  children,
  afterSuccess,
  args,
}: DeleteProps) {
  const t = useTranslations("DeleteDialog");
  const router = useRouter();

  const { mutate } = useMutation({
    mutationKey: [`delete-${args}`],
    mutationFn: () => deleteFn(...args),
    onSuccess: () => {
      toast.success(successMsg, { position: "bottom-right" });
      afterSuccess?.();
      router.refresh();
    },
    onError: () => {
      toast.error(failMsg, { position: "bottom-right" });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children ? (
          children
        ) : (
          <div className="cursor-pointer p-2 text-[12px] text-red-600 hover:bg-red-50 flex items-center gap-3">
            <Trash2 width={16} height={16} />
            <p>{t("delete")}</p>
          </div>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl ">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <Trash2 className="text-red-700" size={22} />
          </div>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </div>
        <AlertDialogFooter className="flex w-full ">
          <AlertDialogCancel className="flex-1 rounded-md">
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="danger"
            className="flex-1 rounded-md"
            onClick={() => mutate()}
          >
            <Trash2 size={14} /> {t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
