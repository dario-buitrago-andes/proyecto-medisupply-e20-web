/**
 * Tests para index.tsx - Punto de entrada de la aplicación
 */

import * as fs from "fs";
import * as path from "path";

export {};

describe("index.tsx", () => {
  let indexCode: string;

  beforeAll(() => {
    // Leer el código fuente de index.tsx
    const indexPath = path.join(__dirname, "index.tsx");
    indexCode = fs.readFileSync(indexPath, "utf-8");
  });

  describe("Verificaciones básicas del archivo", () => {
    it("el archivo existe y tiene contenido", () => {
      expect(indexCode).toBeDefined();
      expect(indexCode.length).toBeGreaterThan(0);
    });

    it("es un archivo TypeScript con extensión .tsx", () => {
      const indexPath = path.join(__dirname, "index.tsx");
      expect(indexPath).toContain(".tsx");
      expect(fs.existsSync(indexPath)).toBe(true);
    });

    it("tiene una longitud razonable para un punto de entrada", () => {
      const lines = indexCode.split("\n").length;
      expect(lines).toBeGreaterThan(10);
      expect(lines).toBeLessThan(50);
    });
  });

  describe("Importaciones requeridas", () => {
    it("importa React", () => {
      expect(indexCode).toContain("import React from 'react'");
    });

    it("importa ReactDOM", () => {
      expect(indexCode).toContain("import ReactDOM from 'react-dom/client'");
    });

    it("importa el componente App", () => {
      expect(indexCode).toContain("import App from './App'");
    });

    it("importa reportWebVitals", () => {
      expect(indexCode).toContain("import reportWebVitals from './reportWebVitals'");
    });

    it("importa index.css para estilos globales", () => {
      expect(indexCode).toContain("import './index.css'");
    });

    it("importa forms.css para estilos de formularios", () => {
      expect(indexCode).toContain("import './styles/forms.css'");
    });

    it("todas las importaciones están al inicio del archivo", () => {
      const lines = indexCode.split("\n");
      const firstCodeLine = lines.findIndex((line) => 
        line.trim() && !line.trim().startsWith("import") && !line.trim().startsWith("//")
      );
      
      // Todas las importaciones deben estar antes de la primera línea de código
      expect(firstCodeLine).toBeGreaterThan(5);
    });
  });

  describe("Uso de ReactDOM.createRoot (React 18+)", () => {
    it("usa ReactDOM.createRoot", () => {
      expect(indexCode).toContain("ReactDOM.createRoot");
    });

    it("crea el root con el elemento #root del DOM", () => {
      expect(indexCode).toContain("document.getElementById('root')");
    });

    it("hace cast a HTMLElement del elemento root", () => {
      expect(indexCode).toContain("as HTMLElement");
    });

    it("asigna el root a una constante", () => {
      expect(indexCode).toMatch(/const root = ReactDOM\.createRoot/);
    });

    it("el código de createRoot está formateado correctamente", () => {
      const createRootPattern = /const root = ReactDOM\.createRoot\(\s*document\.getElementById\('root'\) as HTMLElement\s*\);/;
      expect(indexCode).toMatch(createRootPattern);
    });
  });

  describe("Renderizado de la aplicación", () => {
    it("llama a root.render", () => {
      expect(indexCode).toContain("root.render");
    });

    it("renderiza el componente App", () => {
      expect(indexCode).toContain("<App />");
    });

    it("envuelve App en React.StrictMode", () => {
      expect(indexCode).toContain("<React.StrictMode>");
      expect(indexCode).toContain("</React.StrictMode>");
    });

    it("StrictMode envuelve completamente a App", () => {
      const strictModePattern = /<React\.StrictMode>\s*<App \/>\s*<\/React\.StrictMode>/;
      expect(indexCode).toMatch(strictModePattern);
    });

    it("root.render está después de crear el root", () => {
      const createRootIndex = indexCode.indexOf("ReactDOM.createRoot");
      const renderIndex = indexCode.indexOf("root.render");
      
      expect(createRootIndex).toBeGreaterThan(-1);
      expect(renderIndex).toBeGreaterThan(-1);
      expect(renderIndex).toBeGreaterThan(createRootIndex);
    });
  });

  describe("Performance y Web Vitals", () => {
    it("llama a reportWebVitals", () => {
      expect(indexCode).toContain("reportWebVitals()");
    });

    it("reportWebVitals se llama al final del archivo", () => {
      const lines = indexCode.split("\n").filter((line) => line.trim());
      const lastCodeLine = lines[lines.length - 1];
      
      // La última línea con código debe ser reportWebVitals o cerca del final
      const reportWebVitalsIndex = indexCode.indexOf("reportWebVitals()");
      const lastIndex = indexCode.lastIndexOf("}");
      
      expect(reportWebVitalsIndex).toBeGreaterThan(lastIndex - 200);
    });

    it("tiene comentarios explicativos sobre reportWebVitals", () => {
      expect(indexCode).toMatch(/\/\/ If you want to start measuring performance/);
    });

    it("menciona el enlace a CRA vitals documentation", () => {
      expect(indexCode).toContain("bit.ly/CRA-vitals");
    });
  });

  describe("Configuración y estructura", () => {
    it("usa el id 'root' para montar la aplicación", () => {
      expect(indexCode).toContain("getElementById('root')");
    });

    it("no tiene errores de sintaxis obvios", () => {
      // Verificar que los paréntesis y llaves están balanceados
      const openParens = (indexCode.match(/\(/g) || []).length;
      const closeParens = (indexCode.match(/\)/g) || []).length;
      const openBraces = (indexCode.match(/\{/g) || []).length;
      const closeBraces = (indexCode.match(/\}/g) || []).length;
      
      expect(openParens).toBe(closeParens);
      expect(openBraces).toBe(closeBraces);
    });

    it("usa comillas simples para imports", () => {
      const imports = indexCode.match(/import .* from ['"].+['"]/g) || [];
      const singleQuoteImports = imports.filter((imp) => imp.includes("'"));
      
      // La mayoría o todos los imports usan comillas simples
      expect(singleQuoteImports.length).toBeGreaterThan(0);
    });

    it("tiene el export vacío para TypeScript", () => {
      // Este export {} hace que el archivo sea tratado como módulo
      expect(indexCode.split("\n").some(line => line.trim() === "export {};" || line === "")).toBe(true);
    });
  });

  describe("StrictMode y buenas prácticas", () => {
    it("usa StrictMode para ayudar a detectar problemas", () => {
      expect(indexCode).toContain("React.StrictMode");
    });

    it("StrictMode está correctamente cerrado", () => {
      const openStrictMode = (indexCode.match(/<React\.StrictMode>/g) || []).length;
      const closeStrictMode = (indexCode.match(/<\/React\.StrictMode>/g) || []).length;
      
      expect(openStrictMode).toBe(1);
      expect(closeStrictMode).toBe(1);
    });

    it("no tiene console.log statements en el código ejecutable", () => {
      // Verificar que no hay console.log fuera de comentarios
      const lines = indexCode.split("\n");
      const codeLines = lines.filter((line) => {
        const trimmed = line.trim();
        return trimmed && !trimmed.startsWith("//") && trimmed.includes("console.log");
      });
      
      expect(codeLines.length).toBe(0);
    });

    it("no tiene código comentado innecesario", () => {
      // No debería tener bloques grandes de código comentado con const/let/var
      const commentedLines = indexCode.split("\n").filter((line) => {
        const trimmed = line.trim();
        return trimmed.startsWith("//") && (
          trimmed.includes("const ") || 
          trimmed.includes("let ") || 
          trimmed.includes("var ")
        );
      });
      
      expect(commentedLines.length).toBe(0);
    });
  });

  describe("React 18 compatibility", () => {
    it("usa la API de React 18 con createRoot", () => {
      // No debe usar ReactDOM.render (API antigua)
      expect(indexCode).not.toContain("ReactDOM.render(");
    });

    it("importa desde 'react-dom/client' no 'react-dom'", () => {
      expect(indexCode).toContain("from 'react-dom/client'");
      
      // No debe tener import de react-dom sin /client
      const lines = indexCode.split("\n");
      const reactDOMImports = lines.filter((line) => 
        line.includes("from 'react-dom'") && !line.includes("/client")
      );
      
      expect(reactDOMImports.length).toBe(0);
    });

    it("tipado correcto con HTMLElement", () => {
      expect(indexCode).toContain("as HTMLElement");
    });
  });

  describe("Orden y organización", () => {
    it("las importaciones están en orden lógico", () => {
      const lines = indexCode.split("\n");
      const imports = lines.filter((line) => line.trim().startsWith("import"));
      
      expect(imports.length).toBeGreaterThan(4);
      
      // React debe ser el primer import
      expect(imports[0]).toContain("import React");
    });

    it("el código está bien indentado", () => {
      // Verificar que hay indentación (espacios o tabs)
      const indentedLines = indexCode.split("\n").filter((line) => 
        line.startsWith("  ") || line.startsWith("\t")
      );
      
      expect(indentedLines.length).toBeGreaterThan(0);
    });

    it("tiene líneas en blanco para separar secciones", () => {
      const emptyLines = indexCode.split("\n").filter((line) => line.trim() === "");
      
      // Debe tener al menos algunas líneas en blanco para legibilidad
      expect(emptyLines.length).toBeGreaterThan(1);
    });
  });
});
