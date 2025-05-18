"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
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
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

// Datos simulados de estados de conductores
const driverData = [
  { status: "available", count: 25, fill: "var(--color-available)" },
  { status: "unavailable", count: 8, fill: "var(--color-unavailable)" },
  { status: "on-delivery", count: 12, fill: "var(--color-ondelivery)" },
]

const chartConfig = {
  count: {
    label: "Conductores",
  },
  available: {
    label: "Disponible",
    color: "hsl(var(--chart-1))",
  },
  unavailable: {
    label: "No disponible",
    color: "hsl(var(--chart-2))",
  },
  "on-delivery": {
    label: "En entrega",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function PieChartInteractive() {
  const id = "pie-drivers"
  const [activeStatus, setActiveStatus] = React.useState(driverData[0].status)
  const activeIndex = driverData.findIndex(item => item.status === activeStatus)
  const statuses = driverData.map(item => item.status)

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Estado de Conductores</CardTitle>
          <CardDescription>Actualizado hoy</CardDescription>
        </div>
        <Select value={activeStatus} onValueChange={setActiveStatus}>
          <SelectTrigger className="ml-auto h-7 w-[130px] rounded-lg pl-2.5">
            <SelectValue placeholder="Seleccionar estado" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {statuses.map(key => {
              const config = chartConfig[key as keyof typeof chartConfig]
              if (!config) return null
              return (
                <SelectItem key={key} value={key} className="rounded-lg [&_span]:flex">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{ backgroundColor: `var(--color-${key})` }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={driverData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {driverData[activeIndex].count.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Conductores
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}