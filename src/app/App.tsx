import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./features/pages/dashboard/Dashboard";
import Header from "./features/components/header/Header";
import Aside from "./features/components/aside/Aside";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchLocalUserAllData
} from "./core/userSlice";
import { selectDataSource, selectUsers } from './core/selectors';
import Home from "./features/pages/home/Home";
import { AppDispatch } from './core/types/store-types';

function App() {

  const dispatch: AppDispatch = useDispatch();
  const dataSource = useSelector(selectDataSource);
  const users = useSelector(selectUsers);

  useEffect(() => {
    if (dataSource === "local" && !users.localAllData.data) {
      dispatch(fetchLocalUserAllData());
    }


    return () => {};
  }, [
    dataSource,
    dispatch,
    users.localAllData
  ]);

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
