import './App.css';
import { Routes, Route } from "react-router-dom";
import Login from './component/Login';
import User from './component/User';
import { useState } from 'react';
import Repo_details from './component/Repo_details';
import { Form } from 'react-bootstrap';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  function changeTheme(data) {
    setDarkMode(data);
  }

  function handleToggle(e) {
    if (e.target.checked) {
        setDarkMode(true);
    } else {
        setDarkMode(false);
    }
  }


  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <div style={{ display: 'flex', alignItems: "center", flex: "end" }}>
          <b>Dark Mode</b>&nbsp;
          <Form.Check onChange={e => handleToggle(e)} size="sm" />
      </div>
      <Routes>
        <Route exact path='/' element={<Login />} />
        <Route exact path='*' element={<Login />} />
        <Route exact path='/trending-repositories' element={<User darkMode={darkMode} />} />
        <Route exact path='/repo-details' element={<Repo_details />} />
      </Routes>
    </div>
  );
}

export default App;
