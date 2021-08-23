import type { Source } from "./helpers";

export function setupExportedActions<TTarget extends Source>({
  runtime,
  exportedActions,
  postMessage,
  registerEventListener,
}: {
  runtime: TTarget;
  exportedActions: { [key: string]: (...args: any[]) => any | Promise<any> };
  postMessage: (message: any) => void;
  registerEventListener: (messageHandler: (message: any) => void) => void;
}) {
  registerEventListener(exportedMessageHandler);

  async function exportedMessageHandler(message: any) {
    // discard unexpected messages
    if (!message || !("ljpmdt" in message)) {
      return;
    }
    if (message.target !== runtime) {
      return;
    }
    if (!(message.type in exportedActions)) {
      return;
    }

    try {
      const outcome = await Promise.resolve(
        exportedActions[message.type](...message.args)
      );

      const responseMessage = {
        ljpmdt: true,
        source: runtime,
        target: message.source,
        id: message.id,
        type: "success",
        response: outcome,
      };

      postMessage(responseMessage);
    } catch (err) {
      const responseMessage = {
        ljpmdt: true,
        source: runtime,
        target: message.source,
        type: "failure",
        id: message.id,
        // @ts-ignore
        response: err?.message,
      };

      postMessage(responseMessage);
    }
  }
}
