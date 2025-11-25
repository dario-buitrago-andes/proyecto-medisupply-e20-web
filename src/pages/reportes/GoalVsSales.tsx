import { Box, Typography, Paper, LinearProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { KPI } from "./types";

interface GoalVsSalesProps {
  kpis: KPI;
  metaObjetivo: number;
}

export default function GoalVsSales({ kpis, metaObjetivo }: GoalVsSalesProps) {
  const { t } = useTranslation();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const progressPercentage = Math.min((kpis.ventas_totales / metaObjetivo) * 100, 100);
  const isOverGoal = kpis.ventas_totales > metaObjetivo;

  const getProgressColor = () => {
    if (progressPercentage >= 100) return "success";
    if (progressPercentage >= 75) return "info";
    if (progressPercentage >= 50) return "warning";
    return "error";
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2 }}>
        🎯 {t('reports:goalVsSales.title')}
      </Typography>
      <Paper sx={{ p: 3, boxShadow: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {t('reports:goalVsSales.goalTarget')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
              {formatCurrency(metaObjetivo)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" color="text.secondary">
              {t('reports:goalVsSales.totalSales')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
              {formatCurrency(kpis.ventas_totales)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t('reports:goalVsSales.progress')}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: "bold",
                color: isOverGoal ? "success.main" : getProgressColor() + ".main"
              }}
            >
              {progressPercentage.toFixed(1)}%
              {isOverGoal && " 🎉"}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(progressPercentage, 100)}
            color={getProgressColor()}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: "#f0f0f0",
              "& .MuiLinearProgress-bar": {
                borderRadius: 6,
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary">
            {isOverGoal 
              ? t('reports:goalVsSales.exceeded', { amount: formatCurrency(kpis.ventas_totales - metaObjetivo) })
              : t('reports:goalVsSales.remaining', { amount: formatCurrency(metaObjetivo - kpis.ventas_totales) })
            }
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: "bold",
              color: isOverGoal ? "success.main" : "text.secondary"
            }}
          >
            {isOverGoal ? `✅ ${t('reports:goalVsSales.goalAchieved')}` : `📈 ${t('reports:goalVsSales.inProgress')}`}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
