import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {Box, TextField, Button, MenuItem, FormLabel, Typography} from "@mui/material";
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

const schema: yup.ObjectSchema<VendedorFormValues> = yup
  .object({
    nombre: yup
      .string()
      .matches(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/, "Solo letras y espacios")
      .trim()
      .required("Nombre completo obligatorio"),
    email: yup
      .string()
      .email("Email inválido")
      .required("Email corporativo obligatorio"),
    pais: yup
      .number()
      .typeError("Seleccione un país")
      .required("País obligatorio"),
    estado: yup
      .mixed<"ACTIVO" | "INACTIVO">()
      .oneOf(["ACTIVO", "INACTIVO"], "Estado inválido")
      .required("Estado obligatorio"),
  })
  .required();

export default function VendedorForm() {
  const { notify } = useNotify();
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

  useEffect(() => {
    const cargarPaises = async () => {
      try {
        const resp = await PaisesService.listar();
        setPaises(resp.data);
      } catch (e) {
        notify(getApiErrorMessage(e), "error");
      } finally {
        setLoading(false);
      }
    };
    cargarPaises();
  }, [notify]);

  const onSubmit = async (data: VendedorFormValues) => {
    try {
      await VendedorService.crear(data);
      notify("Vendedor creado", "success");
    } catch (e) {
      notify(getApiErrorMessage(e), "error");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 500, m: "auto" }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
            Registrar Vendedor
        </Typography>

        <FormLabel sx={{ mt: 2 }}>Nombre Completo</FormLabel>
      <Controller
        name="nombre"
        control={control}
        render={({ field }) => (
          <TextField {...field} fullWidth margin="normal" error={!!errors.nombre} helperText={errors.nombre?.message} />
        )}
      />

      <FormLabel sx={{ mt: 2 }}>Email corporativo</FormLabel>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField {...field} type="email" fullWidth margin="normal" error={!!errors.email} helperText={errors.email?.message} />
        )}
      />

      <FormLabel sx={{ mt: 2 }}>País asignado</FormLabel>
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
            {paises.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
            ))}
          </TextField>
        )}
      />

      <FormLabel sx={{ mt: 2 }}>Estado</FormLabel>
      <Controller
        name="estado"
        control={control}
        render={({ field }) => (
          <TextField {...field} select fullWidth margin="normal" error={!!errors.estado} helperText={errors.estado?.message}>
            <MenuItem value="ACTIVO">Activo</MenuItem>
            <MenuItem value="INACTIVO">Inactivo</MenuItem>
          </TextField>
        )}
      />

      <Button type="submit" variant="contained" sx={{ mt: 2 }}>Guardar</Button>
    </Box>
  );
}

