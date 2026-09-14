import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppV2 from './AppV2';
import './styles.css';
import './tour-pages.css';
import './source-parity.css';
import './parity-fixes.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppV2 />
    </BrowserRouter>
  </React.StrictMode>,
);
