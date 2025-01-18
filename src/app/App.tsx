import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from '../features/pages/Dashboard';
import Header from '../features/components/header/Header';
import Aside from '../features/components/aside/Aside';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from './core/store';
import {
  fetchLocalUserAllData,
  fetchApiUserAllData,
} from "./core/userSlice";
import { selectDataSource, selectUsers } from './core/selectors';

function App() {

  const dispatch: AppDispatch = useDispatch();
  const dataSource = useSelector(selectDataSource);
  const users = useSelector(selectUsers);

  useEffect(() => {
    if (dataSource === "local" && !users.localAllData.data) {
      dispatch(fetchLocalUserAllData());
    } else if (dataSource === "api" && !users.apiAllData.data) {
      dispatch(fetchApiUserAllData());
    }

    console.log(users.localAllData);

    return () => {};
  }, [
    dataSource,
    dispatch,
    users.localAllData,
    users.apiAllData
  ]);

  return (
    <>
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element={<Dashboard />}></Route>
    </Routes>
    <Aside />
    </BrowserRouter>
    </>
  )
}

export default App
