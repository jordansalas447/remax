"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { mes: "Enero", ventas: 120 },
  { mes: "Febrero", ventas: 180 },
  { mes: "Marzo", ventas: 150 },
  { mes: "Abril", ventas: 220 },
];

export default function DashboardPage() {
  return (
    <div className="w-full max-w-lxl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-6 my-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300 text-center">
        Ventas Mensuales
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 15, right: 30, left: 0, bottom: 5 }}
          barCategoryGap={24}
        >
          <CartesianGrid strokeDasharray="4 2" stroke="#d6e4ff" />
          <XAxis
            dataKey="mes"
            tick={{ fill: "#64748b", fontWeight: 500 }}
            axisLine={{ stroke: "#bcccdc" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontWeight: 500 }}
            axisLine={{ stroke: "#bcccdc" }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "#e0e7ff66" }}
            contentStyle={{ borderRadius: 12, background: "#fff", border: "1px solid #d1d5db" }}
            labelStyle={{ color: "#3b82f6", fontWeight: 600 }}
            itemStyle={{ color: "#a21caf" }}
          />
          <Bar dataKey="ventas" radius={[6, 6, 0, 0]}>
            {/* Colorful bars per month for visual variety */}
            <Cell fill="#3b82f6" />  {/* Enero - blue */}
            <Cell fill="#a21caf" />  {/* Febrero - purple */}
            <Cell fill="#10b981" />  {/* Marzo - green */}
            <Cell fill="#f59e42" />  {/* Abril - orange */}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}