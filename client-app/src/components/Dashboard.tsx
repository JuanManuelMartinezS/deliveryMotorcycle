"use client"

import * as React from "react"

import { BarChart } from "./graficos/BarChartMultiple"
import { BarChartMixed } from "./graficos/BarChartMixed"
import { BarChartActive } from "./graficos/BarChartActive"
import { PieChartInteractive } from "./graficos/PieChartInteractive"
import { PieChartLegend } from "./graficos/PieChartLegend"
import { PieChartStacked } from "./graficos/PieChartStacked"
import { LineChartInteractive } from "./graficos/LineChartInteractive"
import { AreaChartInteractive } from "./graficos/AreaChartInteractive"
import { LineChartMultiple } from "./graficos/LineChartMultiple"

export function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Gráficos de Series Temporales */}
      <LineChartInteractive />
      <AreaChartInteractive />
      <LineChartMultiple />
      {/* Gráficos de Barras */}
      <BarChart />
      <BarChartMixed />
      <BarChartActive />

      {/* Gráficos Circulares */}
      <PieChartInteractive />
      <PieChartLegend />
      <PieChartStacked />


    </div>
  )
}