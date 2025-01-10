import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/core/store";
import { selectDataSource, selectUsers } from "../../app/core/selectors";
import ActivityGraph from "../components/activity/ActivityGraph";
import "./Dashboard.scss";
import Score from "../components/score/Score";
import Performances from "../components/performances/Performances";
import Card from "../components/card/Card";
import AverageSessions from "../components/average-sessions/AverageSessions";
import { switchDataSource } from "../../app/core/userSlice";
import { User } from "../../app/core/interfaces/user";

export default function Dashboard() {
  const dispatch: AppDispatch = useDispatch();
  const users = useSelector(selectUsers);
  const dataSource = useSelector(selectDataSource);
  const [userFromStore, setUserFromStore] = useState<User>();

  useEffect(() => {
    const getUserFromStore = () => {
      if (dataSource === 'local' && users.localUser) {
        const {data, activity, averageSession, performances} = users.localUser;

        if (data && activity && averageSession && performances) {
          console.log('envoi des données locales aux composants');
          setUserFromStore({
            userInfos: data,
            userActivity: activity,
            userPerformances: performances,
            userAverage: averageSession
          });
        }

      } else if (dataSource === 'api') {
        const {data, activity, averageSession, performances} = users.apiUser;

        if (data && activity && averageSession && performances) {
          console.log('envoi des données API aux composants');
          setUserFromStore({
            userInfos: data,
            userActivity: activity,
            userPerformances: performances,
            userAverage: averageSession
          });
        }
      }
    }

    if (!userFromStore) {
      getUserFromStore();
    }

    return () => {};
  }, [dataSource, dispatch, userFromStore, users.apiUser, users.localUser]);

  const handleSwitch = () => {
    dispatch(switchDataSource());
  }

  return (
    <div className="dashboard">
        {users && userFromStore ? (
        <>
          <div className="dashboard__header">
            <div className="resume">
              <div className="infos">
                <h1>
                  Bonjour{" "}
                  <span className="name">
                    {userFromStore.userInfos.userInfos.firstName}
                  </span>
                </h1>
              </div>
              <p>Félicitations ! Vous avez explosé vos objectifs hier 👏</p>
            </div>
            <div className="switch">
              <input type="checkbox" id="switch" checked={dataSource === 'api'} onChange={handleSwitch}/>
              <label htmlFor="switch"></label>
              Données {dataSource === 'local' ? 'locales' : 'API'}
            </div>
          </div>
          <div className="ladderboard">
            <div className="cards">
              <Card userKeyData={userFromStore.userInfos.keyData} />
            </div>
            <div className="activity">
              <ActivityGraph user={userFromStore.userActivity} />
            </div>
            <div className="average-sessions">
              <AverageSessions user={userFromStore.userAverage}/>
            </div>
            <div className="performances">
              <Performances user={userFromStore.userPerformances} />
            </div>
            <div className="score">
              <Score user={userFromStore.userInfos.todayScore} />
            </div>
          </div>
        </>
        ): <div>Les données de l'utilisateur ne sont pas disponibles pour le moment.</div>}
    </div>
  );
}
