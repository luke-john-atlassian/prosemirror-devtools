import path from "path";
import type { UserConfig } from "vite";

const config: UserConfig = {
  resolve: {
    dedupe: ["react", "react-dom", "@emotion/react", "@emotion/styled"],
    alias: {
      "@luke-john/prosemirror-devtools-shared-ui": path.resolve(
        __dirname,
        "../shared-ui/src/index.tsx"
      ),
      "@luke-john/prosemirror-devtools-plugin": path.resolve(
        __dirname,
        "../prosemirror-plugin/src/index.ts"
      ),
      "@luke-john/prosemirror-devtools-shared-utils": path.resolve(
        __dirname,
        "../shared-utils/src/index.ts"
      ),
    },
  },
  server: {
    port: 5000,
  },
};

export default config;
