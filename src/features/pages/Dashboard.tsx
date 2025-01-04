import { useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { getUsersList } from "../../app/core/selectors";
import ActivityGraph from "../components/activity/ActivityGraph";
import "./Dashboard.scss";
import Score from "../components/score/Score";
import Performances from "../components/performances/Performances";
import Card from "../components/card/Card";
import AverageSessions from "../components/average-sessions/AverageSessions";
import { RootState } from "@reduxjs/toolkit/query";
import { getUserInfos } from "../../Api/Api";
import { User } from "../../app/core/interfaces/user.interface";

const data = [
  {
    image: "/public/protein-icon.png",
    number: "155g",
    text: "Protéines",
  },
  {
    image: "/public/carbs-icon.png",
    number: "290g",
    text: "Glucides",
  },
  {
    image: "/public/fat-icon.png",
    number: "50g",
    text: "Lipides",
  },
  {
    image: "/public/calories-icon.png",
    number: "50g",
    text: "Calories",
  },
];

export default function Dashboard() {
  const getUsers = useSelector(getUsersList);
  const [fetchData, setFetchData] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const store = useStore<RootState>();
  const dispatch = useDispatch();

  const checkDataFetchedBtn = () => {
      const fetchData = async () => {
        const data = await getUserInfos('api');

        if (!isDataFetched && data) {
          setIsDataFetched(true);
          console.log(data.data);
          
          // const existingUsers: Array<User> = store.getState().users;
          // const uniqueUsers = data.data.filter(
          //   (user: User) => !existingUsers.includes(user)
          // );
          // console.log(uniqueUsers);

          dispatch({
            type: "GET_API_USER",
            payload: data,
          });
        }
        return () => {};
      };

      fetchData();
  }

  useEffect(() => {

    if (fetchData) {
      checkDataFetchedBtn();
    }

    return () => {};
  }, [getUsers, fetchData]);

  return (
    <div className="dashboard">
      {getUsers ? (
        <>
          <div className="dashboard__header">
            <div className="resume">
              <div className="infos">
                <h1>
                  Bonjour{" "}
                  <span className="name">
                    {getUsers[0]?.userInfos?.firstName}
                  </span>
                </h1>
              </div>
              <p>Félicitations ! Vous avez explosé vos objectifs hier 👏</p>
            </div>
            <div className="switch">
              <input type="checkbox" id="switch" checked={fetchData} onChange={() => setFetchData(fetchData => !fetchData)}/>
              <label htmlFor="switch"></label>
              Données API
            </div>
          </div>
          <div className="ladderboard">
            <div className="cards">
              <ul className="card-list">
                {data.map((card, index) => (
                  <li key={index} className="card-item">
                    <Card {...card} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="activity">
              <ActivityGraph />
            </div>
            <div className="average-sessions">
              <AverageSessions />
            </div>
            <div className="performances">
              <Performances />
            </div>
            <div className="score">
              <Score />
            </div>
          </div>
        </>
      ) : (
        <div className="dashboard__header">
          <span>Aucun utilisateur trouvé</span>
        </div>
      )}
    </div>
  );
}
