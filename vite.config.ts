import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        // Bind mounts (especially Docker on Windows) often omit fs events; without polling, HMR never runs.
        watch: {
            usePolling: true,
            interval: 1000,
        },
        // Browsers cannot open 0.0.0.0; Docker needs bind on all interfaces, HMR/scripts use localhost from the host.
        hmr: {
            host: 'localhost',
            port: 5173,
            clientPort: 5173,
        },
    },
});
