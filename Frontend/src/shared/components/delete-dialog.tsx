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
import { useMutation } from "@tanstack/react-query";
import { deleteLead } from "../lib/actions/leads.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function DeleteDialog({ id }: { id: string }) {
  const router = useRouter();

  const { mutate, error } = useMutation({
    mutationKey: [`delete-lead`],
    mutationFn: () => deleteLead(id),
    onSuccess: () => {
      toast.success("You have deleted the lead successfully", {
        position: "bottom-right",
      });
      router.refresh();
    },
    onError: () => {
      toast.error("Something went wrong!", {
        position: "bottom-right",
      });
    },
  });
  console.log(error);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="cursor-pointer p-2 text-[12px] text-red-600 hover:bg-red-50 flex items-center gap-3">
          <Trash2 width={16} height={16} />
          <p>Delete</p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl ">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <Trash2 className="text-red-700" size={22} />
          </div>
          <AlertDialogTitle>Delete leads</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The selected leads will be permanently
            removed.
          </AlertDialogDescription>
        </div>
        <AlertDialogFooter className="flex w-full ">
          <AlertDialogCancel className="flex-1 rounded-md">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="danger"
            className="flex-1 rounded-md"
            onClick={() => mutate()}
          >
            <Trash2 size={14} /> Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
