import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Layout from "./components/Layout";
import AppRoutes from "./routes/AppRoutes";
import { NotificationProvider } from "./components/NotificationProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/auth/Login";
import theme from "./theme/theme";

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

function App() {
    return (
        <ThemeProvider theme={theme}>
            <NotificationProvider>
                <AuthProvider>
                    <Router>
                        <AppContent />
                    </Router>
                </AuthProvider>
            </NotificationProvider>
        </ThemeProvider>
    );
}

export default App;