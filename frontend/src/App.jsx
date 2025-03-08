import './App.css';
import { Page404 } from './Page404.jsx';
import { PageLogin } from './PageLogin.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Page404 />} />
        <Route path='login' element={<PageLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
