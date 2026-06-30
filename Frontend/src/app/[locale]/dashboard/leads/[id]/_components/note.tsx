"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/shared/lib/utils/formateDate";
import NoteAction from "./note-action";
import { useTranslations } from "next-intl";

interface NoteProps {
  author: string;
  note: string;
  date: string;
  id: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-cyan-500",
  ];
  const index =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
}

export function Note({ author, note, date, id }: NoteProps) {
  const t = useTranslations("Note");
  const initials = getInitials(author);
  const avatarColor = getAvatarColor(author);

  return (
    <div className="flex items-start gap-3 px-4 py-3 bg-white border border-gray-100 rounded-lg shadow-sm">
      <Avatar className="h-8 w-8 shrink-0 mt-0.5">
        <AvatarFallback
          className={`${avatarColor} text-white text-xs font-semibold`}
        >
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-900">{author}</span>
          <Badge
            variant="outline"
            className="text-emerald-600 border-emerald-200 bg-emerald-50 text-xs font-medium px-2 py-0"
          >
            {t("badge")}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-0.5">{note}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0 mt-0.5">
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {formatDate(date)}
        </span>
        <NoteAction noteId={id} />
      </div>
    </div>
  );
}
