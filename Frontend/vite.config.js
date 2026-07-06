import { defineConfig } from 'vite'
import react from '@vitejs/react-refresh'

// ENFORCING EXPLICIT SUBFOLDER BASE ROUTE PATHS TARGET FOR GITHUB ACTIONS PIPELINES
export default defineConfig({
  plugins: [react()],
  base: '/ThreadCraft-Textiles-Platform/'
})