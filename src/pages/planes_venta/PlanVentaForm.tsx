import { useForm, Controller } from "react-hook-form";
import {
    TextField,
    MenuItem,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    Checkbox,
    ListItemText,
    OutlinedInput,
} from "@mui/material";
import { PlanVentaService } from "../../services/planesVentaService";
import { useEffect, useState } from "react";
import { PaisesService, Pais } from "../../services/paisesService";
import { VendedorService } from "../../services/vendedoresService";
import { ProductoService } from "../../services/productosService";
import { useNotify } from "../../components/NotificationProvider";
import { getApiErrorMessage } from "../../utils/apiError";

const periodos = ["Q1", "Q2", "Q3", "Q4"];

type VendedorItem = { id: number; nombre: string; estado: string };
type ProductoItem = { id: number; nombre: string };




export default function PlanVentaForm() {
    const { notify } = useNotify();
    const [paises, setPaises] = useState<Pais[]>([]);
    const [vendedores, setVendedores] = useState<VendedorItem[]>([]);
    const [productos, setProductos] = useState<ProductoItem[]>([]);

    useEffect(() => {
        const cargar = async () => {
            try {
                const [pResp, vResp, prResp] = await Promise.all([
                    PaisesService.listar(),
                    VendedorService.listar(),
                    ProductoService.listar(),
                ]);
                setPaises(pResp.data);
                // Solo vendedores activos
                setVendedores((vResp.data as VendedorItem[]).filter(v => v.estado === "ACTIVO"));
                setProductos(prResp.data as ProductoItem[]);
            } catch (e) {
                notify(getApiErrorMessage(e), "error");
            }
        };
        cargar();
    }, [notify]);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            vendedor: 0,
            periodo: "",
            anio: new Date().getFullYear(),
            pais: 0,
            productos_objetivo: [] as number[],
            meta_monetaria_usd: 0,
        },
    });

    const onSubmit = async (data: any) => {
        if (Number(data.meta_monetaria_usd) <= 0) {
            notify("La meta monetaria debe ser mayor a 0", "warning");
            return;
        }
        try {
            await PlanVentaService.crear(data);
            notify("Plan de venta creado correctamente", "success");
        } catch (e) {
            notify(getApiErrorMessage(e), "error");
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ maxWidth: 500, m: "auto", p: 2, display: "flex", flexDirection: "column" }}
        >
            {/* Vendedor */}
            <TextField
                select
                label="Vendedor"
                {...register("vendedor", {
                    valueAsNumber: true,
                    validate: (v) => (Number(v) > 0) || "El vendedor es obligatorio",
                })}
                fullWidth
                margin="normal"
                error={!!errors.vendedor}
                helperText={errors.vendedor?.message as string}
            >
                <MenuItem value={0} disabled>
                    Selecciona un vendedor
                </MenuItem>
                {vendedores.map((v) => (
                    <MenuItem key={v.id} value={v.id}>
                        {v.nombre}
                    </MenuItem>
                ))}
            </TextField>

            {/* Periodo */}
            <TextField
                select
                label="Periodo"
                {...register("periodo", {
                    required: "El periodo es obligatorio",
                    validate: (val) => (val && periodos.includes(val)) || "Seleccione un periodo válido",
                })}
                fullWidth
                margin="normal"
                error={!!errors.periodo}
                helperText={errors.periodo?.message as string}
            >
                {periodos.map((p) => (
                    <MenuItem key={p} value={p}>
                        {p}
                    </MenuItem>
                ))}
            </TextField>

            {/* Año */}
            <TextField
                label="Año"
                type="number"
                {...register("anio", {
                    required: "El año es obligatorio",
                    validate: (value) => {
                        const year = Number(value);
                        if (!Number.isInteger(year)) return "El año debe ser numérico";
                        if (String(year).length !== 4) return "Debe tener 4 dígitos";
                        if (year < 1900 || year > 2100) return "Año fuera de rango (1900–2100)";
                        return true;
                    },
                })}
                fullWidth
                margin="normal"
                error={!!errors.anio}
                helperText={errors.anio?.message as string}
                inputProps={{ min: 1900, max: 2100 }}
            />

            {/* País */}
            <TextField
                select
                label="País"
                {...register("pais", {
                    valueAsNumber: true,
                    validate: (v) => (Number(v) > 0) || "El país es obligatorio",
                })}
                fullWidth
                margin="normal"
                error={!!errors.pais}
                helperText={errors.pais?.message as string}
            >
                <MenuItem value={0} disabled>
                    Selecciona un país
                </MenuItem>
                {paises.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                        {p.nombre}
                    </MenuItem>
                ))}
            </TextField>

            {/* Productos Objetivo (multi-select) */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Productos objetivo</InputLabel>
                <Controller
                    name="productos_objetivo"
                    control={control}
                    rules={{ required: "Debe seleccionar al menos un producto" }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            multiple
                            input={<OutlinedInput label="Productos objetivo" />}
                            renderValue={(selected) => (selected as number[]).map(id => productos.find(p => p.id === id)?.nombre || id).join(", ")}
                        >
                            {productos.map((p) => (
                                <MenuItem key={p.id} value={p.id}>
                                    <Checkbox checked={(field.value as number[]).includes(p.id)} />
                                    <ListItemText primary={p.nombre} />
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
                {errors.productos_objetivo && (
                    <span style={{ color: "red", fontSize: "0.8rem" }}>
                        {errors.productos_objetivo.message as string}
                    </span>
                )}
            </FormControl>

            {/* Meta monetaria */}
            <Controller
                name="meta_monetaria_usd"
                control={control}
                rules={{
                    validate: (value) => Number(value) > 0 || "Debe ser un valor mayor a 0",
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Meta monetaria (USD)"
                        fullWidth
                        margin="normal"
                        type="number"
                        inputProps={{ step: "0.01", min: "0" }}
                        error={!!errors.meta_monetaria_usd}
                        helperText={errors.meta_monetaria_usd?.message as string}
                        onChange={(e) => {
                            const raw = e.target.value;
                            // Si está vacío, tratamos como 0 para mantener tipo numérico
                            field.onChange(raw === "" ? 0 : Number(raw));
                        }}
                        onBlur={(e) => {
                            // Redondear a 2 decimales manteniendo valor numérico
                            const num = Number(e.target.value);
                            if (!Number.isNaN(num)) {
                                const rounded = Math.round(num * 100) / 100;
                                field.onChange(rounded);
                            }
                            field.onBlur();
                        }}
                    />
                )}
            />

            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                color="primary"
            >
                Guardar
            </Button>
        </Box>
    );
}
