import { useForm, Controller } from "react-hook-form";
import {
    TextField,
    Button,
    Box,
    MenuItem,
    Checkbox,
    FormGroup,
    FormControlLabel,
    FormLabel,
    Typography,
} from "@mui/material";
import { ProductoService } from "../../services/productosService";

const proveedores = ["James Rodriguez", "Luis Diaz", "David Ospina"];

const certificaciones = [
    "Registro Sanitario",
    "Certificado de Buenas Prácticas de Manufactura (BPM/GMP)",
    "Certificado de Buenas Prácticas de Laboratorio (BPL/GLP)",
    "Certificado de Buenas Prácticas de Distribución (BPD/GDP)",
    "Certificado de Análisis de Lote",
    "Certificado de Farmacovigilancia",
    "Certificado de Producto Farmacéutico (CPP)",
    "Certificado de Libre Venta",
    "Certificado de Cumplimiento Normativo",
    "Certificado de Estabilidad",
    "Certificado de Bioequivalencia/Biodisponibilidad",
    "Certificado de Origen",
];

export type ProductoFormData = {
    proveedor: string;
    nombre_producto: string;
    sku: string;
    valor_unitario_usd: number;

    ficha_tecnica_url: string;
    ficha_tecnica_pdf: File | null;

    condiciones: {
        temperatura: string;       // -80°C, -20°C, 2–8°C, Ambiente, etc.
        humedad: string;           // Descripción libre
        luz: string;               // Descripción libre
        ventilacion: string;       // Descripción libre
        seguridad: string;         // Descripción libre
        envase: string;            // Descripción libre
    };

    organizacion: {
        tipo_medicamento: string;  // Analgésico, Antibiótico, etc.
        fecha_vencimiento: string; // yyyy-mm-dd
    };

    valor_unitario: number;        // Mayor que 0
    certificaciones: string[];     // Lista de certificaciones sanitarias
    tiempo_entrega_dias: number;   // Entero >= 0
};

export default function ProductoForm() {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch,
        setValue,
    } = useForm<ProductoFormData>({
        defaultValues: {
            proveedor: "",
            nombre_producto: "",
            sku: "",
            valor_unitario_usd: 0,
            ficha_tecnica_url: "",
            ficha_tecnica_pdf: null,
            condiciones: {
                temperatura: "",
                humedad: "",
                luz: "",
                ventilacion: "",
                seguridad: "",
                envase: "",
            },
            organizacion: {
                tipo_medicamento: "",
                fecha_vencimiento: "",
            },
            valor_unitario: 0,
            certificaciones: [],
            tiempo_entrega_dias: 0,
        },
    });

    const onSubmit = async (data: any) => {
        await ProductoService.crear(data);
        alert("Producto creado");
    };

    const fichaUrl = watch("ficha_tecnica_url");
    const fichaPdf = watch("ficha_tecnica_pdf");

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600, m: "auto" }}>
            {/* --- Datos básicos --- */}
            <Typography variant="h6" sx={{ mt: 2 }}>Información básica</Typography>
            <TextField label="SKU" {...register("sku")} fullWidth margin="normal" />
            <TextField label="Nombre del producto" {...register("nombre_producto")} fullWidth margin="normal" />
            <TextField
                select
                label="Proveedor"
                {...register("proveedor", { required: "El proveedor es obligatorio" })}
                fullWidth
                margin="normal"
                error={!!errors.proveedor}
                helperText={errors.proveedor?.message as string}
            >
                {proveedores.map((p) => (
                    <MenuItem key={p} value={p}>
                        {p}
                    </MenuItem>
                ))}
            </TextField>

            {/* --- Ficha Técnica --- */}
            <Typography variant="h6" sx={{ mt: 3 }}>Ficha Técnica</Typography>
            <TextField
                label="URL de ficha técnica"
                {...register("ficha_tecnica_url")}
                fullWidth
                margin="normal"
                disabled={!!fichaPdf}
            />
            <Button
                variant="outlined"
                component="label"
                disabled={!!fichaUrl}
                sx={{ mb: 2 }}
            >
                Subir PDF
                <input
                    type="file"
                    hidden
                    accept="application/pdf"
                    onChange={(e) => setValue("ficha_tecnica_pdf", (e.target.files?.[0] as unknown as File | null) || null)}
                />
            </Button>

            {/* --- Condiciones de almacenamiento --- */}
            <Typography variant="h6" sx={{ mt: 3 }}>Condición de almacenamiento</Typography>
            <TextField
                select
                label="Temperatura de almacenamiento (°C)"
                {...register("condiciones.temperatura")}
                fullWidth
                margin="normal"
            >
                {Array.from({ length: 89 }, (_, i) => -80 + i)
                    .filter(t => t <= 8)
                    .map(temp => (
                        <MenuItem key={temp} value={temp}>
                            {temp}°C
                        </MenuItem>
                    ))}
            </TextField>
            <TextField label="Condiciones de humedad" {...register("condiciones.humedad")} fullWidth margin="normal" />
            <TextField label="Condiciones de luz" {...register("condiciones.luz")} fullWidth margin="normal" />
            <TextField label="Condiciones de ventilación" {...register("condiciones.ventilacion")} fullWidth margin="normal" />
            <TextField label="Condiciones de seguridad" {...register("condiciones.seguridad")} fullWidth margin="normal" />
            <TextField label="Condiciones del envase" {...register("condiciones.envase")} fullWidth margin="normal" />

            {/* --- Organización --- */}
            <Typography variant="h6" sx={{ mt: 3 }}>Organización</Typography>
            <TextField
                select
                label="Tipo de medicamento"
                {...register("organizacion.tipo_medicamento", { required: "Seleccione un tipo de medicamento" })}
                fullWidth
                margin="normal"
                error={!!errors.organizacion?.tipo_medicamento}
                helperText={errors.organizacion?.tipo_medicamento?.message as string}
            >
                {[
                    "Analgésicos", "Antibióticos", "Antiinflamatorios", "Antivirales", "Antifúngicos",
                    "Antipiréticos", "Antihistamínicos", "Anticonvulsivos", "Antidepresivos", "Antipsicóticos",
                    "Antidiabéticos", "Antihipertensivos", "Anticoagulantes", "Antieméticos", "Antiespasmódicos",
                    "Broncodilatadores", "Corticoides", "Diuréticos", "Inmunosupresores", "Vacunas", "Otros"
                ].map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                        {tipo}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label="Fecha de vencimiento"
                type="date"
                {...register("organizacion.fecha_vencimiento")}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
            />

            {/* --- Nueva sección: Valor, Certificaciones y Entrega --- */}
            <Typography variant="h6" sx={{ mt: 3 }}>Valor y Certificaciones</Typography>
            <TextField
                label="Valor unitario (USD)"
                type="number"
                {...register("valor_unitario", {
                    required: "El valor unitario es obligatorio",
                    min: { value: 0.01, message: "Debe ser mayor a cero" },
                })}
                fullWidth
                margin="normal"
                error={!!errors.valor_unitario}
                helperText={errors.valor_unitario?.message as string}
            />

            <FormLabel sx={{ mt: 2 }}>Certificaciones sanitarias</FormLabel>
            <Controller
                name="certificaciones"
                control={control}
                render={({ field }) => (
                    <FormGroup>
                        {certificaciones.map((cert) => (
                            <FormControlLabel
                                key={cert}
                                control={
                                    <Checkbox
                                        checked={(field.value as string[])?.includes(cert) || false}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            const newValue = checked
                                                ? [...(field.value || []), cert]
                                                : field.value.filter((v: string) => v !== cert);
                                            field.onChange(newValue);
                                        }}
                                    />
                                }
                                label={cert}
                            />
                        ))}
                    </FormGroup>
                )}
            />

            <TextField
                label="Tiempo de entrega estándar (días)"
                type="number"
                {...register("tiempo_entrega_dias", {
                    required: "Campo obligatorio",
                    min: { value: 0, message: "Debe ser mayor o igual a 0" },
                })}
                fullWidth
                margin="normal"
                error={!!errors.tiempo_entrega_dias}
                helperText={errors.tiempo_entrega_dias?.message as string}
            />

            <Button type="submit" variant="contained" sx={{ mt: 3 }}>Guardar</Button>
        </Box>
    );
}
