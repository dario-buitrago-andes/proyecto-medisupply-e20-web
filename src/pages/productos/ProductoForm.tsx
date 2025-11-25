import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
    razon_social: string;
}
export type ProductoFormData = {
    proveedor_id: number;
    nombre_producto: string;
    sku: string;
    valor_unitario_usd: number;
    ficha_tecnica_url: string;
    condiciones: {
        temperatura: string;
        humedad: string;
        luz: string;
        ventilacion: string;
        seguridad: string;
        envase: string;
    };
    organizacion: {
        tipo_medicamento: string;
        fecha_vencimiento: string;
    };
    certificaciones: number[];
    tiempo_entrega_dias: number;
};

export default function ProductoForm() {
    const { t } = useTranslation();
    const { notify } = useNotify();
    const [certificaciones, setCertificaciones] = useState<Certificacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [proveedores, setProveedores] = useState<ProveedorItem[]>([]);
    const [loadingProveedores, setLoadingProveedores] = useState(true);
    const [errorProveedores, setErrorProveedores] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ProductoFormData>({
        defaultValues: {
            proveedor_id: 0,
            nombre_producto: "",
            sku: "",
            valor_unitario_usd: 0,
            ficha_tecnica_url: "",
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
            notify(t('products:messages.createSuccess'), "success");
        } catch (e) {
            const msg = getApiErrorMessage(e);
            notify(msg, "error");
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600, m: "auto" }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                {t('products:create')}
            </Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>{t('products:sections.basicInfo')}</Typography>
            <TextField label={t('products:fields.sku')} {...register("sku")} fullWidth margin="normal" />
            <TextField label={t('products:fields.name')} {...register("nombre_producto")} fullWidth margin="normal" />
            <TextField
                select
                label={t('products:fields.vendor')}
                {...register("proveedor_id", { required: t('products:validation.providerRequired'), valueAsNumber: true })}
                fullWidth
                margin="normal"
                error={!!errors.proveedor_id}
                helperText={errors.proveedor_id?.message as string}
            >
                {proveedores.map((prov) => (
                    <MenuItem key={prov.id} value={prov.id}>
                        {prov.razon_social}
                    </MenuItem>
                ))}
            </TextField>

            <Typography variant="h6" sx={{ mt: 3 }}>{t('products:sections.technicalSheet')}</Typography>
            <TextField
                label={t('products:fields.technicalSheetUrl')}
                {...register("ficha_tecnica_url")}
                fullWidth
                margin="normal"
            />

            <Typography variant="h6" sx={{ mt: 3 }}>{t('products:sections.storageConditions')}</Typography>
            <TextField
                select
                label={t('products:fields.temperature')}
                {...register("condiciones.temperatura")}
                fullWidth
                margin="normal"
            >
                {Array.from({ length: 89 }, (_, i) => -80 + i)
                    .filter(t => t <= 8)
                    .map(temp => (
                        <MenuItem key={temp} value={String(temp)}>
                            {temp}°C
                        </MenuItem>
                    ))}
            </TextField>
            <TextField label={t('products:fields.humidity')} {...register("condiciones.humedad")} fullWidth margin="normal" />
            <TextField label={t('products:fields.light')} {...register("condiciones.luz")} fullWidth margin="normal" />
            <TextField label={t('products:fields.ventilation')} {...register("condiciones.ventilacion")} fullWidth margin="normal" />
            <TextField label={t('products:fields.security')} {...register("condiciones.seguridad")} fullWidth margin="normal" />
            <TextField label={t('products:fields.packaging')} {...register("condiciones.envase")} fullWidth margin="normal" />

            <Typography variant="h6" sx={{ mt: 3 }}>{t('products:sections.organization')}</Typography>
            <TextField
                select
                label={t('products:fields.medicineType')}
                {...register("organizacion.tipo_medicamento", { required: t('products:validation.medicineTypeRequired') })}
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
                label={t('products:fields.expirationDate')}
                type="date"
                {...register("organizacion.fecha_vencimiento")}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
            />

            <Typography variant="h6" sx={{ mt: 3 }}>{t('products:sections.valueAndCertifications')}</Typography>
            <TextField
                label={t('products:fields.unitValue')}
                type="number"
                {...register("valor_unitario_usd", {
                    required: t('products:validation.fieldRequired'),
                    min: { value: 0.01, message: "Debe ser mayor a cero" },
                })}
                fullWidth
                margin="normal"
                error={!!errors.valor_unitario_usd}
                helperText={errors.valor_unitario_usd?.message as string}
            />

            <FormLabel sx={{ mt: 2 }}>{t('products:fields.certifications')}</FormLabel>
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
                label={t('products:fields.deliveryTime')}
                type="number"
                {...register("tiempo_entrega_dias", {
                    required: t('products:validation.fieldRequired'),
                    min: { value: 0, message: t('products:validation.minValue') },
                })}
                fullWidth
                margin="normal"
                error={!!errors.tiempo_entrega_dias}
                helperText={errors.tiempo_entrega_dias?.message as string}
            />

            <Button type="submit" variant="contained" sx={{ mt: 3 }}>{t('actions.save')}</Button>
        </Box>
    );
}

