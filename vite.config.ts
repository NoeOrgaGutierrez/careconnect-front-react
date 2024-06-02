import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		hmr: {
			host: '34.118.16.66',
			port: 80,
			protocol: 'ws'
		},
		host: true
	},
	plugins: [react(), legacy()]
})
