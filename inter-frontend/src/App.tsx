import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import SignIn from './user/pages/signIn';
import SignUp from './user/pages/signUp';
import Main from './user/pages/main';

function App() {

  return (
    <Router>
      <main className="app_main_container">
        <Routes>
          <Route path="/Sign_in" element={<SignIn />} />
          <Route path="/Sign_up" element={<SignUp />} />
          <Route path="/Main" element={<Main />} />
          <Route path="*" element={<Navigate to="/Sign_in" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
