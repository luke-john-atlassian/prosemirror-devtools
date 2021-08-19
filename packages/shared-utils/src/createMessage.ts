export function getMessageUtils<Host extends Source>(host: Host) {
  return {
    createMessage: getCreateMessage(host),
    createResponseMessage: getCreateResponseMessage(host),
    shouldHandleResponse: getShouldHandleMessage(host),
  };
}

function getShouldHandleMessage<TTarget extends Source>(target: TTarget) {
  function shouldHandleMessage<TTarget extends Source>(
    message: any
  ): message is Extract<Message, { target: TTarget }> {
    if (!message || !("source" in message)) {
      return false;
    }

    if (message.target !== target) {
      return false;
    }

    return true;
  }

  return shouldHandleMessage;
}

function getCreateResponseMessage<TSource extends Source>(source: TSource) {
  function createResponse({
    orignalMessage,
    response,
    status,
  }: {
    orignalMessage: Message;
    response: any;
    status: "success" | "failure";
  }) {
    return {
      source,
      target: orignalMessage.source,
      id: orignalMessage.id,
      type: status,
      response,
    };
  }

  return createResponse;
}

type Source = "background" | "devtools" | "content_script" | "page";

type Message =
  | {
      source: "page";
      target: Source;
      /** added at the background layer */
      targetTabId?: number;
      type: string;
      id: string;
      args: any[];
    }
  | {
      source: "content_script";
      target: Source;
      /** added at the background layer */
      targetTabId?: number;
      type: string;
      id: string;
      args: any;
    }
  | {
      source: "devtools";
      target: "page" | "content_script";
      targetTabId: number;
      type: string;
      id: string;
      args: any[];
    };

function getCreateMessage<TSource extends Source>(source: TSource) {
  type TMessage = Extract<Message, { source: TSource }>;
  function createMessage(message: Omit<TMessage, "source" | "id">) {
    return {
      ...message,
      source,
      id: Date.now(),
    };
  }
  return createMessage;
}
