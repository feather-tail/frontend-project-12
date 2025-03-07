import { useState } from 'react'
import './App.css'
import { PageOne } from './404.jsx';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageOne } from './Components/Pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="one" element={<PageOne />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
