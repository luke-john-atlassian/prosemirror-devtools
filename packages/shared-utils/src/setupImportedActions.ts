import type { Source } from "./helpers";

type ExportedActions = {
  [key: string]: (...args: any[]) => any | Promise<any>;
};

export type AsyncActions<Actions extends ExportedActions> = {
  [Key in keyof Actions]: (
    ...args: Parameters<Actions[Key]>
  ) => Promise<ReturnType<Actions[Key]>>;
};

export function setupImportedActions<ImportedActions extends ExportedActions>({
  runtime,
  remoteRuntime,
  postMessage,
  registerEventListener,
}: {
  runtime: Source;
  remoteRuntime: Source;
  postMessage: (message: any) => void;
  registerEventListener: (messageHandler: (message: any) => void) => void;
}) {
  const subscriptions: [
    id: number,
    cb: (status: "failure" | "success", data: any) => void
  ][] = [];
  const actionsClient = {} as AsyncActions<ImportedActions>;

  const proxiedFakeActions = new Proxy(actionsClient, {
    get: function (target, property: string) {
      if (property in target) {
        // @ts-ignore
        return target[property];
      }

      async function process(...args: any[]) {
        try {
          const message = {
            ljpmdt: true,
            id: Date.now(),
            target: remoteRuntime,
            source: runtime,
            type: property,
            args,
          };

          const response = new Promise<void>((res) => {
            subscriptions.push([
              message.id,
              (status, data) => {
                if (status === "failure") {
                  throw new Error(data);
                }
                res(data);
              },
            ]);
          });

          postMessage(message);

          const resolved = await response;

          return resolved;
        } catch (err) {
          throw err;
        }
      }

      return process;
    },
  });

  registerEventListener(importedMessageHandler);

  function importedMessageHandler(message: any) {
    // discard unexpected messages
    if (
      [
        !message,
        !("ljpmdt" in message),
        message.target !== runtime,
        !["success", "failure"].includes(message.type),
      ].includes(true)
    ) {
      return;
    }

    const subscriptionIndex = subscriptions.findIndex((subscription) => {
      return subscription[0] === message.id;
    });
    const [[, cb]] = subscriptions.splice(subscriptionIndex, 1);
    cb(message.type, message.response);
  }

  return {
    actions: proxiedFakeActions,
  };
}
