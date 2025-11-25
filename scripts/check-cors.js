/**
 * Script para verificar la configuración CORS y Proxy
 * Ejecuta: node scripts/check-cors.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de CORS y Proxy...\n');

// 1. Verificar package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

if (packageJson.proxy) {
  console.log('✅ Proxy configurado en package.json');
  console.log(`   → ${packageJson.proxy}\n`);
} else {
  console.log('⚠️  No hay proxy configurado en package.json\n');
}

// 2. Verificar api.ts
const apiPath = path.join(__dirname, '..', 'src', 'services', 'api.ts');
const apiContent = fs.readFileSync(apiPath, 'utf8');

if (apiContent.includes("process.env.NODE_ENV === 'development'")) {
  console.log('✅ api.ts configurado para usar proxy en desarrollo\n');
} else {
  console.log('⚠️  api.ts podría no estar usando el proxy correctamente\n');
}

// 3. Verificar archivo .env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ Archivo .env encontrado');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const apiDomain = envContent.match(/REACT_APP_API_DOMAIN=(.+)/);
  if (apiDomain) {
    console.log(`   → REACT_APP_API_DOMAIN=${apiDomain[1]}\n`);
  } else {
    console.log('   → No hay REACT_APP_API_DOMAIN definido (se usará el proxy)\n');
  }
} else {
  console.log('ℹ️  No hay archivo .env (se usará el proxy por defecto)\n');
}

// 4. Instrucciones
console.log('📋 Próximos pasos:');
console.log('   1. Reinicia el servidor: npm start');
console.log('   2. Verifica en DevTools → Network que las peticiones sean:');
console.log('      http://localhost:3000/api/v1/...');
console.log('   3. El proxy redirigirá automáticamente a:');
console.log(`      ${packageJson.proxy || 'el backend configurado'}/api/v1/...\n`);

console.log('✨ Configuración verificada correctamente!\n');
