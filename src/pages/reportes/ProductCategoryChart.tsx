import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ProductosCategoriaItem } from "./types";

interface ProductCategoryTableProps {
  data: ProductosCategoriaItem[];
}

export default function ProductCategoryChart({ data }: ProductCategoryTableProps) {
  const { t } = useTranslation();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("es-CO").format(value);
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 30) return "success";
    if (percentage >= 15) return "warning";
    return "default";
  };

  if (data.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          {t('reports:productCategory.noData')}
        </Typography>
      </Box>
    );
  }

  // Ordenar datos por porcentaje descendente
  const sortedData = [...data].sort((a, b) => b.porcentaje - a.porcentaje);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2 }}>
        📦 {t('reports:productCategory.title')}
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de productos por categoría">
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.50" }}>
              <TableCell sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                {t('reports:productCategory.category')}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                {t('reports:productCategory.units')}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                {t('reports:productCategory.revenue')}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                {t('reports:productCategory.percentage')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((item, index) => (
              <TableRow
                key={item.categoria}
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: "action.hover",
                  },
                  "&:hover": {
                    backgroundColor: "action.selected",
                  },
                }}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: "medium" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: index === 0 ? "success.main" : 
                                       index === 1 ? "primary.main" : 
                                       index === 2 ? "warning.main" : "grey.400",
                      }}
                    />
                    {item.categoria}
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ fontFamily: "monospace" }}>
                  {formatNumber(item.unidades)}
                </TableCell>
                <TableCell align="right" sx={{ fontFamily: "monospace", fontWeight: "medium" }}>
                  {formatCurrency(item.ingresos_usd)}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={`${item.porcentaje.toFixed(1)}%`}
                    color={getPercentageColor(item.porcentaje)}
                    size="small"
                    sx={{ fontWeight: "bold", minWidth: 60 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
