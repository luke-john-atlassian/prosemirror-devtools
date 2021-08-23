import type { exportedPluginActions } from "@luke-john/prosemirror-devtools-plugin";

export type UiTrackedPmEditor = ReturnType<
  typeof exportedPluginActions["listTrackedPmEditors"]
>[number];

let _trackedPmEditorsSubscibers: ((
  trackedPmEditorsUpdate: UiTrackedPmEditor[]
) => void)[] = [];

export function subscribeToTrackedPmEditors(
  listener: (trackedPmEditorsUpdate: UiTrackedPmEditor[]) => void
) {
  _trackedPmEditorsSubscibers.push(listener);
  return () => {
    const index = _trackedPmEditorsSubscibers.indexOf(listener);
    _trackedPmEditorsSubscibers.splice(index, 1);
  };
}

export function updateTrackedPmEditors(
  updatedTrackedPmEditors: UiTrackedPmEditor[]
) {
  _trackedPmEditorsSubscibers.forEach((listener) =>
    listener(updatedTrackedPmEditors)
  );
}
