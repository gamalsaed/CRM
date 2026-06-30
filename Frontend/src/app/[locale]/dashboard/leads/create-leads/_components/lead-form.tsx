"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Field from "@/shared/components/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, LeadFormValues } from "@/shared/lib/schemas/leads.s";
import { cn } from "@/shared/lib/utils/utils";
import { Trash2 } from "lucide-react";
import LeadsToolbar from "./lead-tool-bar";
import { useTranslations } from "next-intl";

export default function LeadForm() {
  const t = useTranslations("LeadForm");
  const [leads, setLeads] = useState<LeadFormValues[]>([]);

  const { register, handleSubmit, reset, setValue, formState, control } =
    useForm<LeadFormValues>({
      resolver: zodResolver(leadSchema),
      defaultValues: {
        name: "",
        phone: "",
        whatsApp: "",
        email: "",
      },
    });

  const SOURCE_OPTIONS = [
    { value: "tik tok", label: t("sourceTikTok") },
    { value: "snapchat", label: t("sourceSnapchat") },
    { value: "facebook", label: t("sourceFacebook") },
    { value: "instagram", label: t("sourceInstagram") },
    { value: "recommended", label: t("sourceRecommended") },
    { value: "other", label: t("sourceOther") },
  ];

  function handleFormSubmit(values: LeadFormValues) {
    setLeads((prev) => [...prev, values]);
    reset();
  }

  function removeItem(index: number) {
    setLeads((prev) => {
      const newList = prev.filter((item, i) => index !== i);
      return newList;
    });
  }

  function clearAll() {
    setLeads([]);
  }

  const syncOnAutofill =
    (name: keyof LeadFormValues) =>
    (e: React.AnimationEvent<HTMLInputElement>) => {
      if (e.animationName === "onAutoFillStart") {
        setValue(name, e.currentTarget.value, { shouldValidate: true });
      }
    };

  return (
    <div>
      <div className="w-full overflow-x-auto overflow-y-visible">
        <form
          action=""
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex w-full justify-center items-end gap-2 pb-2 min-w-[600px] "
        >
          <Field label={t("name")}>
            <Input
              placeholder="e.g. Mona Khaled"
              className={cn(formState.errors.name && "border-destructive")}
              {...register("name")}
              onAnimationStart={syncOnAutofill("name")}
            />
          </Field>
          <Field label={t("phone")}>
            <Input
              placeholder="e.g. +2012243533"
              className={cn(formState.errors.phone && "border-destructive")}
              {...register("phone")}
              onAnimationStart={syncOnAutofill("phone")}
            />
          </Field>
          <Field label={t("whatsApp")}>
            <Input
              placeholder="e.g. +2012243533"
              className={cn(formState.errors.whatsApp && "border-destructive")}
              {...register("whatsApp")}
              onAnimationStart={syncOnAutofill("whatsApp")}
            />
          </Field>
          <Field label={t("source")}>
            <Controller
              name="source"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full rounded-xl mb-0 ",
                      formState.errors.source && "border-destructive",
                    )}
                  >
                    <SelectValue placeholder={t("selectSource")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {SOURCE_OPTIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label={t("email")}>
            <Input
              placeholder="e.g. mona@example.com"
              className={cn(formState.errors.email && "border-destructive")}
              {...register("email")}
              onAnimationStart={syncOnAutofill("email")}
            />
          </Field>
          <Button className="w-fit">{t("save")}</Button>
        </form>
      </div>
      <div className="w-full my-10 overflow-x-auto overflow-y-visible">
        <div className="min-w-[1080px] first:rounded-2xl *:last:**:last:rounded-br-2xl *:last:**:first:rounded-bl-2xl *:first:**:last:rounded-tr-2xl *:first:**:first:rounded-tl-2xl ">
          {leads.map((lead, i) => {
            return (
              <ul key={i} className="flex justify-between">
                <li className="text-center w-14 px-2 py-2  border border-gray-200">
                  {i + 1}
                </li>
                <li className="text-center w-1/5 px-2 py-2  border border-gray-200">
                  {lead.name}
                </li>
                <li className="text-center w-1/5 px-2 py-2  border border-gray-200">
                  {lead.phone}
                </li>
                <li className="text-center w-1/5 px-2 py-2  border border-gray-200">
                  {lead.whatsApp}
                </li>
                <li className="text-center w-1/5 px-2 py-2  border border-gray-200 capitalize">
                  {lead.source}
                </li>
                <li className="text-center w-1/3 px-2 py-2  border border-gray-200">
                  {lead.email}
                </li>
                <li className="text-center w-14 px-2 py-2  border border-gray-200">
                  <Trash2
                    size={20}
                    onClick={() => removeItem(i)}
                    className="text-red-400 cursor-pointer"
                  />
                </li>
              </ul>
            );
          })}
        </div>
      </div>
      <LeadsToolbar leads={leads} clearFn={clearAll} />
    </div>
  );
}
