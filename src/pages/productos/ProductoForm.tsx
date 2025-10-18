import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
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
    CircularProgress,
} from "@mui/material";
import { ProductoService } from "../../services/productosService";
import { CertificacionesService, Certificacion } from "../../services/certificacionesService";
import { ProveedorService } from "../../services/proveedoresService";
import { useNotify } from "../../components/NotificationProvider";
import { getApiErrorMessage } from "../../utils/apiError";

interface ProveedorItem {
    id: number;
    nombre: string;
}

// Las certificaciones ahora se cargarán desde el servicio CertificacionesService

export type ProductoFormData = {
    proveedor: number;            // ID del proveedor
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
    certificaciones: number[];     // IDs de certificaciones sanitarias
    tiempo_entrega_dias: number;   // Entero >= 0
};

export default function ProductoForm() {
    const { notify } = useNotify();
    // Estado y carga de certificaciones desde el API
    const [certificaciones, setCertificaciones] = useState<Certificacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estado y carga de proveedores desde el API
    const [proveedores, setProveedores] = useState<ProveedorItem[]>([]);
    const [loadingProveedores, setLoadingProveedores] = useState(true);
    const [errorProveedores, setErrorProveedores] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch,
        setValue,
    } = useForm<ProductoFormData>({
        defaultValues: {
            proveedor: 0,
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

    useEffect(() => {
        const cargarCertificaciones = async () => {
            try {
                const resp = await CertificacionesService.listar();
                setCertificaciones(resp.data);
            } catch (e) {
                const msg = getApiErrorMessage(e);
                notify(msg, "error");
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        cargarCertificaciones();
    }, [notify]);

    useEffect(() => {
        const cargarProveedores = async () => {
            try {
                const resp = await ProveedorService.listar();
                setProveedores(resp.data);
            } catch (e) {
                const msg = getApiErrorMessage(e);
                notify(msg, "error");
                setErrorProveedores(msg);
            } finally {
                setLoadingProveedores(false);
            }
        };
        cargarProveedores();
    }, [notify]);

    if (loading || loadingProveedores) return <CircularProgress />;
    if (error || errorProveedores) return <div>{error || errorProveedores}</div>;

    const onSubmit = async (data: any) => {
        try {
            await ProductoService.crear(data);
            notify("Producto creado", "success");
        } catch (e) {
            const msg = getApiErrorMessage(e);
            notify(msg, "error");
        }
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
                {...register("proveedor", { required: "El proveedor es obligatorio", valueAsNumber: true })}
                fullWidth
                margin="normal"
                error={!!errors.proveedor}
                helperText={errors.proveedor?.message as string}
            >
                {proveedores.map((prov) => (
                    <MenuItem key={prov.id} value={prov.id}>
                        {prov.nombre}
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
                                key={cert.id}
                                control={
                                    <Checkbox
                                        checked={(field.value as number[])?.includes(cert.id) || false}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            const current = (field.value as number[]) || [];
                                            const newValue = checked
                                                ? [...current, cert.id]
                                                : current.filter((v: number) => v !== cert.id);
                                            field.onChange(newValue);
                                        }}
                                    />
                                }
                                label={cert.codigo}
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

