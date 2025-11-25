import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {TextField, Button, Box, Checkbox, FormControlLabel, FormLabel, Typography} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ProveedorService } from "../../services/proveedoresService";
import { CategoriasSuministrosService, CategoriaSuministro } from "../../services/categoriasSuministrosService";
import { PaisesService, Pais } from "../../services/paisesService";
import { CertificacionesService, Certificacion } from "../../services/certificacionesService";
import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../../utils/apiError";
import { useNotify } from "../../components/NotificationProvider";

type ProveedorFormValues = {
    razon_social: string;
    paises_operacion: number[];
    categorias_suministradas: number[];
    capacidad_cadena_frio: string[];
    certificaciones_sanitarias: number[];
};

const opcionesCadenaFrio = ["2-8°C", "-20°C", "-80°C", "Ambiente"];

const schema: yup.ObjectSchema<ProveedorFormValues> = yup
  .object({
    razon_social: yup.string().trim().required("Razón social obligatoria"),
    paises_operacion: yup
      .array()
      .of(yup.number().required())
      .default([])
      .required()
      .min(1, "Seleccione al menos un país"),
      categorias_suministradas: yup
      .array()
      .of(yup.number().required())
      .default([])
      .required(),
    capacidad_cadena_frio: yup
      .array()
      .of(yup.string().required())
      .default([])
      .required(),
    certificaciones_sanitarias: yup
      .array()
      .of(yup.number().required())
      .default([])
      .required()
      .min(1, "Seleccione al menos una certificación"),
  })
  .required();

export default function ProveedorForm() {
    const { t } = useTranslation();
    const { notify } = useNotify();
    const { control, handleSubmit, formState: { errors } } = useForm<ProveedorFormValues>({
        resolver: yupResolver(schema),
        defaultValues: { razon_social: "", paises_operacion: [], categorias_suministradas: [], capacidad_cadena_frio: [], certificaciones_sanitarias: [] },
    });
    
    const [paises, setPaises] = useState<Pais[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [categorias, setCategorias] = useState<CategoriaSuministro[]>([]);
    const [loadingCategorias, setLoadingCategorias] = useState(true);
    const [errorCategorias, setErrorCategorias] = useState<string | null>(null);
    const [certificaciones, setCertificaciones] = useState<Certificacion[]>([]);
    const [loadingCertificaciones, setLoadingCertificaciones] = useState(true);
    const [errorCertificaciones, setErrorCertificaciones] = useState<string | null>(null);

    useEffect(() => {
        const cargarPaises = async () => {
            try {
                const response = await PaisesService.listar();
                setPaises(response.data);
            } catch (err) {
                const msg = getApiErrorMessage(err);
                notify(msg, "error");
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        cargarPaises();
    }, [notify]);

    useEffect(() => {
        const cargarCategorias = async () => {
            try {
                const response = await CategoriasSuministrosService.listar();
                setCategorias(response.data);
            } catch (err) {
                const msg = getApiErrorMessage(err);
                notify(msg, "error");
                setErrorCategorias(msg);
            } finally {
                setLoadingCategorias(false);
            }
        };

        cargarCategorias();
    }, [notify]);

    useEffect(() => {
        const cargarCertificaciones = async () => {
            try {
                const response = await CertificacionesService.listar();
                setCertificaciones(response.data);
            } catch (err) {
                const msg = getApiErrorMessage(err);
                notify(msg, "error");
                setErrorCertificaciones(msg);
            } finally {
                setLoadingCertificaciones(false);
            }
        };

        cargarCertificaciones();
    }, [notify]);

    if (loading || loadingCategorias || loadingCertificaciones) return <div>{t('common:messages.loading')}</div>;
    if (error || errorCategorias || errorCertificaciones) return <div>{error || errorCategorias || errorCertificaciones}</div>;

    const onSubmit = async (data: any) => {
        try {
            await ProveedorService.crear(data);
            notify(t('vendors:messages.createSuccess'), "success");
        } catch (err) {
            const msg = getApiErrorMessage(err);
            notify(msg, "error");
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 500, m: "auto" }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
                {t('vendors:create')}
            </Typography>

            <Controller
                name="razon_social"
                control={control}
                render={({ field }) => (
                    <TextField {...field} label={t('vendors:fields.name')} fullWidth margin="normal"
                               error={!!errors.razon_social} helperText={errors.razon_social?.message} />
                )}
            />

            <FormLabel sx={{ mt: 2 }}>{t('vendors:fields.country')}</FormLabel>
            <Controller
                name="paises_operacion"
                control={control}
                render={({ field }) => (
                    <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
                        {paises.map((p) => (
                            <FormControlLabel
                                key={p.id}
                                control={
                                    <Checkbox
                                        checked={(field.value as number[]).includes(p.id)}
                                        onChange={(e) => {
                                            const current = (field.value as number[]) || [];
                                            const newValue = e.target.checked
                                                ? [...current, p.id]
                                                : current.filter((x: number) => x !== p.id);
                                            field.onChange(newValue);
                                        }}
                                    />
                                }
                                label={p.nombre}
                            />
                        ))}
                        {errors.paises_operacion && <p style={{ color: "red" }}>{errors.paises_operacion.message}</p>}
                    </Box>
                )}
            />

            <FormLabel sx={{ mt: 2 }}>{t('vendors:fields.certifications')}</FormLabel>
            <Controller
                name="certificaciones_sanitarias"
                control={control}
                render={({ field }) => (
                    <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
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
                        {errors.certificaciones_sanitarias && <p style={{ color: "red" }}>{errors.certificaciones_sanitarias.message}</p>}
                    </Box>
                )}
            />

            <FormLabel sx={{ mt: 2 }}>{t('vendors:fields.categories')}</FormLabel>
            <Controller
                name="categorias_suministradas"
                control={control}
                render={({ field }) => (
                    <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
                        {categorias.map((c) => (
                            <FormControlLabel
                                key={c.id}
                                control={
                                    <Checkbox
                                        checked={(field.value as number[])?.includes(c.id) || false}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            const current = (field.value as number[]) || [];
                                            const newValue = checked
                                                ? [...current, c.id]
                                                : current.filter((v: number) => v !== c.id);
                                            field.onChange(newValue);
                                        }}
                                    />
                                }
                                label={c.nombre}
                            />
                        ))}
                    </Box>
                )}
            />

            <FormLabel sx={{ mt: 2 }}>{t('vendors:fields.coldChain')}</FormLabel>
            <Controller
                name="capacidad_cadena_frio"
                control={control}
                render={({ field }) => (
                    <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
                        {opcionesCadenaFrio.map((opt) => (
                            <FormControlLabel
                                key={opt}
                                control={
                                    <Checkbox
                                        checked={(field.value as string[])?.includes(opt) || false}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            const current = (field.value as string[]) || [];
                                            const newValue = checked
                                                ? [...current, opt]
                                                : current.filter((v: string) => v !== opt);
                                            field.onChange(newValue);
                                        }}
                                    />
                                }
                                label={opt}
                            />
                        ))}
                    </Box>
                )}
            />

            <Button type="submit" variant="contained">{t('common:actions.save')}</Button>
        </Box>
    );
}
