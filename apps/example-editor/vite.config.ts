import path from "path";
import type { UserConfig } from "vite";

const config: UserConfig = {
  resolve: {
    dedupe: ["react", "react-dom", "@emotion/react", "@emotion/styled"],
    alias: {
      "@luke-john/prosemirror-devtools-shared-ui": path.resolve(
        __dirname,
        "../../packages/shared-ui/src/index.tsx"
      ),
      "@luke-john/prosemirror-devtools-plugin/node": path.resolve(
        __dirname,
        "../../packages/prosemirror-plugin/src/node.ts"
      ),
      "@luke-john/prosemirror-devtools-plugin/window": path.resolve(
        __dirname,
        "../../packages/prosemirror-plugin/src/window.ts"
      ),
      "@luke-john/prosemirror-devtools-shared-utils": path.resolve(
        __dirname,
        "../../packages/shared-utils/src/index.ts"
      ),
    },
  },
  server: {
    port: 5000,
  },
};

export default config;
