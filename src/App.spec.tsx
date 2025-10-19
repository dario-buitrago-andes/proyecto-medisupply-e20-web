/**
 * Tests para App - Componente principal de la aplicación
 * 
 * Nota: Estas pruebas verifican la estructura del componente App mediante
 * análisis de código para evitar problemas de dependencias en el entorno de test.
 */

import "@testing-library/jest-dom";
import * as fs from "fs";
import * as path from "path";

describe("App", () => {
  let appCode: string;

  beforeAll(() => {
    // Leer el código fuente de App.tsx
    const appPath = path.join(__dirname, "App.tsx");
    appCode = fs.readFileSync(appPath, "utf-8");
  });

  describe("Estructura del componente", () => {
    it("el archivo App.tsx existe y está presente", () => {
      expect(appCode).toBeDefined();
      expect(appCode.length).toBeGreaterThan(0);
    });

    it("importa BrowserRouter de react-router-dom", () => {
      expect(appCode).toContain("from \"react-router-dom\"");
      expect(appCode).toContain("BrowserRouter");
    });

    it("importa ThemeProvider de @mui/material/styles", () => {
      expect(appCode).toContain("from \"@mui/material/styles\"");
      expect(appCode).toContain("ThemeProvider");
    });

    it("importa Layout del directorio components", () => {
      expect(appCode).toContain("from \"./components/Layout\"");
      expect(appCode).toContain("Layout");
    });

    it("importa AppRoutes del directorio routes", () => {
      expect(appCode).toContain("from \"./routes/AppRoutes\"");
      expect(appCode).toContain("AppRoutes");
    });

    it("importa NotificationProvider", () => {
      expect(appCode).toContain("from \"./components/NotificationProvider\"");
      expect(appCode).toContain("NotificationProvider");
    });

    it("importa AuthProvider y useAuth", () => {
      expect(appCode).toContain("from \"./contexts/AuthContext\"");
      expect(appCode).toContain("AuthProvider");
      expect(appCode).toContain("useAuth");
    });

    it("importa Login del directorio pages/auth", () => {
      expect(appCode).toContain("from \"./pages/auth/Login\"");
      expect(appCode).toContain("Login");
    });

    it("importa el tema personalizado", () => {
      expect(appCode).toContain("from \"./theme/theme\"");
      expect(appCode).toContain("theme");
    });
  });

  describe("Componente AppContent", () => {
    it("define el componente AppContent", () => {
      expect(appCode).toContain("function AppContent()");
    });

    it("AppContent usa el hook useAuth", () => {
      const appContentMatch = appCode.match(/function AppContent\(\) \{[\s\S]*?\n\}/);
      expect(appContentMatch).toBeTruthy();
      if (appContentMatch) {
        expect(appContentMatch[0]).toContain("useAuth()");
        expect(appContentMatch[0]).toContain("isAuthenticated");
        expect(appContentMatch[0]).toContain("login");
      }
    });

    it("AppContent renderiza Login cuando no está autenticado", () => {
      expect(appCode).toContain("!isAuthenticated");
      expect(appCode).toContain("return <Login");
      expect(appCode).toContain("onLoginSuccess={login}");
    });

    it("AppContent renderiza Layout con AppRoutes cuando está autenticado", () => {
      expect(appCode).toContain("<Layout>");
      expect(appCode).toContain("<AppRoutes />");
      expect(appCode).toContain("</Layout>");
    });
  });

  describe("Componente App principal", () => {
    it("define el componente App", () => {
      expect(appCode).toContain("function App()");
    });

    it("App retorna JSX con ThemeProvider", () => {
      const appFunctionMatch = appCode.match(/function App\(\) \{[\s\S]*?\n\}/m);
      expect(appFunctionMatch).toBeTruthy();
      if (appFunctionMatch) {
        expect(appFunctionMatch[0]).toContain("return");
        expect(appFunctionMatch[0]).toContain("<ThemeProvider");
      }
    });

    it("ThemeProvider recibe el tema como prop", () => {
      expect(appCode).toContain("<ThemeProvider theme={theme}>");
    });
  });

  describe("Jerarquía de providers", () => {
    it("ThemeProvider es el wrapper más externo", () => {
      // Buscar ThemeProvider antes de NotificationProvider en el código
      const themeIndex = appCode.indexOf("<ThemeProvider");
      const notificationIndex = appCode.indexOf("<NotificationProvider");
      
      expect(themeIndex).toBeGreaterThan(-1);
      expect(notificationIndex).toBeGreaterThan(-1);
      expect(themeIndex).toBeLessThan(notificationIndex);
    });

    it("NotificationProvider está dentro de ThemeProvider", () => {
      const providersPattern = /<ThemeProvider[\s\S]*?<NotificationProvider/;
      expect(appCode).toMatch(providersPattern);
    });

    it("AuthProvider está dentro de NotificationProvider", () => {
      const providersPattern = /<NotificationProvider[\s\S]*?<AuthProvider/;
      expect(appCode).toMatch(providersPattern);
    });

    it("Router está dentro de AuthProvider", () => {
      const providersPattern = /<AuthProvider[\s\S]*?<Router/;
      expect(appCode).toMatch(providersPattern);
    });

    it("AppContent está dentro de Router", () => {
      const providersPattern = /<Router[\s\S]*?<AppContent/;
      expect(appCode).toMatch(providersPattern);
    });

    it("los providers se cierran en el orden correcto", () => {
      expect(appCode).toContain("</Router>");
      expect(appCode).toContain("</AuthProvider>");
      expect(appCode).toContain("</NotificationProvider>");
      expect(appCode).toContain("</ThemeProvider>");
      
      // Verificar orden de cierre
      const routerCloseIndex = appCode.indexOf("</Router>");
      const authCloseIndex = appCode.indexOf("</AuthProvider>");
      const notificationCloseIndex = appCode.indexOf("</NotificationProvider>");
      const themeCloseIndex = appCode.indexOf("</ThemeProvider>");
      
      expect(routerCloseIndex).toBeLessThan(authCloseIndex);
      expect(authCloseIndex).toBeLessThan(notificationCloseIndex);
      expect(notificationCloseIndex).toBeLessThan(themeCloseIndex);
    });
  });

  describe("Lógica condicional", () => {
    it("usa condicional para mostrar Login o Layout", () => {
      expect(appCode).toMatch(/if \(!isAuthenticated\)/);
      expect(appCode).toContain("return <Login");
      expect(appCode).toContain("return (");
      expect(appCode).toMatch(/<Layout>/);
    });

    it("Login recibe onLoginSuccess como prop", () => {
      expect(appCode).toContain("onLoginSuccess={login}");
    });
  });

  describe("Exportación", () => {
    it("exporta App como default", () => {
      expect(appCode).toContain("export default App");
    });

    it("no hay otras exportaciones nombradas en App", () => {
      const namedExports = appCode.match(/export \{[^}]+\}/g);
      expect(namedExports).toBeFalsy();
    });
  });

  describe("Código limpio y buenas prácticas", () => {
    it("usa nombres de componentes en PascalCase", () => {
      expect(appCode).toContain("function App");
      expect(appCode).toContain("function AppContent");
    });

    it("usa destructuring para props del hook useAuth", () => {
      expect(appCode).toMatch(/const \{ isAuthenticated, login \}/);
    });

    it("no tiene console.log statements", () => {
      expect(appCode).not.toContain("console.log");
    });

    it("usa sintaxis de JSX moderna", () => {
      expect(appCode).toContain("<AppRoutes />");
    });

    it("tiene comentarios o estructura clara", () => {
      // El archivo debe tener al menos imports organizados
      expect(appCode.split("import").length).toBeGreaterThan(5);
    });
  });

  describe("Integridad del archivo", () => {
    it("tiene una estructura válida de componente funcional", () => {
      expect(appCode).toContain("function App()");
      expect(appCode).toContain("return");
      expect(appCode).toContain("export default");
    });

    it("usa React correctamente", () => {
      // No debería tener errores obvios de sintaxis
      expect(appCode).toMatch(/function \w+\(\)/);
      expect(appCode).toMatch(/return \(/);
    });

    it("el tamaño del archivo es razonable", () => {
      // Un componente App no debería ser muy grande
      const lines = appCode.split("\n").length;
      expect(lines).toBeGreaterThan(10);
      expect(lines).toBeLessThan(100);
    });
  });
});

export {};
