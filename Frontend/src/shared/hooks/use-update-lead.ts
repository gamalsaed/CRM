"use client";

import { useRouter } from "@/i18n/navigation";
import { useMutation } from "@tanstack/react-query";
import { updateLeadAction } from "../lib/actions/leads.action";
import { toast } from "sonner";
import { EditLeadFormValues } from "../lib/schemas/leads.s";

type UpdateLeadHook = {
  successMessage: string;
  reset?: (object: Partial<EditLeadFormValues>) => void;
};

export function useUpdateLead({ successMessage, reset }: UpdateLeadHook) {
  // useRouter
  const router = useRouter();

  // useMutation
  const { mutate, isPending } = useMutation({
    mutationFn: updateLeadAction,
    onSuccess: (data) => {
      toast.success(successMessage, {
        position: "bottom-right",
      });
      reset?.({ ...data.data.lead });
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!", {
        position: "bottom-right",
      });
    },
  });

  return {
    updateLead: mutate,
    isPending,
  };
}
