import { useState } from "react";
import { Button, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ProductoService } from "../../services/productosService";
import { useNotify } from "../../components/NotificationProvider";
import { getApiErrorMessage } from "../../utils/apiError";

export default function CargaMasiva() {
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const { notify } = useNotify();

    const handleUpload = async () => {
        if (!file) return;
        try {
            await ProductoService.cargaMasiva(file);
            notify(t('products:bulkUpload.processedSuccess'), "success");
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
                {t('products:bulkUpload.selectFile')}
                <input
                    type="file"
                    hidden
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
            </Button>
            <br />
            <Button onClick={handleUpload} variant="contained" disabled={!file}>{t('products:bulkUpload.uploadFile')}</Button>
        </Box>
    );
}
