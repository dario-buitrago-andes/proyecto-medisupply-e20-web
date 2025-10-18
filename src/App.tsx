import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "./components/NavBar";
import AppRoutes from "./routes/AppRoutes";
import { NotificationProvider } from "./components/NotificationProvider";

function App() {
    return (
        <NotificationProvider>
            <Router>
                <NavBar />
                <AppRoutes />
            </Router>
        </NotificationProvider>
    );
}

export default App;