import { useState } from "react";
import { Button, Box } from "@mui/material";
import { ProductoService } from "../../services/productosService";
import { useNotify } from "../../components/NotificationProvider";
import { getApiErrorMessage } from "../../utils/apiError";

export default function CargaMasiva() {
    const [file, setFile] = useState<File | null>(null);
    const { notify } = useNotify();

    const handleUpload = async () => {
        if (!file) return;
        try {
            await ProductoService.cargaMasiva(file);
            notify("Carga masiva procesada", "success");
        } catch (e) {
            notify(getApiErrorMessage(e), "error");
        }
    };

    return (
        <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
                variant="outlined"
                component="label"
                sx={{ mb: 2 }}
            >
                Seleccionar archivo CSV
                <input
                    type="file"
                    hidden
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
            </Button>
            <br />
            <Button onClick={handleUpload} variant="contained" disabled={!file}>Subir archivo</Button>
        </Box>
    );
}
