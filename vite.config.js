import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    // Esto asegura que el código que usa process.env no rompa la build
    // El valor real vendrá del shim en index.html o variables de entorno del sistema
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }
})