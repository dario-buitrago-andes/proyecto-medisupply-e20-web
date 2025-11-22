import { Box, Typography, Paper } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { VentasPorRegionItem } from "./types";

interface RegionalSalesChartProps {
  data: VentasPorRegionItem[];
}

export default function RegionalSalesChart({ data }: RegionalSalesChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, boxShadow: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {`País: ${label}`}
          </Typography>
          <Typography variant="body2" color="primary">
            {`Ventas: ${formatCurrency(payload[0].value)}`}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No hay datos de ventas por región disponibles
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2 }}>
        🗺️ Ventas por Región
      </Typography>
      <Paper sx={{ p: 3, boxShadow: 2 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="zona" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "#e0e0e0" }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "#e0e0e0" }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="ventas_usd" 
              fill="#2196f3"
              radius={[4, 4, 0, 0]}
              name="Ventas (USD)"
            />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}
