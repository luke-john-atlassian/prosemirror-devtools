import * as React from "react";
import { ExposedPluginState } from "@luke-john/prosemirror-devtools-plugin";

export function usePluginStates({
  getPluginStates,
}: {
  getPluginStates: () => Promise<ExposedPluginState[]>;
}) {
  const [exposedPluginStates, setExposedPluginStates] = React.useState<
    ExposedPluginState[]
  >([]);

  React.useEffect(() => {
    const controller = new AbortController();

    let interval: ReturnType<typeof setInterval>;

    async function loadPluginStates() {
      try {
        const trackedPluginStates = await getPluginStates();

        if (controller.signal.aborted) {
          clearInterval(interval);
          return;
        }

        if (trackedPluginStates) {
          setExposedPluginStates(trackedPluginStates);
        }
      } catch (err) {
        console.error(err);
      }
    }
    interval = setInterval(loadPluginStates, 1000);

    loadPluginStates();

    return () => {
      controller.abort();
    };
  }, []);

  return exposedPluginStates;
}
