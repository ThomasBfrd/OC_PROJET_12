import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./features/pages/dashboard/Dashboard";
import Header from "./features/components/header/Header";
import Aside from "./features/components/aside/Aside";
import Home from "./features/pages/home/Home";

function App() {

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/dashboard/:userId" element={<Dashboard />}></Route>
          <Route
            path="*"
            element={<Navigate to="/"></Navigate>}
          ></Route>
        </Routes>
        <Aside />
      </BrowserRouter>
    </>
  );
}

export default App
