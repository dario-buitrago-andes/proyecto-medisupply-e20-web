import { useState } from "react";
import { Button, Box } from "@mui/material";
import { ProductoService } from "../../services/productosService";

export default function CargaMasiva() {
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = async () => {
        if (!file) return;
        await ProductoService.cargaMasiva(file);
        alert("Carga masiva procesada");
    };

    return (
        <Box sx={{ textAlign: "center", mt: 4 }}>
            <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <Button onClick={handleUpload} variant="contained" sx={{ mt: 2 }}>Subir archivo</Button>
        </Box>
    );
}
