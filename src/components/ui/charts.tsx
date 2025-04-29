
import React from "react";
import { 
  ResponsiveContainer, 
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

interface ChartProps {
  data: Array<Record<string, any>>;
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["#1976D2", "#2196F3", "#64B5F6"],
  valueFormatter = (value: number) => `${value}`,
}: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={index}
          tick={{ fontSize: 12 }}
          tickMargin={10}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickFormatter={valueFormatter}
        />
        <Tooltip 
          formatter={(value) => [valueFormatter(value as number), ""]} 
          labelFormatter={(label) => `${label}`}
        />
        <Legend />
        {categories.map((category, i) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["#1976D2", "#2196F3", "#64B5F6"],
  valueFormatter = (value: number) => `${value}`,
}: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={index}
          tick={{ fontSize: 12 }}
          tickMargin={10}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickFormatter={valueFormatter}
        />
        <Tooltip 
          formatter={(value) => [valueFormatter(value as number), ""]} 
          labelFormatter={(label) => `${label}`}
        />
        <Legend />
        {categories.map((category, i) => (
          <Bar
            key={category}
            dataKey={category}
            fill={colors[i % colors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export function PieChart({
  data,
  index,
  categories,
  colors = ["#4CAF50", "#FFC107", "#F44336", "#2196F3", "#9C27B0", "#FF9800"],
  valueFormatter = (value: number) => `${value}`,
}: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey={categories[0]}
          nameKey={index}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [valueFormatter(value as number), ""]}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
