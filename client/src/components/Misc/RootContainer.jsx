import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar } from '../index';

function RootContainer() {
  return (
    <div id="scrollable_results_screen" className="min-h-screen flex flex-col">
      <NavBar />
      <Outlet />
    </div>
  );
}

export default RootContainer;
