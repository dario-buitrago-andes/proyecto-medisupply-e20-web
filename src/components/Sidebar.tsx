import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import "./Sidebar.css";

export default function Sidebar() {
    const { logout } = useAuth();
    const location = useLocation();
    const { t } = useTranslation();

    const handleLogout = () => {
        logout();
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="sidebar" role="navigation" aria-label={t('accessibility.navigation')}>
            <div className="sidebar-header">
                <h1 className="sidebar-title">{t('app.title')}</h1>
                <p className="sidebar-subtitle">Sistema de Gestión</p>
                <div style={{ marginTop: '0.5rem' }}>
                    <LanguageSwitcher />
                </div>
            </div>

            <nav className="sidebar-nav">
                <Link 
                    to="/vendedores" 
                    className={`sidebar-link ${isActive('/vendedores') ? 'active' : ''}`}
                    aria-current={isActive('/vendedores') ? 'page' : undefined}
                >
                    <span className="sidebar-icon" aria-hidden="true">👤</span>
                    {t('navigation.vendors')}
                </Link>
                
                <Link 
                    to="/proveedores" 
                    className={`sidebar-link ${isActive('/proveedores') ? 'active' : ''}`}
                    aria-current={isActive('/proveedores') ? 'page' : undefined}
                >
                    <span className="sidebar-icon" aria-hidden="true">🏢</span>
                    {t('navigation.suppliers')}
                </Link>
                
                <Link 
                    to="/productos" 
                    className={`sidebar-link ${isActive('/productos') ? 'active' : ''}`}
                    aria-current={isActive('/productos') ? 'page' : undefined}
                >
                    <span className="sidebar-icon" aria-hidden="true">📦</span>
                    {t('navigation.products')}
                </Link>
                
                <Link 
                    to="/productos/carga_masiva" 
                    className={`sidebar-link ${isActive('/productos/carga_masiva') ? 'active' : ''}`}
                    aria-current={isActive('/productos/carga_masiva') ? 'page' : undefined}
                >
                    <span className="sidebar-icon" aria-hidden="true">📤</span>
                    {t('navigation.bulkUpload')}
                </Link>
                
                <Link 
                    to="/planes_venta" 
                    className={`sidebar-link ${isActive('/planes_venta') ? 'active' : ''}`}
                    aria-current={isActive('/planes_venta') ? 'page' : undefined}
                >
                    <span className="sidebar-icon" aria-hidden="true">📊</span>
                    {t('navigation.salesPlans')}
                </Link>
                
                <Link 
                    to="/reportes" 
                    className={`sidebar-link ${isActive('/reportes') ? 'active' : ''}`}
                    aria-current={isActive('/reportes') ? 'page' : undefined}
                >
                    <span className="sidebar-icon" aria-hidden="true">📈</span>
                    {t('navigation.reports')}
                </Link>
            </nav>

            <div className="sidebar-footer">
                <button 
                    onClick={handleLogout} 
                    className="logout-button"
                    aria-label={t('navigation.logout')}
                >
                    <span className="sidebar-icon" aria-hidden="true">🚪</span>
                    {t('navigation.logout')}
                </button>
            </div>
        </div>
    );
}
