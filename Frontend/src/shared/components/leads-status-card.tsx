import { cn } from "@/shared/lib/utils/utils";

type CardProps = {
  title: string;
  count: number;
};

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "new":
      return {
        border: "border-blue-500",
        bg: "bg-blue-500/10",
        text: "text-blue-500",
        number: "text-blue-600",
      };

    case "contacted":
      return {
        border: "border-yellow-500",
        bg: "bg-yellow-500/10",
        text: "text-yellow-500",
        number: "text-yellow-600",
      };

    case "qualified":
      return {
        border: "border-green-500",
        bg: "bg-green-500/10",
        text: "text-green-500",
        number: "text-green-600",
      };

    case "closed":
      return {
        border: "border-emerald-600",
        bg: "bg-emerald-500/10",
        text: "text-emerald-600",
        number: "text-emerald-700",
      };

    case "lost":
      return {
        border: "border-red-500",
        bg: "bg-red-500/10",
        text: "text-red-500",
        number: "text-red-600",
      };

    case "problem":
      return {
        border: "border-orange-500",
        bg: "bg-orange-500/10",
        text: "text-orange-500",
        number: "text-orange-600",
      };

    case "solved":
      return {
        border: "border-purple-500",
        bg: "bg-purple-500/10",
        text: "text-purple-500",
        number: "text-purple-600",
      };

    default:
      return {
        border: "border-gray-500",
        bg: "bg-gray-500/10",
        text: "text-gray-500",
        number: "text-gray-600",
      };
  }
};

export default function CountCard({ title, count }: CardProps) {
  const style = getStatusStyles(title);
  return (
    <div
      className={cn(
        "rounded-xl flex-1 w-full transition-all cursor-default duration-300 hover:scale-[1.03] hover:shadow-xl border p-4",
        style.bg,
        style.border,
      )}
    >
      <p
        className={cn("text-md text-center capitalize font-bold ", style.text)}
      >
        {title}
      </p>
      <p className={cn("text-xl text-center font-bold  mt-1", style.number)}>
        {count}
      </p>
    </div>
  );
}
