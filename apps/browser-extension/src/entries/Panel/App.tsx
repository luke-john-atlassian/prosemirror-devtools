import React from 'react';

import { App as SharedApp } from '@luke-john/prosemirror-devtools-shared-ui';

import { activePageActions } from './sync-to-devtools';

export function App() {
  return <SharedApp pluginActions={activePageActions} />;
}
