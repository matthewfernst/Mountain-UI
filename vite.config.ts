import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";

import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        target: "esnext"
    },
    plugins: [
        electron({
            entry: ["electron/main/index.ts"],
            vite: {
                build: {
                    outDir: "dist/electron",
                    rollupOptions: {
                        external: ["epoll"]
                    }
                }
            }
        }),
        react(),
        renderer({})
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    server: {
        port: 3000,
        strictPort: true
    }
});
