import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ENFORCING EXPLICIT SUBFOLDER BASE ROUTE PATHS TARGET FOR GITHUB PAGES DEPLOYMENTS
export default defineConfig({
  plugins: [react()],
  base: '/ThreadCraft-Textiles-Platform/'
})