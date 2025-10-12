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

const periodos = ["Q1", "Q2", "Q3", "Q4"];
const paises = ["Colombia", "Perú", "Ecuador", "México"];
const vendedores = ["James Rodriguez", "Luis Diaz", "David Ospina"];
const productos = [
    "Guantes quirúrgicos",
    "Mascarillas N95",
    "Reactivos de laboratorio",
    "Vacunas COVID-19",
    "Sueros fisiológicos",
];

export default function PlanVentaForm() {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            vendedor: "",
            periodo: "",
            anio: new Date().getFullYear(),
            pais: "",
            productos_objetivo: [],
            meta_monetaria_usd: "",
        },
    });

    const onSubmit = async (data: any) => {
        if (Number(data.meta_monetaria_usd) <= 0) {
            alert("La meta monetaria debe ser mayor a 0");
            return;
        }
        await PlanVentaService.crear(data);
        alert("✅ Plan de venta creado correctamente");
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
                {...register("vendedor", { required: "El vendedor es obligatorio" })}
                fullWidth
                margin="normal"
                error={!!errors.vendedor}
                helperText={errors.vendedor?.message as string}
            >
                {vendedores.map((p) => (
                    <MenuItem key={p} value={p}>
                        {p}
                    </MenuItem>
                ))}
            </TextField>

            {/* Periodo */}
            <TextField
                select
                label="Periodo"
                {...register("periodo", { required: "El periodo es obligatorio" })}
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
                    validate: (value) => String(value).length === 4 || "Debe tener 4 dígitos",
                })}
                fullWidth
                margin="normal"
                error={!!errors.anio}
                helperText={errors.anio?.message as string}
            />

            {/* País */}
            <TextField
                select
                label="País"
                {...register("pais", { required: "El país es obligatorio" })}
                fullWidth
                margin="normal"
                error={!!errors.pais}
                helperText={errors.pais?.message as string}
            >
                {paises.map((p) => (
                    <MenuItem key={p} value={p}>
                        {p}
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
                            renderValue={(selected) => (selected as string[]).join(", ")}
                        >
                            {productos.map((p) => (
                                <MenuItem key={p} value={p}>
                                    <Checkbox checked={(field.value as string[]).includes(p)} />
                                    <ListItemText primary={p} />
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
                    validate: (value) =>
                        !value || Number(value) > 0 || "Debe ser un valor mayor a 0",
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
                            // Formato dinámico: redondear a 2 decimales
                            const val = e.target.value;
                            field.onChange(val ? parseFloat(val).toFixed(2) : "");
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
