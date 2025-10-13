import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button color="inherit" component={Link} to="/vendedores">
                        Vendedores
                    </Button>
                    <Button color="inherit" component={Link} to="/proveedores">
                        Proveedores
                    </Button>
                    <Button color="inherit" component={Link} to="/productos">
                        Productos
                    </Button>
                    <Button color="inherit" component={Link} to="/planes_venta">
                        Planes de Venta
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}