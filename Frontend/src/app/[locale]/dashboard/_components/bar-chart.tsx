"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { LeadType } from "@/shared/lib/types/app-data.t";
export const description = "A bar chart";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "May", desktop: 300 },
  { month: "June", desktop: 400 },
];

type ChartData = {
  status: string;
  count: number;
};

const chartConfig = {
  count: {
    label: "count",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;
export function LeadsChartBar({ data }: { data: ChartData[] }) {
  return (
    <Card className="mt-8 rounded-2xl">
      <CardHeader>
        <h1 className="text-lg font-semibold text-primary-500 ">Status</h1>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[350px] w-full capitalize"
        >
          <BarChart accessibilityLayer data={data.slice(0, data.length - 1)}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="status"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="#2563eb" radius={20} barSize={100} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
