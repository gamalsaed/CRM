"use client";

// Hooks
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

// Shadcn
import { cn } from "../lib/utils/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

// Icons
import { CircleUserRound, FolderOpenDot } from "lucide-react";

// Types
import { type User, ProjectType } from "../lib/types/app-data.t";

// Actions
import { assignLeadsAction } from "../lib/actions/leads.action";

type dialogProps = {
  data: User[] | ProjectType[];
  ids: string[];
  target: "project" | "user";
};

export function AssignDialog({ ids, data, target }: dialogProps) {
  // States
  const [selected, setSelected] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  // Effect
  useEffect(() => {
    setSelected("");
  }, [isOpen]);

  // Mutation
  const { isPending, mutate } = useMutation({
    mutationKey: [`assign-leads-to-${target}`],
    mutationFn: () => assignLeadsAction(selected!, ids, target),
    onSuccess: () => {
      setIsOpen(false);
      toast.success("You have assigned the leads successfully", {
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer p-2 text-[12px] transition-colors duration-200 hover:bg-gray-50 flex  items-center gap-3">
          {target === "user" ? (
            <CircleUserRound width={16} height={16} />
          ) : (
            <FolderOpenDot width={16} height={16} />
          )}

          <p>Assign to {target}</p>
        </div>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Select a {target}</DialogTitle>
          <DialogDescription>
            Your are about to assign {`(${ids.length})`} leads to a {target}
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          {data.map((record, i) => {
            return (
              <div key={record._id}>
                <div
                  className={cn(
                    "flex items-center justify-start gap-4 px-6 py-3 my-2 rounded-2xl transition-all hover:bg-gray-50 cursor-pointer",
                    selected === record._id &&
                      "bg-primary-100 hover:bg-primary-100 ",
                  )}
                  onClick={() => setSelected(record._id)}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                    {record.name[0]}
                  </div>
                  <div className="shrink-0"></div>
                  <div className="flex flex-col truncate">
                    <span className="text-sm/6 font-medium text-gray-950 dark:text-white">
                      {record.name}
                    </span>
                    {"email" in record && (
                      <span className="truncate text-sm/6 text-gray-500 dark:text-gray-400">
                        {record.email}
                      </span>
                    )}
                  </div>
                </div>
                {i !== data.length - 1 && <Separator />}
              </div>
            );
          })}
        </div>
        <Button
          disabled={!selected || isPending ? true : false}
          onClick={() => mutate()}
        >
          Assign
        </Button>
      </DialogContent>
    </Dialog>
  );
}
