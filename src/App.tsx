import { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CircularProgress, Box } from "@mui/material";
import Layout from "./components/Layout";
import AppRoutes from "./routes/AppRoutes";
import { NotificationProvider } from "./components/NotificationProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/auth/Login";
import theme from "./theme/theme";
import "./i18n/config";

function AppContent() {
    const { isAuthenticated, login } = useAuth();

    if (!isAuthenticated) {
        return <Login onLoginSuccess={login} />;
    }

    return (
        <Layout>
            <AppRoutes />
        </Layout>
    );
}

// Componente de carga mientras se cargan las traducciones
function LoadingFallback() {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            role="status"
            aria-live="polite"
            aria-label="Cargando aplicación"
        >
            <CircularProgress />
        </Box>
    );
}

function App() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <ThemeProvider theme={theme}>
                <NotificationProvider>
                    <AuthProvider>
                        <Router>
                            <AppContent />
                        </Router>
                    </AuthProvider>
                </NotificationProvider>
            </ThemeProvider>
        </Suspense>
    );
}

export default App;