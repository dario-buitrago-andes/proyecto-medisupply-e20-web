import { Card, CardContent, Typography, Box } from "@mui/material";
import { TrendingUp, ShoppingCart, TrackChanges, Schedule } from "@mui/icons-material";
import { KPI } from "./types";

interface KPICardsProps {
  kpis: KPI;
}

export default function KPICards({ kpis }: KPICardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const kpiData = [
    {
      title: "Ventas Totales",
      value: formatCurrency(kpis.ventas_totales),
      icon: <TrendingUp sx={{ fontSize: 40, color: "#4caf50" }} />,
      color: "#4caf50",
    },
    {
      title: "Pedidos del Mes",
      value: `${kpis.pedidos_mes} pedidos`,
      icon: <ShoppingCart sx={{ fontSize: 40, color: "#2196f3" }} />,
      color: "#2196f3",
    },
    {
      title: "Cumplimiento",
      value: formatPercentage(kpis.cumplimiento),
      icon: <TrackChanges sx={{ fontSize: 40, color: "#ff9800" }} />,
      color: "#ff9800",
    },
    {
      title: "Tiempo Entrega Promedio",
      value: `${kpis.tiempo_entrega_promedio_h} horas`,
      icon: <Schedule sx={{ fontSize: 40, color: "#9c27b0" }} />,
      color: "#9c27b0",
    },
  ];

  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: 3, 
        mb: 4,
        "& > *": {
          flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(25% - 18px)" }
        }
      }}
    >
      {kpiData.map((kpi, index) => (
        <Card 
          key={index}
          sx={{ 
            minHeight: "120px",
            display: "flex", 
            alignItems: "center",
            borderLeft: `4px solid ${kpi.color}`,
            "&:hover": {
              boxShadow: 3,
              transform: "translateY(-2px)",
              transition: "all 0.3s ease-in-out",
            },
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Box sx={{ mr: 2 }}>
              {kpi.icon}
            </Box>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                {kpi.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {kpi.title}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
