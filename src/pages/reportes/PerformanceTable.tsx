import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  Typography,
  Box,
} from "@mui/material";
import { useState } from "react";
import { DesempenoVendedorRow } from "./types";

interface PerformanceTableProps {
  data: DesempenoVendedorRow[];
}

export default function PerformanceTable({ data }: PerformanceTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5); // 5 registros por página

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Calcular los datos para la página actual
  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "OK":
        return { color: "success", label: "✅ OK" };
      case "HIGH":
        return { color: "info", label: "🔵 Alto" };
      case "WARN":
        return { color: "warning", label: "⚠️ Advertencia" };
      case "LOW":
        return { color: "error", label: "🔴 Bajo" };
      default:
        return { color: "default", label: estado };
    }
  };

  if (data.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No hay datos de desempeño de vendedores disponibles
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2 }}>
        👥 Desempeño por Vendedor
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Vendedor</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>País</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Pedidos
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Ventas (USD)
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Estado
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => {
              const statusConfig = getStatusColor(row.estado);
              return (
                <TableRow
                  key={index}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: "#fafafa",
                    },
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                      {row.vendedor}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.pais}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">{row.pedidos}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                      {formatCurrency(row.ventas_usd)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={statusConfig.label}
                      color={statusConfig.color as any}
                      size="small"
                      variant="filled"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5]}
          labelRowsPerPage="Registros por página:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
          sx={{
            borderTop: "1px solid #e0e0e0",
            "& .MuiTablePagination-toolbar": {
              paddingLeft: 2,
              paddingRight: 2,
            },
          }}
        />
      </TableContainer>
    </Box>
  );
}
