import './App.css';
import { Routes, Route } from "react-router-dom";
import Login from './component/Login';
import User from './component/User';
import { useState } from 'react';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  function changeTheme(data) {
    setDarkMode(data);
  }

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <Routes>
        <Route exact path='/' element={<Login />} />
        <Route exact path='/trending-repositories' element={<User toggleTheme={changeTheme} />} />
      </Routes>
    </div>
  );
}

export default App;
