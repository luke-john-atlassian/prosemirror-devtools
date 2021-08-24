import path from "path";
import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    dedupe: ["react", "react-dom", "@emotion/react", "@emotion/styled"],
    alias: {
      react: path.resolve(__dirname, "./node_modules/react"),
      "@emotion/styled": path.resolve(
        __dirname,
        "./node_modules/@emotion/styled"
      ),
      "react-inspector": path.resolve(
        __dirname,
        "./node_modules/react-inspector"
      ),

      "react-async-hook": path.resolve(
        __dirname,
        "./node_modules/react-async-hook"
      ),
      "@luke-john/prosemirror-devtools-plugin": path.resolve(
        __dirname,
        "../../../packages/prosemirror-plugin/src/index.ts"
      ),
      "@luke-john/prosemirror-devtools-shared-ui": path.resolve(
        __dirname,
        "../../../packages/shared-ui/src/index.tsx"
      ),
      "@luke-john/prosemirror-devtools-shared-utils": path.resolve(
        __dirname,
        "../../../packages/shared-utils/src/index.ts"
      ),
    },
  },
  build: {
    outDir: "../client-desktop/compiled-renderer",
  },
  plugins: [reactRefresh()],
});
