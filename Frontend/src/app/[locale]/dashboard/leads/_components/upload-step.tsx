"use client";

import { useState, useEffect, type SetStateAction, type Dispatch } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { LeadFormValues } from "@/shared/lib/schemas/leads.s";
import { useTranslations } from "next-intl";

export default function UploadStep({
  next,
  setLeads,
}: {
  next: () => void;
  setLeads: Dispatch<SetStateAction<LeadFormValues[]>>;
}) {
  const t = useTranslations("UploadStep");
  const [fileState, setFileState] = useState<File | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setFileState(file);
  }
  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setFileState(file);
  }

  useEffect(() => {
    async function handleExcel() {
      if (fileState) {
        const workbook = XLSX.read(await fileState.arrayBuffer());
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data: LeadFormValues[] = XLSX.utils.sheet_to_json(sheet);
        setLeads(data);
      }
    }
    handleExcel();
  }, [fileState]);

  return (
    <div className="w-full ">
      <Input
        id="xlsx"
        accept=".xlsx"
        type="file"
        className="hidden"
        onChange={handleChange}
      />
      <label
        htmlFor="xlsx"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-[2.5px] flex justify-center items-center flex-col border-[#d9dde3] hover:border-primary-500 hover:bg-primary-50 transition-colors duration-100 ease-in-out rounded-2xl border-dashed px-6 py-9 block w-full"
      >
        <div className="p-4 rounded-2xl text-primary-500 w-fit bg-primary-50">
          <Upload size={24} />
        </div>
        <h1 className="text-2xl font-semibold">{t("dragDrop")}</h1>
        <p className="text-gray-400 text-base">{t("browseHint")}</p>
        {fileState && (
          <div className="mt-3 text-center">
            <div>
              <span>{t("fileName")} </span>
              <span>{fileState.name}</span>
            </div>
            <div>
              <span>{t("fileSize")} </span>
              <span>{(fileState.size / (1024 * 1024)).toFixed(2)}MP</span>
            </div>
          </div>
        )}
      </label>
      <div className="flex justify-end">
        <Button
          className="mt-3 w-fit px-4"
          disabled={!fileState}
          onClick={next}
        >
          {t("preview")}
        </Button>
      </div>
    </div>
  );
}
