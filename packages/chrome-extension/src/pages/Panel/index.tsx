/**
 * The globalThis.regeneratorRuntime = undefined addresses a potentially unsafe-eval problem
 * Source: https://github.com/facebook/regenerator/issues/378#issuecomment-802628326
 * Date: July 14, 2021
 */
// @ts-expect-error
globalThis.regeneratorRuntime = undefined;

import React from 'react';
import { render } from 'react-dom';

import Panel from './Panel';

render(<Panel />, window.document.querySelector('#app-container'));

// @ts-expect-error
if (module.hot) module.hot.accept();
