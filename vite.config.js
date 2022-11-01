import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig(async ({command, mode}) => {
    return {
        base: command === 'build' ? '/dist/' : '',
        plugins: [
            await laravel({   
                input: 'resources/js/app.ts',
                refresh: true,
                manifest: true,
            }),
            await vue({
                template: {
                    transformAssetUrls: {
                        base: null,
                        includeAbsolute: false,
                    },
                },
            }),
        ],
        esbuild: {
            target: "esnext"
        },
        optimizeDeps: {
            esbuildOptions: {
                target: 'esnext',
                supported: {
                    bigint: true,
                }
            },
            include: [
                "@inertiajs/inertia-vue3",
                "axios",
                "vue"
            ],
        },
        server: {
            host: 'laravel-inertia-vue3-vite-typescript.test',
            watch: {
                usePolling: true,
            },
        },
    }
});
