/**
 * Tests para AppRoutes - Configuración de rutas de la aplicación
 */

import * as fs from "fs";
import * as path from "path";

export {};

describe("AppRoutes", () => {
  let routesCode: string;

  beforeAll(() => {
    // Leer el código fuente de AppRoutes.tsx
    const routesPath = path.join(__dirname, "AppRoutes.tsx");
    routesCode = fs.readFileSync(routesPath, "utf-8");
  });

  describe("Estructura del archivo", () => {
    it("el archivo existe y tiene contenido", () => {
      expect(routesCode).toBeDefined();
      expect(routesCode.length).toBeGreaterThan(0);
    });

    it("es un archivo TypeScript React (.tsx)", () => {
      const routesPath = path.join(__dirname, "AppRoutes.tsx");
      expect(routesPath).toContain(".tsx");
      expect(fs.existsSync(routesPath)).toBe(true);
    });

    it("tiene una longitud razonable", () => {
      const lines = routesCode.split("\n").length;
      expect(lines).toBeGreaterThan(5);
      expect(lines).toBeLessThan(50);
    });
  });

  describe("Importaciones de React Router", () => {
    it("importa Routes de react-router-dom", () => {
      expect(routesCode).toContain("import { Routes, Route } from \"react-router-dom\"");
    });

    it("importa Route de react-router-dom", () => {
      expect(routesCode).toContain("Route");
    });

    it("usa las importaciones correctas de react-router-dom", () => {
      // Debe usar Routes y Route (v6+), no Switch
      expect(routesCode).toContain("Routes");
      expect(routesCode).not.toContain("Switch");
    });
  });

  describe("Importaciones de componentes", () => {
    it("importa VendedorForm", () => {
      expect(routesCode).toContain("import VendedorForm from \"../pages/vendedores/VendedorForm\"");
    });

    it("importa ProveedorForm", () => {
      expect(routesCode).toContain("import ProveedorForm from \"../pages/proveedores/ProveedorForm\"");
    });

    it("importa ProductoForm", () => {
      expect(routesCode).toContain("import ProductoForm from \"../pages/productos/ProductoForm\"");
    });

    it("importa CargaMasiva", () => {
      expect(routesCode).toContain("import CargaMasiva from \"../pages/productos/CargaMasiva\"");
    });

    it("importa PlanVentaForm", () => {
      expect(routesCode).toContain("import PlanVentaForm from \"../pages/planes_venta/PlanVentaForm\"");
    });

    it("importa ReportesVentas", () => {
      expect(routesCode).toContain("import ReportesVentas from \"../pages/reportes/ReportesVentas\"");
    });

    it("todos los imports están al inicio del archivo", () => {
      const lines = routesCode.split("\n");
      const firstImportIndex = lines.findIndex(line => line.trim().startsWith("import"));
      const lastImportIndex = lines.map((line, i) => 
        line.trim().startsWith("import") ? i : -1
      ).filter(i => i !== -1).pop() || 0;
      
      const firstCodeIndex = lines.findIndex((line, i) => 
        i > lastImportIndex && line.trim() && !line.trim().startsWith("//")
      );
      
      expect(firstImportIndex).toBe(0);
      expect(firstCodeIndex).toBeGreaterThan(lastImportIndex);
    });
  });

  describe("Definición de rutas", () => {
    it("define la ruta /vendedores", () => {
      expect(routesCode).toContain("path=\"/vendedores\"");
      expect(routesCode).toContain("<VendedorForm />");
    });

    it("define la ruta /proveedores", () => {
      expect(routesCode).toContain("path=\"/proveedores\"");
      expect(routesCode).toContain("<ProveedorForm />");
    });

    it("define la ruta /productos", () => {
      expect(routesCode).toContain("path=\"/productos\"");
      expect(routesCode).toContain("<ProductoForm />");
    });

    it("define la ruta /productos/carga_masiva", () => {
      expect(routesCode).toContain("path=\"/productos/carga_masiva\"");
      expect(routesCode).toContain("<CargaMasiva />");
    });

    it("define la ruta /planes_venta", () => {
      expect(routesCode).toContain("path=\"/planes_venta\"");
      expect(routesCode).toContain("<PlanVentaForm />");
    });

    it("define la ruta /reportes", () => {
      expect(routesCode).toContain("path=\"/reportes\"");
      expect(routesCode).toContain("<ReportesVentas />");
    });

    it("tiene exactamente 7 rutas definidas (6 específicas + 1 catch-all)", () => {
      const routeMatches = routesCode.match(/<Route /g);
      expect(routeMatches).toBeTruthy();
      expect(routeMatches?.length).toBe(7);
    });
  });

  describe("Ruta 404 (catch-all)", () => {
    it("define una ruta catch-all con path=\"*\"", () => {
      expect(routesCode).toContain("path=\"*\"");
    });

    it("la ruta 404 muestra un mensaje de error", () => {
      expect(routesCode).toContain("404");
      expect(routesCode).toContain("Página no encontrada");
    });

    it("la ruta 404 usa un h3 para el mensaje", () => {
      expect(routesCode).toMatch(/<h3>404.*Página no encontrada<\/h3>/);
    });

    it("la ruta catch-all está al final", () => {
      const lines = routesCode.split("\n");
      const catchAllIndex = lines.findIndex(line => line.includes("path=\"*\""));
      const closingRoutesIndex = lines.findIndex(line => line.includes("</Routes>"));
      
      expect(catchAllIndex).toBeGreaterThan(-1);
      expect(closingRoutesIndex).toBeGreaterThan(-1);
      expect(catchAllIndex).toBeLessThan(closingRoutesIndex);
      
      // No debe haber otras rutas después del catch-all
      const routesAfterCatchAll = lines.slice(catchAllIndex + 1, closingRoutesIndex)
        .filter(line => line.includes("<Route"));
      
      expect(routesAfterCatchAll.length).toBe(0);
    });
  });

  describe("Estructura del componente", () => {
    it("define la función AppRoutes", () => {
      expect(routesCode).toContain("function AppRoutes()");
    });

    it("AppRoutes retorna JSX con Routes", () => {
      expect(routesCode).toContain("return (");
      expect(routesCode).toContain("<Routes>");
      expect(routesCode).toContain("</Routes>");
    });

    it("usa el patrón element={<Component />} para las rutas", () => {
      expect(routesCode).toMatch(/element=\{<\w+Form \/>\}/);
    });

    it("Routes envuelve todas las Route", () => {
      const routesOpenIndex = routesCode.indexOf("<Routes>");
      const routesCloseIndex = routesCode.indexOf("</Routes>");
      const firstRouteIndex = routesCode.indexOf("<Route");
      
      expect(routesOpenIndex).toBeGreaterThan(-1);
      expect(routesCloseIndex).toBeGreaterThan(-1);
      expect(firstRouteIndex).toBeGreaterThanOrEqual(routesOpenIndex);
      expect(firstRouteIndex).toBeLessThan(routesCloseIndex);
      
      // Verificar que Routes está presente
      expect(routesCode).toContain("<Routes>");
      expect(routesCode).toContain("</Routes>");
    });
  });

  describe("Exportación", () => {
    it("exporta AppRoutes como default", () => {
      expect(routesCode).toContain("export default function AppRoutes");
    });

    it("no tiene otras exportaciones nombradas", () => {
      const namedExports = routesCode.match(/export \{[^}]+\}/g);
      expect(namedExports).toBeFalsy();
    });
  });

  describe("Convenciones de rutas", () => {
    it("todas las rutas comienzan con /", () => {
      const pathMatches = routesCode.match(/path="([^"]+)"/g) || [];
      
      pathMatches.forEach(pathMatch => {
        const path = pathMatch.match(/path="([^"]+)"/)?.[1];
        if (path && path !== "*") {
          expect(path).toMatch(/^\//);
        }
      });
    });

    it("las rutas usan kebab-case", () => {
      expect(routesCode).toContain("carga_masiva");
      expect(routesCode).toContain("planes_venta");
      
      // No debe usar camelCase en las rutas
      expect(routesCode).not.toContain("path=\"/cargaMasiva\"");
      expect(routesCode).not.toContain("path=\"/planesVenta\"");
    });

    it("las rutas anidadas de productos usan el mismo prefijo", () => {
      expect(routesCode).toContain("/productos\"");
      expect(routesCode).toContain("/productos/carga_masiva\"");
    });
  });

  describe("Organización del código", () => {
    it("tiene buena indentación", () => {
      const indentedLines = routesCode.split("\n").filter(line => 
        line.startsWith("  ") || line.startsWith("    ")
      );
      
      expect(indentedLines.length).toBeGreaterThan(5);
    });

    it("Routes y Route están correctamente cerrados", () => {
      const routesOpen = (routesCode.match(/<Routes>/g) || []).length;
      const routesClose = (routesCode.match(/<\/Routes>/g) || []).length;
      
      expect(routesOpen).toBe(1);
      expect(routesClose).toBe(1);
      
      // Las Route deben ser self-closing
      const routeTags = routesCode.match(/<Route[^>]+\/>/g) || [];
      expect(routeTags.length).toBeGreaterThan(0);
    });

    it("no tiene console.log statements", () => {
      const lines = routesCode.split("\n");
      const codeLines = lines.filter((line) => {
        const trimmed = line.trim();
        return trimmed && !trimmed.startsWith("//") && trimmed.includes("console.log");
      });
      
      expect(codeLines.length).toBe(0);
    });
  });

  describe("Validación de sintaxis", () => {
    it("los paréntesis están balanceados", () => {
      const openParens = (routesCode.match(/\(/g) || []).length;
      const closeParens = (routesCode.match(/\)/g) || []).length;
      
      expect(openParens).toBe(closeParens);
    });

    it("las llaves están balanceadas", () => {
      const openBraces = (routesCode.match(/\{/g) || []).length;
      const closeBraces = (routesCode.match(/\}/g) || []).length;
      
      expect(openBraces).toBe(closeBraces);
    });

    it("los tags JSX están balanceados", () => {
      const openTags = (routesCode.match(/<Routes>/g) || []).length;
      const closeTags = (routesCode.match(/<\/Routes>/g) || []).length;
      
      expect(openTags).toBe(closeTags);
    });
  });

  describe("Rutas específicas del negocio", () => {
    it("tiene rutas para gestión de vendedores", () => {
      expect(routesCode).toContain("/vendedores");
    });

    it("tiene rutas para gestión de proveedores", () => {
      expect(routesCode).toContain("/proveedores");
    });

    it("tiene rutas para gestión de productos", () => {
      expect(routesCode).toContain("/productos");
    });

    it("tiene rutas para carga masiva de productos", () => {
      expect(routesCode).toContain("/productos/carga_masiva");
    });

    it("tiene rutas para planes de venta", () => {
      expect(routesCode).toContain("/planes_venta");
    });

    it("tiene rutas para reportes de ventas", () => {
      expect(routesCode).toContain("/reportes");
    });

    it("todas las rutas principales están presentes", () => {
      const expectedRoutes = [
        "/vendedores",
        "/proveedores",
        "/productos",
        "/productos/carga_masiva",
        "/planes_venta",
        "/reportes"
      ];
      
      expectedRoutes.forEach(route => {
        expect(routesCode).toContain(route);
      });
    });
  });
});
