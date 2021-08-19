import type { UserConfig } from "vite";

const config: UserConfig = {
  resolve: {
    dedupe: ["react", "react-dom", "@emotion/react", "@emotion/styled"],
  },
  server: {
    port: 5000,
  },
};

export default config;
