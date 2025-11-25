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
    Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { PlanVentaService } from "../../services/planesVentaService";
import { useEffect, useState } from "react";
import { PaisesService, Pais } from "../../services/paisesService";
import { VendedorService } from "../../services/vendedoresService";
import { ProductoService } from "../../services/productosService";
import { useNotify } from "../../components/NotificationProvider";
import { getApiErrorMessage } from "../../utils/apiError";

const periodos = ["Q1", "Q2", "Q3", "Q4"];

type VendedorItem = { id: number; nombre: string; estado: string };
type ProductoItem = { id: number; nombre_producto: string };




export default function PlanVentaForm() {
    const { t } = useTranslation();
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
            vendedor_id: 0,
            periodo: "",
            anio: new Date().getFullYear(),
            pais: 0,
            productos_objetivo: [] as number[],
            meta_monetaria_usd: 0,
        },
    });

    const onSubmit = async (data: any) => {
        if (Number(data.meta_monetaria_usd) <= 0) {
            notify(t('salesPlans:validation.goalGreaterThanZero'), "warning");
            return;
        }
        try {
            await PlanVentaService.crear(data);
            notify(t('salesPlans:messages.createSuccess'), "success");
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
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                {t('salesPlans:create')}
            </Typography>
            {/* Vendedor */}
            <TextField
                select
                label={t('salesPlans:fields.seller')}
                {...register("vendedor_id", {
                    valueAsNumber: true,
                    validate: (v) => (Number(v) > 0) || t('salesPlans:validation.sellerRequired'),
                })}
                fullWidth
                margin="normal"
                error={!!errors.vendedor_id}
                helperText={errors.vendedor_id?.message as string}
            >
                <MenuItem value={0} disabled>
                    {t('salesPlans:placeholders.selectSeller')}
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
                label={t('salesPlans:fields.period')}
                {...register("periodo", {
                    required: t('salesPlans:validation.periodRequired'),
                    validate: (val) => (val && periodos.includes(val)) || t('salesPlans:validation.periodInvalid'),
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
                label={t('salesPlans:fields.year')}
                type="number"
                {...register("anio", {
                    required: t('salesPlans:validation.yearRequired'),
                    validate: (value) => {
                        const year = Number(value);
                        if (!Number.isInteger(year)) return t('salesPlans:validation.yearMustBeNumeric');
                        if (String(year).length !== 4) return t('salesPlans:validation.yearMust4Digits');
                        if (year < 1900 || year > 2100) return t('salesPlans:validation.yearOutOfRange');
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
                label={t('salesPlans:fields.country')}
                {...register("pais", {
                    valueAsNumber: true,
                    validate: (v) => (Number(v) > 0) || t('salesPlans:validation.countryRequired'),
                })}
                fullWidth
                margin="normal"
                error={!!errors.pais}
                helperText={errors.pais?.message as string}
            >
                <MenuItem value={0} disabled>
                    {t('salesPlans:placeholders.selectCountry')}
                </MenuItem>
                {paises.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                        {p.nombre}
                    </MenuItem>
                ))}
            </TextField>

            {/* Productos Objetivo (multi-select) */}
            <FormControl fullWidth margin="normal">
                <InputLabel>{t('salesPlans:fields.targetProducts')}</InputLabel>
                <Controller
                    name="productos_objetivo"
                    control={control}
                    rules={{ required: t('salesPlans:validation.productsRequired') }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            multiple
                            input={<OutlinedInput label={t('salesPlans:fields.targetProducts')} />}
                            renderValue={(selected) => (selected as number[]).map(id => productos.find(p => p.id === id)?.nombre_producto || id).join(", ")}
                        >
                            {productos.map((p) => (
                                <MenuItem key={p.id} value={p.id}>
                                    <Checkbox checked={(field.value as number[]).includes(p.id)} />
                                    <ListItemText primary={p.nombre_producto} />
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
                    validate: (value) => Number(value) > 0 || t('salesPlans:validation.goalMustBePositive'),
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label={t('salesPlans:fields.monetaryGoal')}
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
                {t('actions.save')}
            </Button>
        </Box>
    );
}
