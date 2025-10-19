# 🏥 MediSupply E20 - Cliente Web

Sistema de gestión de suministros médicos. Proyecto desarrollado con React + TypeScript + Material-UI.

## 🚀 CI/CD

Este proyecto cuenta con integración continua y deploy automático:

- **🧪 Tests Automáticos**: Se ejecutan en cada PR hacia `main` o `develop`
- **🚀 Deploy Automático**: Se despliega a Firebase Hosting cuando se hace merge a `main`

### GitHub Actions Workflows

- **`.github/workflows/tests.yml`**: Ejecuta tests y build en cada PR
- **`.github/workflows/deploy.yml`**: Deploy automático a Firebase Hosting (solo en `main`)

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## 🔥 Firebase Hosting

**URL de Producción:** `https://proyecto-medisupply-e20.web.app`

---

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests con coverage
npm test -- --coverage --watchAll=false
```

**Test Suites:**
- `src/utils/apiError.test.ts` - Tests de utilidades de manejo de errores
- `src/App.test.tsx` - Tests de infraestructura básica

---

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── NavBar.tsx      # Barra de navegación
│   └── NotificationProvider.tsx  # Sistema de notificaciones
├── pages/              # Páginas de la aplicación
│   ├── vendedores/     # Gestión de vendedores
│   ├── proveedores/    # Gestión de proveedores
│   ├── productos/      # Gestión de productos
│   └── planes_venta/   # Planes de venta
├── services/           # Servicios de API
├── routes/            # Configuración de rutas
└── utils/            # Utilidades
```

---

## 📚 Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)
- [Material-UI documentation](https://mui.com/)
- [Firebase Hosting documentation](https://firebase.google.com/docs/hosting)
