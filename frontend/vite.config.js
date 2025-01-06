import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();
const hostAddress = process.env.VITE_REACT_URL || 'localhost';
const hostPort = process.env.VITE_REACT_PORT || 5000;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["jwt-decode"],
},
server: {
  host: hostAddress,  // Listen on all interfaces
  port: hostPort,        // Replace with your desired port
  open: true,        // Automatically open the browser
},
})
