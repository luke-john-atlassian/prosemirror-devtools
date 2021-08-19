import React from 'react';
import { ExposedPluginState } from '@luke-john/prosemirror-devtools-plugin';

import {
  StateExplorer,
  usePluginStates,
} from '@luke-john/prosemirror-devtools-shared-ui';

import { proxiedFakeActions } from './sync-to-devtools';

const Panel: React.FC = () => {
  const [
    selectedPluginStateCreated,
    setSelectedPluginStateCreated,
  ] = React.useState<ExposedPluginState['created'] | undefined>(undefined);

  const pluginStates = usePluginStates({
    getPluginStates: proxiedFakeActions.listPluginState,
  });

  React.useEffect(() => {
    if (pluginStates && pluginStates.length && !selectedPluginStateCreated) {
      setSelectedPluginStateCreated(pluginStates[0]?.created);
    }
  }, [pluginStates]);

  const currentPluginState = pluginStates
    ? pluginStates.find(
        (pluginState) => pluginState.created === selectedPluginStateCreated
      )
    : undefined;

  return (
    <div className="container">
      <h1>Dev Tools Panel</h1>
      <select value={selectedPluginStateCreated}>
        {pluginStates.map((pluginState) => (
          <option key={pluginState.created} value={pluginState.created}>
            {pluginState.created} - {pluginState.leadingTextContent}
          </option>
        ))}
      </select>
      {currentPluginState &&
        currentPluginState.history
          .reverse()
          .slice(0, 10)
          .map((historyEntry, index) => (
            <StateExplorer
              key={historyEntry.transaction?.time || 'init'}
              document={historyEntry.doc}
              selection={historyEntry.selection}
              transaction={historyEntry.transaction!}
            />
          ))}
    </div>
  );
};

export default Panel;
