"use client"

import { Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "../ui/chart"

// Datos simulados de marcas de motocicletas
const chartData = [
  { brand: "Honda", count: 15, fill: "var(--color-honda)" },
  { brand: "Yamaha", count: 10, fill: "var(--color-yamaha)" },
  { brand: "Suzuki", count: 8, fill: "var(--color-suzuki)" },
  { brand: "Kawasaki", count: 5, fill: "var(--color-kawasaki)" },
  { brand: "Otras", count: 3, fill: "var(--color-other)" },
]

const chartConfig = {
  count: {
    label: "Motocicletas",
  },
  honda: {
    label: "Honda",
    color: "hsl(var(--chart-1))",
  },
  yamaha: {
    label: "Yamaha",
    color: "hsl(var(--chart-2))",
  },
  suzuki: {
    label: "Suzuki",
    color: "hsl(var(--chart-3))",
  },
  kawasaki: {
    label: "Kawasaki",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Otras",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function PieChartLegend() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribución por Marca</CardTitle>
        <CardDescription>Total de motocicletas</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie data={chartData} dataKey="count" />
            <ChartLegend
              content={<ChartLegendContent nameKey="brand" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}