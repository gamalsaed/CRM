import { X } from "lucide-react";

type ErrorRecordProps = {
  name: string;
  value: string;
  message: string;
};

export default function ErrorRecord({
  name,
  value,
  message,
}: ErrorRecordProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-5 py-3.5">
      <div className="flex items-center gap-2">
        <X className="h-4 w-4 text-red-500" strokeWidth={2.5} />
        <span className="text-[15px] font-semibold text-gray-900">{name}</span>
        <span className="text-gray-300">·</span>
        <span className="font-mono text-[13px] capitalize text-gray-400">
          {value}
        </span>
      </div>
      <span className="rounded-md bg-red-50 px-3 py-1 font-mono text-[12px] text-red-600">
        {message}
      </span>
    </div>
  );
}
