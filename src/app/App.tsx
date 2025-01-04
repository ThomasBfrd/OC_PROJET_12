import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from '../features/pages/Dashboard';
import Header from '../features/components/header/Header';
import Aside from '../features/components/aside/Aside';
import { useEffect, useState } from 'react';
import { useSelector, useStore, useDispatch } from 'react-redux';
import { getUserInfos } from '../Api/Api';
import { User } from './core/interfaces/user.interface';
import { RootState } from './core/storeType';
import { getUsersList } from './core/selectors';

function App() {

  const getUsers = useSelector(getUsersList);
  const store = useStore<RootState>();
  const dispatch = useDispatch();
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (getUsers.length === 0) {
      const fetchData = async () => {
        const data = await getUserInfos('local');

        if (!isDataFetched && data) {
          setIsDataFetched(true);
          const existingUsers: Array<User> = store.getState().users;
          const uniqueUsers = data.filter(
            (user: User) => !existingUsers.includes(user)
          );
          console.log(uniqueUsers);

          dispatch({
            type: "GET_LOCAL_USER",
            payload: uniqueUsers,
          });
        }
        return () => {};
      };

      fetchData();
    }
  }, [getUsers])

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
