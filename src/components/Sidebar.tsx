import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Sidebar.css";

export default function Sidebar() {
    const { logout } = useAuth();
    const location = useLocation();

    const handleLogout = () => {
        logout();
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h1 className="sidebar-title">MediSupply</h1>
                <p className="sidebar-subtitle">Sistema de Gestión</p>
            </div>

            <nav className="sidebar-nav">
                <Link 
                    to="/vendedores" 
                    className={`sidebar-link ${isActive('/vendedores') ? 'active' : ''}`}
                >
                    <span className="sidebar-icon">👤</span>
                    Vendedores
                </Link>
                
                <Link 
                    to="/proveedores" 
                    className={`sidebar-link ${isActive('/proveedores') ? 'active' : ''}`}
                >
                    <span className="sidebar-icon">🏢</span>
                    Proveedores
                </Link>
                
                <Link 
                    to="/productos" 
                    className={`sidebar-link ${isActive('/productos') ? 'active' : ''}`}
                >
                    <span className="sidebar-icon">📦</span>
                    Productos
                </Link>
                
                <Link 
                    to="/productos/carga_masiva" 
                    className={`sidebar-link ${isActive('/productos/carga_masiva') ? 'active' : ''}`}
                >
                    <span className="sidebar-icon">📤</span>
                    Carga Masiva
                </Link>
                
                <Link 
                    to="/planes_venta" 
                    className={`sidebar-link ${isActive('/planes_venta') ? 'active' : ''}`}
                >
                    <span className="sidebar-icon">📊</span>
                    Planes de Venta
                </Link>
                
                <Link 
                    to="/reportes" 
                    className={`sidebar-link ${isActive('/reportes') ? 'active' : ''}`}
                >
                    <span className="sidebar-icon">📈</span>
                    Reportes de Ventas
                </Link>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-button">
                    <span className="sidebar-icon">🚪</span>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}
