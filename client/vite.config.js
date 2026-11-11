import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()], server: { proxy: { '/api': 'http://https://portfolio-website-48sl.onrender.com' } } })
