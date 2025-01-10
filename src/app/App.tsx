import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from '../features/pages/Dashboard';
import Header from '../features/components/header/Header';
import Aside from '../features/components/aside/Aside';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from './core/store';
import { fetchLocalUserInfos, fetchApiUserInfos, fetchLocalUserActivity, fetchLocalUserAverageSessions, fetchLocalUserPerformances, fetchApiUserActivity, fetchApiUserAverageSessions, fetchApiUserPerformances } from './core/userSlice';
import { selectDataSource, selectStatus, selectUsers } from './core/selectors';

function App() {

  const dispatch: AppDispatch = useDispatch();
  const dataSource = useSelector(selectDataSource);
  const users = useSelector(selectUsers);
  const status = useSelector(selectStatus);

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

    if (status === 'idle') {
      console.log('Tout premier appel en local');
    } else if (status === 'loading') {
      console.log('appel du local ou api');
    } else if (status === 'failed') {
      console.log('erreur dans la récupération des données');
    }

    if (dataSource === 'local') {
      console.log('données locales');
      
    } else if (dataSource === 'api') {
      console.log('données API');
      
    }

    return () => {};


  }, [dataSource, dispatch, status, users.apiUser, users.localUser]);

  if (status === 'loading') {
    return <div>Chargement...</div>;
  }

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
