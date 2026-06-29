import { useMutation } from "@tanstack/react-query";
import { createLeadsAction } from "../lib/actions/leads.action";
import { toast } from "sonner";

type UseLeadsProps = {
  actionAfter?: () => void;
};

export function useLeads({ actionAfter }: UseLeadsProps) {
  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: createLeadsAction,
    onSuccess: (data) => {
      toast.success(data.message, {
        position: "bottom-right",
      });
      actionAfter?.();
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!", {
        position: "bottom-right",
      });
    },
  });
  return {
    mutateLeads: mutate,
    isPending,
    error,
    isSuccess,
  };
}
