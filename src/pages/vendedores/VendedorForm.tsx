import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, TextField, Button, MenuItem, FormLabel, Typography, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import { PaisesService, Pais } from "../../services/paisesService";
import { VendedorService } from "../../services/vendedoresService";
import { useNotify } from "../../components/NotificationProvider";
import { getApiErrorMessage } from "../../utils/apiError";

type VendedorFormValues = {
  nombre: string;
  email: string;
  pais: number;
  estado: "ACTIVO" | "INACTIVO";
};

export default function VendedorForm() {
  const { t } = useTranslation();
  const { notify } = useNotify();
  
  const schema: yup.ObjectSchema<VendedorFormValues> = yup
    .object({
      nombre: yup
        .string()
        .matches(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/, t('vendors:sellers.validation.nameOnlyLetters'))
        .trim()
        .required(t('vendors:sellers.validation.nameRequired')),
      email: yup
        .string()
        .email(t('vendors:sellers.validation.emailInvalid'))
        .required(t('vendors:sellers.validation.emailRequired')),
      pais: yup
        .number()
        .typeError(t('vendors:sellers.validation.selectCountry'))
        .required(t('vendors:sellers.validation.countryRequired')),
      estado: yup
        .mixed<"ACTIVO" | "INACTIVO">()
        .oneOf(["ACTIVO", "INACTIVO"], t('vendors:sellers.validation.statusInvalid'))
        .required(t('vendors:sellers.validation.statusRequired')),
    })
    .required();
  const { control, handleSubmit, formState: { errors } } = useForm<VendedorFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      email: "",
      pais: 0,
      estado: "ACTIVO",
    },
  });

  const [paises, setPaises] = useState<Pais[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const cargarPaises = async () => {
      try {
        const resp = await PaisesService.listar();
        setPaises(resp.data);
        setApiError(null);
      } catch (e) {
        const errorMsg = getApiErrorMessage(e);
        setApiError(errorMsg);
        // No bloquear el formulario, solo mostrar advertencia
        notify(t('vendors:sellers.messages.errorLoadingCountries'), "warning");
      } finally {
        setLoading(false);
      }
    };
    cargarPaises();
  }, [notify, t]);

  const onSubmit = async (data: VendedorFormValues) => {
    try {
      await VendedorService.crear(data);
      notify(t('vendors:sellers.messages.createSuccess'), "success");
    } catch (e) {
      notify(getApiErrorMessage(e), "error");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 500, m: "auto" }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
            {t('vendors:sellers.create')}
        </Typography>

        {apiError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {t('vendors:sellers.messages.errorLoadingCountries')}
          </Alert>
        )}

        <FormLabel sx={{ mt: 2 }}>{t('vendors:sellers.fields.fullName')}</FormLabel>
      <Controller
        name="nombre"
        control={control}
        render={({ field }) => (
          <TextField {...field} fullWidth margin="normal" error={!!errors.nombre} helperText={errors.nombre?.message} />
        )}
      />

      <FormLabel sx={{ mt: 2 }}>{t('vendors:sellers.fields.corporateEmail')}</FormLabel>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField {...field} type="email" fullWidth margin="normal" error={!!errors.email} helperText={errors.email?.message} />
        )}
      />

      <FormLabel sx={{ mt: 2 }}>{t('vendors:sellers.fields.assignedCountry')}</FormLabel>
      <Controller
        name="pais"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            select
            fullWidth
            margin="normal"
            error={!!errors.pais}
            helperText={errors.pais?.message}
            value={field.value || ""}
            onChange={(e) => field.onChange(Number(e.target.value))}
            disabled={loading}
          >
            {loading && <MenuItem disabled>{t('vendors:sellers.messages.loadingCountries')}</MenuItem>}
            {!loading && paises.length === 0 && <MenuItem disabled>{t('vendors:sellers.validation.selectCountry')}</MenuItem>}
            {paises.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
            ))}
          </TextField>
        )}
      />

      <FormLabel sx={{ mt: 2 }}>{t('vendors:sellers.fields.status')}</FormLabel>
      <Controller
        name="estado"
        control={control}
        render={({ field }) => (
          <TextField {...field} select fullWidth margin="normal" error={!!errors.estado} helperText={errors.estado?.message}>
            <MenuItem value="ACTIVO">{t('vendors:status.active')}</MenuItem>
            <MenuItem value="INACTIVO">{t('vendors:status.inactive')}</MenuItem>
          </TextField>
        )}
      />

      <Button type="submit" variant="contained" sx={{ mt: 2 }}>{t('common:actions.save')}</Button>
    </Box>
  );
}

