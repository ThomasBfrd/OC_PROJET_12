import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from '../features/pages/Dashboard';
import Header from '../features/components/header/Header';
import Aside from '../features/components/aside/Aside';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from './core/store';
import { fetchLocalUserInfos, fetchApiUserInfos, fetchLocalUserActivity, fetchLocalUserAverageSessions, fetchLocalUserPerformances, fetchApiUserActivity, fetchApiUserAverageSessions, fetchApiUserPerformances } from './core/userSlice';
import { selectDataSource, selectUsers } from './core/selectors';

function App() {

  const dispatch: AppDispatch = useDispatch();
  const dataSource = useSelector(selectDataSource);
  const users = useSelector(selectUsers);

  useEffect(() => {
    if (dataSource === 'local' && !users.localUser.data) {
        dispatch(fetchLocalUserInfos());
        dispatch(fetchLocalUserActivity());
        dispatch(fetchLocalUserAverageSessions());
        dispatch(fetchLocalUserPerformances());
    } else if (dataSource === 'api' && !users.apiUser.data) {
        dispatch(fetchApiUserInfos());
        dispatch(fetchApiUserActivity());
        dispatch(fetchApiUserAverageSessions());
        dispatch(fetchApiUserPerformances());
    }

    return () => {};


  }, [dataSource, dispatch, users.apiUser, users.localUser]);

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
