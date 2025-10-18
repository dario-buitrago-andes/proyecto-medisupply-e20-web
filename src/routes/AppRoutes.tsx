import { Routes, Route } from "react-router-dom";
import VendedorForm from "../pages/vendedores/VendedorForm";
import ProveedorForm from "../pages/proveedores/ProveedorForm";
import ProductoForm from "../pages/productos/ProductoForm";
import CargaMasiva from "../pages/productos/CargaMasiva";
import PlanVentaForm from "../pages/planes_venta/PlanVentaForm";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/vendedores" element={<VendedorForm />} />
            <Route path="/proveedores" element={<ProveedorForm />} />
            <Route path="/productos" element={<ProductoForm />} />
            <Route path="/productos/carga_masiva" element={<CargaMasiva />} />
            <Route path="/planes_venta" element={<PlanVentaForm />} />
            <Route path="*" element={<h3>404 - Página no encontrada</h3>} />
        </Routes>
    );
}