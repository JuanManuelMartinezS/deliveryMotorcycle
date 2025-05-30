import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '../routes/index';

const RouterConfig = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default RouterConfig;