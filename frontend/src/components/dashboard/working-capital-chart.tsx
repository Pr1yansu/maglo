import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Calendar, ChevronDown } from "lucide-react";

interface WorkingCapitalData {
  type: "income" | "expense";
  amount: number;
  date: Date | number;
}

interface WorkingCapitalChartProps {
  data: WorkingCapitalData[];
}

type Granularity = "daily" | "weekly" | "monthly";

const chartConfig = {
  income: {
    label: "Income",
    color: "#10b981",
  },
  expense: {
    label: "Expense",
    color: "#ef4444",
  },
} satisfies ChartConfig;

const WorkingCapitalChart = ({ data }: WorkingCapitalChartProps) => {
  const [granularity, setGranularity] = useState<Granularity>("daily");

  const formatCurrencyShort = (value: number): string => {
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value.toFixed(0)}`;
  };

  // Format date labels based on granularity
  const formatDateLabel = (date: Date, granularity: Granularity): string => {
    switch (granularity) {
      case "weekly":
        const endOfWeek = new Date(date);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
      case "monthly":
        return date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      default: // daily
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
    }
  };

  // Process and group data by granularity
  const processedData = useMemo(() => {
    // Convert all dates to Date objects and sort
    const sortedData = data
      .map((item) => ({
        ...item,
        date: new Date(item.date),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    // Group data by granularity
    const grouped = new Map<
      string,
      { income: number; expense: number; date: Date }
    >();

    sortedData.forEach((item) => {
      let key: string;
      let groupDate: Date;

      switch (granularity) {
        case "weekly":
          // Get start of week (Sunday)
          const weekStart = new Date(item.date);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          weekStart.setHours(0, 0, 0, 0);
          key = weekStart.toISOString().split("T")[0];
          groupDate = weekStart;
          break;
        case "monthly":
          // Get start of month
          const monthStart = new Date(
            item.date.getFullYear(),
            item.date.getMonth(),
            1
          );
          key = `${monthStart.getFullYear()}-${monthStart.getMonth() + 1}`;
          groupDate = monthStart;
          break;
        default: // daily
          key = item.date.toISOString().split("T")[0];
          groupDate = new Date(
            item.date.getFullYear(),
            item.date.getMonth(),
            item.date.getDate()
          );
      }

      if (!grouped.has(key)) {
        grouped.set(key, { income: 0, expense: 0, date: groupDate });
      }

      const group = grouped.get(key)!;
      if (item.type === "income") {
        group.income += item.amount;
      } else {
        group.expense += item.amount;
      }
    });

    // Convert to array and format for chart
    return Array.from(grouped.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((item) => ({
        date: item.date,
        dateLabel: formatDateLabel(item.date, granularity),
        income: item.income,
        expense: item.expense,
        netFlow: item.income - item.expense,
      }));
  }, [data, granularity]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalIncome = processedData.reduce(
      (sum, item) => sum + item.income,
      0
    );
    const totalExpense = processedData.reduce(
      (sum, item) => sum + item.expense,
      0
    );
    const netFlow = totalIncome - totalExpense;
    const avgIncome = totalIncome / (processedData.length || 1);
    const avgExpense = totalExpense / (processedData.length || 1);

    return {
      totalIncome,
      totalExpense,
      netFlow,
      avgIncome,
      avgExpense,
    };
  }, [processedData]);

  return (
    <>
      <Card className="w-full">
        <CardHeader className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              Working Capital Flow
            </CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm pt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-muted-foreground">Income</span>
                <span className="font-semibold text-emerald-600">
                  {formatCurrency(summaryStats.totalIncome)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-muted-foreground">Expense</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(summaryStats.totalExpense)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {summaryStats.netFlow >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className="text-muted-foreground">Net Flow</span>
                <span
                  className={cn(
                    "font-semibold",
                    summaryStats.netFlow >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  )}
                >
                  {formatCurrency(summaryStats.netFlow)}
                </span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 min-w-[120px] justify-between"
                >
                  {granularity.charAt(0).toUpperCase() + granularity.slice(1)}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[120px]">
                {(["daily", "weekly", "monthly"] as const).map((period) => (
                  <DropdownMenuItem
                    key={period}
                    onClick={() => setGranularity(period)}
                    className={cn(
                      "cursor-pointer",
                      granularity === period &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="p-0 rounded-md">
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <LineChart data={processedData}>
              <CartesianGrid
                strokeDasharray="1 1"
                className="opacity-20"
                horizontal={true}
                vertical={true}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="dateLabel"
                tick={{ fontSize: 12 }}
                tickLine={true}
                axisLine={true}
                angle={0}
                textAnchor="middle"
                height={50}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={true}
                axisLine={true}
                tickFormatter={(value) => formatCurrencyShort(value)}
                stroke="hsl(var(--muted-foreground))"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      formatCurrency(Number(value)),
                      name === "income" ? "Income" : "Expense",
                    ]}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="var(--color-income)"
                strokeWidth={3}
                dot={{ fill: "var(--color-income)", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 8,
                  stroke: "var(--color-income)",
                  strokeWidth: 1,
                  fill: "var(--color-income)",
                  style: {
                    filter: "drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))",
                  },
                }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="var(--color-expense)"
                strokeWidth={3}
                dot={{ fill: "var(--color-expense)", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 8,
                  stroke: "var(--color-expense)",
                  strokeWidth: 1,
                  fill: "var(--color-expense)",
                  style: {
                    filter: "drop-shadow(0 0 6px rgba(239, 68, 68, 0.6))",
                  },
                }}
                connectNulls={false}
              />
            </LineChart>
          </ChartContainer>

          {/* Additional Insights */}
        </CardContent>
      </Card>
      <div className="mt-6 p-4 bg-muted/20 rounded-lg border-0">
        <h4 className="text-sm font-medium mb-3 text-foreground">Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div>
            Average Income:{" "}
            <span className="text-emerald-600 font-medium">
              {formatCurrency(summaryStats.avgIncome)}
            </span>
          </div>
          <div>
            Average Expense:{" "}
            <span className="text-red-600 font-medium">
              {formatCurrency(summaryStats.avgExpense)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkingCapitalChart;
