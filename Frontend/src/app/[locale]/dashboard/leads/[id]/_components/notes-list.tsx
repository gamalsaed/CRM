"use client";

import { useParams } from "next/navigation";
import { Note } from "./note";
import { AddNoteDialog } from "./add-note-form";
import { useTranslations } from "next-intl";

interface NoteItem {
  _id: string;
  author: string;
  note: string;
  createdAt: string;
  createdBy: {
    name: string;
  };
}

interface NotesListProps {
  notes: NoteItem[];
}

export function NotesList({ notes }: NotesListProps) {
  const t = useTranslations("NotesList");
  const params = useParams();

  return (
    <div className="bg-white border mt-5 border-gray-100 rounded-xl shadow-sm p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{t("title")}</h2>
          <p className="text-sm text-gray-400">{t("subtitle")}</p>
        </div>
        <AddNoteDialog id={params.id as string} />
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col items-center pt-4 gap-0">
          {notes.map((note, i) => (
            <div key={note._id} className="flex flex-col items-center">
              <div className="h-2 w-2 rounded-full bg-gray-300 shrink-0" />
              {i < notes.length - 1 && (
                <div
                  className="w-px flex-1 bg-gray-200 my-1"
                  style={{ minHeight: 48 }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {notes.length > 0 ? (
            notes.map((note) => (
              <Note
                key={note._id}
                id={note._id}
                note={note.note}
                date={note.createdAt}
                author={note.createdBy.name}
              />
            ))
          ) : (
            <p className="text-xs text-gray-500 text-center">
              {t("emptyState")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
