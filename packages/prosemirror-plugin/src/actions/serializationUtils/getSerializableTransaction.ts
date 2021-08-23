import type { Transaction } from "prosemirror-state";
import { safeJsonStringifyAndParse } from "./safeJsonStringifyAndParse";

export type SerializableTransaction = Transaction<any>;

export function getSerializableTransaction(tr: Transaction<any>) {
  const serializedTransaction: any = {};

  for (const trKey of Object.keys(tr)) {
    // metas and docs can be quite expensive
    const limit = ["meta", "doc"].includes(trKey) ? 50 : undefined;

    serializedTransaction[trKey] = safeJsonStringifyAndParse(
      // @ts-ignore
      tr[trKey],
      2,
      limit
    );
  }

  return serializedTransaction;
}
