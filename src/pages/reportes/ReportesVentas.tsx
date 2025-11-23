import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  FormLabel,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormControl,
  FormHelperText,
  Chip,
  OutlinedInput,
  Select,
  InputLabel,
  CircularProgress,
  Alert,
  Collapse,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ExpandMore, ExpandLess, FilterList } from "@mui/icons-material";
import { PaisesService, Pais } from "../../services/paisesService";
import { VendedorService } from "../../services/vendedoresService";
import { CategoriasSuministrosService, CategoriaSuministro } from "../../services/categoriasSuministrosService";
import { ReportesService } from "../../services/reportesService";
import { useNotify } from "../../components/NotificationProvider";
import { getApiErrorMessage } from "../../utils/apiError";
import { ReportFilters, ReportResponse, VendedorOption } from "./types";
import KPICards from "./KPICards";
import GoalVsSales from "./GoalVsSales";
import PerformanceTable from "./PerformanceTable";
import RegionalSalesChart from "./RegionalSalesChart";
import ProductCategoryChart from "./ProductCategoryChart";

const schema = yup.object({
  vendedor_id: yup.number().nullable().default(null),
  pais: yup.array().of(yup.number().required()).required(),
  zona_geografica: yup.array().of(yup.string().required()).required(),
  periodo_tiempo: yup
    .mixed<"MES_ACTUAL" | "TRIMESTRE_ACTUAL" | "ANIO_ACTUAL" | "PERSONALIZADO">()
    .oneOf(["MES_ACTUAL", "TRIMESTRE_ACTUAL", "ANIO_ACTUAL", "PERSONALIZADO"])
    .required("Período de tiempo es requerido"),
  fecha_inicio: yup.string().nullable().default(null),
  fecha_fin: yup.string().nullable().default(null),
  categoria_producto: yup.array().of(yup.string().required()).required(),
  tipo_reporte: yup
    .array()
    .of(yup.string().required())
    .min(1, "Debe seleccionar al menos un tipo de reporte")
    .required(),
}).test("segmentation-filter", "Debe seleccionar al menos un filtro: vendedor, país o zona geográfica", function(value) {
  const { vendedor_id, pais, zona_geografica } = value;
  return vendedor_id !== null || pais.length > 0 || zona_geografica.length > 0;
}).test("custom-dates", "Debe indicar fecha_inicio y fecha_fin para período PERSONALIZADO", function(value) {
  const { periodo_tiempo, fecha_inicio, fecha_fin } = value;
  if (periodo_tiempo === "PERSONALIZADO") {
    return fecha_inicio !== null && fecha_fin !== null && fecha_inicio !== "" && fecha_fin !== "";
  }
  return true;
}).test("date-range", "fecha_fin debe ser mayor a fecha_inicio", function(value) {
  const { periodo_tiempo, fecha_inicio, fecha_fin } = value;
  if (periodo_tiempo === "PERSONALIZADO" && fecha_inicio && fecha_fin) {
    return new Date(fecha_fin) > new Date(fecha_inicio);
  }
  return true;
}).test("date-max-range", "El rango máximo es de 2 años (730 días)", function(value) {
  const { periodo_tiempo, fecha_inicio, fecha_fin } = value;
  if (periodo_tiempo === "PERSONALIZADO" && fecha_inicio && fecha_fin) {
    const start = new Date(fecha_inicio);
    const end = new Date(fecha_fin);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 730;
  }
  return true;
});

const ZONA_GEOGRAFICA_OPTIONS = ["Norte", "Centro", "Sur"];
const TIPO_REPORTE_OPTIONS = [
  { value: "DESEMPENO_VENDEDOR", label: "Desempeño por Vendedor" },
  { value: "VENTAS_POR_PRODUCTO", label: "Ventas por Producto" },
  { value: "CUMPLIMIENTO_METAS", label: "Cumplimiento de Metas" },
  { value: "VENTAS_POR_ZONA", label: "Ventas por Zona" },
];

const PERIODO_OPTIONS = [
  { value: "MES_ACTUAL", label: "Mes Actual" },
  { value: "TRIMESTRE_ACTUAL", label: "Trimestre Actual" },
  { value: "ANIO_ACTUAL", label: "Año Actual" },
  { value: "PERSONALIZADO", label: "Personalizado" },
];

export default function ReportesVentas() {
  const { notify } = useNotify();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const { control, handleSubmit, watch, formState: { errors } } = useForm<ReportFilters>({
    resolver: yupResolver(schema),
    defaultValues: {
      vendedor_id: null,
      pais: [],
      zona_geografica: [],
      periodo_tiempo: "MES_ACTUAL",
      fecha_inicio: null,
      fecha_fin: null,
      categoria_producto: [],
      tipo_reporte: [],
    },
  });

  const [paises, setPaises] = useState<Pais[]>([]);
  const [vendedores, setVendedores] = useState<VendedorOption[]>([]);
  const [categorias, setCategorias] = useState<CategoriaSuministro[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportResponse | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(!isMobile);

  const periodoTiempo = watch("periodo_tiempo");
  const showCustomDates = periodoTiempo === "PERSONALIZADO";

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [paisesResp, vendedoresResp, categoriasResp] = await Promise.all([
          PaisesService.listar(),
          VendedorService.listar(),
          CategoriasSuministrosService.listar(),
        ]);
        setPaises(paisesResp.data);
        setVendedores(vendedoresResp.data.map((v: any) => ({ id: v.id, nombre: v.nombre })));
        setCategorias(categoriasResp.data);
      } catch (e) {
        notify(getApiErrorMessage(e), "error");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [notify]);

  const onSubmit = async (data: ReportFilters) => {
    setReportLoading(true);
    try {
      const response = await ReportesService.generarReporte(data);
      setReportData(response.data);
      notify("Reporte generado exitosamente", "success");
      if (isMobile) {
        setFiltersExpanded(false);
      }
    } catch (e) {
      notify(getApiErrorMessage(e), "error");
    } finally {
      setReportLoading(false);
    }
  };

  const renderMultiSelect = (
    name: keyof ReportFilters,
    options: any[],
    getOptionLabel: (option: any) => string,
    getOptionValue: (option: any) => any,
    label: string,
    placeholder: string
  ) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl fullWidth margin="normal" error={!!errors[name]}>
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            multiple
            input={<OutlinedInput label={label} />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selected as any[]).map((value) => {
                  const option = options.find(opt => getOptionValue(opt) === value);
                  return (
                    <Chip key={value} label={option ? getOptionLabel(option) : value} size="small" />
                  );
                })}
              </Box>
            )}
            disabled={loading}
          >
            {options.map((option) => (
              <MenuItem key={getOptionValue(option)} value={getOptionValue(option)}>
                <Checkbox checked={(field.value as any[]).indexOf(getOptionValue(option)) > -1} />
                {getOptionLabel(option)}
              </MenuItem>
            ))}
          </Select>
          {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );

  return (
    <Box sx={{ maxWidth: 1400, m: "auto", p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, textAlign: "center" }}>
        📊 Reportes de Ventas
      </Typography>

      {/* Filters Section */}
      <Paper sx={{ p: 3, mb: 4, boxShadow: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FilterList sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
            Filtros de Reporte
          </Typography>
          {isMobile && (
            <IconButton onClick={() => setFiltersExpanded(!filtersExpanded)}>
              {filtersExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </Box>

        <Collapse in={filtersExpanded}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {/* Vendedor */}
              <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
                <FormLabel sx={{ mb: 1, display: "block" }}>Vendedor (opcional)</FormLabel>
                <Controller
                  name="vendedor_id"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      placeholder="Seleccionar vendedor (opcional)"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      disabled={loading}
                    >
                      <MenuItem value="">Ninguno</MenuItem>
                      {vendedores.map((v) => (
                        <MenuItem key={v.id} value={v.id}>{v.nombre}</MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>

              {/* País */}
              <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
                <FormLabel sx={{ mb: 1, display: "block" }}>País (multi-selección)</FormLabel>
                {renderMultiSelect(
                  "pais",
                  paises,
                  (p) => p.nombre,
                  (p) => p.id,
                  "Países",
                  "Seleccionar países"
                )}
              </Box>

              {/* Zona Geográfica */}
              <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
                <FormLabel sx={{ mb: 1, display: "block" }}>Zona Geográfica (multi-selección)</FormLabel>
                {renderMultiSelect(
                  "zona_geografica",
                  ZONA_GEOGRAFICA_OPTIONS.map(z => ({ value: z, label: z })),
                  (z) => z.label,
                  (z) => z.value,
                  "Zonas Geográficas",
                  "Seleccionar zonas"
                )}
              </Box>

              {/* Período de Tiempo */}
              <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
                <FormLabel sx={{ mb: 1, display: "block" }}>Período de Tiempo ⚠️ REQUERIDO</FormLabel>
                <Controller
                  name="periodo_tiempo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      error={!!errors.periodo_tiempo}
                      helperText={errors.periodo_tiempo?.message}
                    >
                      {PERIODO_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>

              {/* Fechas Personalizadas */}
              {showCustomDates && (
                <>
                  <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
                    <FormLabel sx={{ mb: 1, display: "block" }}>Fecha Inicio</FormLabel>
                    <Controller
                      name="fecha_inicio"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                          error={!!errors.fecha_inicio}
                          helperText={errors.fecha_inicio?.message}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
                    <FormLabel sx={{ mb: 1, display: "block" }}>Fecha Fin</FormLabel>
                    <Controller
                      name="fecha_fin"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                          error={!!errors.fecha_fin}
                          helperText={errors.fecha_fin?.message}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </Box>
                </>
              )}

              {/* Categoría de Producto */}
              <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 calc(50% - 12px)" } }}>
                <FormLabel sx={{ mb: 1, display: "block" }}>Categoría de Producto (multi-selección)</FormLabel>
                {renderMultiSelect(
                  "categoria_producto",
                  categorias,
                  (c) => c.nombre,
                  (c) => c.nombre,
                  "Categorías de Producto",
                  "Seleccionar categorías"
                )}
              </Box>

              {/* Tipos de Reporte */}
              <Box sx={{ flex: "1 1 100%" }}>
                <FormLabel sx={{ mb: 1, display: "block" }}>Tipos de Reporte ⚠️ REQUERIDO (mínimo 1)</FormLabel>
                <Controller
                  name="tipo_reporte"
                  control={control}
                  render={({ field }) => (
                    <FormControl error={!!errors.tipo_reporte} fullWidth>
                      <FormGroup row>
                        {TIPO_REPORTE_OPTIONS.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            control={
                              <Checkbox
                                checked={(field.value as string[]).includes(option.value)}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...(field.value as string[]), option.value]
                                    : (field.value as string[]).filter(v => v !== option.value);
                                  field.onChange(newValue);
                                }}
                              />
                            }
                            label={option.label}
                          />
                        ))}
                      </FormGroup>
                      {errors.tipo_reporte && (
                        <FormHelperText>{errors.tipo_reporte.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Box>
            </Box>

            {/* Submit Button */}
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={reportLoading}
                sx={{ minWidth: 200, py: 1.5 }}
              >
                {reportLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Generando Reporte...
                  </>
                ) : (
                  "📊 Generar Reporte"
                )}
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Paper>

      {/* Report Results */}
      {reportData && (
        <Box>
          {/* KPIs */}
          <KPICards kpis={reportData.kpis} />

          {/* Goal vs Sales */}
          <GoalVsSales kpis={reportData.kpis} metaObjetivo={reportData.meta_objetivo_usd} />

          {/* Performance Table */}
          {reportData.desempeno_vendedores && reportData.desempeno_vendedores.length > 0 && (
            <PerformanceTable data={reportData.desempeno_vendedores} />
          )}

          {/* Charts */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 calc(50% - 16px)" } }}>
              <RegionalSalesChart data={reportData.ventas_por_region} />
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 calc(50% - 16px)" } }}>
              <ProductCategoryChart data={reportData.productos_por_categoria} />
            </Box>
          </Box>
        </Box>
      )}

      {/* Loading State */}
      {reportLoading && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Generando reporte...
          </Typography>
        </Box>
      )}

      {/* Empty State */}
      {!reportData && !reportLoading && (
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="body1">
            Configure los filtros y haga clic en "Generar Reporte" para visualizar los datos de ventas.
          </Typography>
        </Alert>
      )}
    </Box>
  );
}
