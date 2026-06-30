"use client";

import { useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { MoreVertical, Trash2 } from "lucide-react";
import { deleteNoteAction } from "@/shared/lib/actions/leads.action";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

export default function NoteAction({ noteId }: { noteId: string }) {
  const t = useTranslations("NoteAction");
  const params: { id: string } = useParams();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: () => deleteNoteAction(noteId, params.id),
    onSuccess: () => {
      toast.success(t("successMsg"), { position: "bottom-right" });
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message || t("errorFallback"), {
        position: "bottom-right",
      });
    },
  });

  async function handleRemoveNote() {
    await mutate();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-xl">
        <DropdownMenuItem variant="destructive" onClick={handleRemoveNote}>
          <Trash2 />
          {t("remove")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
