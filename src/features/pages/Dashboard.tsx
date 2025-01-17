import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/core/store";
import { selectDataSource, selectStatus, selectUsers } from "../../app/core/selectors";
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
  const status = useSelector(selectStatus);
  const [userFromStore, setUserFromStore] = useState<User>();
  const [isChecked, setIsChecked] = useState(dataSource === 'api');

  useEffect(() => {
    const getUserFromStore = () => {
      const user = dataSource === 'local' ? users.localUser : users.apiUser;
      
      if (user) {
        const { data, activity, averageSession, performances } = user;
        if (data && activity && averageSession && performances) {
          setUserFromStore({
            userInfos: data,
            userActivity: activity,
            userPerformances: performances,
            userAverage: averageSession
          });
        }
      }
    };
    getUserFromStore();

    if (status === 'failed') {
      setIsChecked(false);
    }

    return () => {};
  }, [dataSource, dispatch, users.apiUser, users.localUser, status, setIsChecked]);

  const handleSwitch = () => {
    setIsChecked(!isChecked);
    dispatch(switchDataSource());
  }

  const renderContent = () => (
    <>
    {userFromStore ? (
      <>
        <div className="dashboard__header">
          <div className="resume">
            <div className="infos">
              <h1>
                Bonjour 
                <span className="name"> 
                  {userFromStore.userInfos.userInfos.firstName}
                </span>
              </h1>
            </div>
            <p>Félicitations ! Vous avez explosé vos objectifs hier 👏</p>
          </div>
          <div className="switch">
            <input type="checkbox" id="switch" checked={isChecked} onChange={handleSwitch}/>
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
      </>) : null}
    </>
  );

  if (status === 'loading') {
    return (
      <div className="dashboard">
        <div className="loading"></div>
        <div className="dashboard-background"></div>
        {renderContent()}
      </div>
    );
  }

  if (status === 'failed') {
    console.log('erreur');
    return (
      <div className="dashboard">
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="dashboard">
      {users && userFromStore ? renderContent() : <div>Les données de l'utilisateur ne sont pas disponibles pour le moment.</div>}
    </div>
  );
}