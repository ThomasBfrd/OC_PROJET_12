import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDataSource,
  selectStatus,
  selectUsers,
} from "../../../core/selectors";
import ActivityGraph from "../../components/activity/ActivityGraph";
import "./Dashboard.scss";
import Score from "../../components/score/Score";
import Performances from "../../components/performances/Performances";
import Card from "../../components/card/Card";
import AverageSessions from "../../components/average-sessions/AverageSessions";
import {
  fetchApiUserAllData,
  fetchLocalUserAllData,
  switchDataSource,
} from "../../../core/userSlice";
import { User } from "../../../core/interfaces/user";
import { useParams } from "react-router";
import { AppDispatch } from "../../../core/types/store-types";

export default function Dashboard() {
  const params = useParams();
  const dispatch: AppDispatch = useDispatch();
  const users = useSelector(selectUsers);
  const dataSource = useSelector(selectDataSource);
  const status = useSelector(selectStatus);
  const [userFromStore, setUserFromStore] = useState<User>();
  const [isChecked, setIsChecked] = useState(false);
  const [isApiFetched, setIsApiFetched] = useState(false);
  const [isLocalFetched, setIsLocalFetched] = useState(false);

  useEffect(() => {
    const userId = params.userId;


    if (userId && !isApiFetched && isChecked) {
      dispatch(fetchApiUserAllData(userId));
    }

    const getUserFromStore = () => {

      const user: User =
        dataSource === "local" ? users.localAllData : users.apiAllData;

      if (
        user &&
        user.data &&
        user.averageSession &&
        user.activity &&
        user.performances
      ) {

        setUserFromStore({
          averageSession: user.averageSession,
          activity: user.activity,
          performances: user.performances,
          data: user.data,
        });
      }
    };

    if (
      userId &&
      users.localAllData &&
      dataSource === "local" &&
      !isLocalFetched
    ) {
      dispatch(fetchLocalUserAllData(userId));
    }

    if (status === "succeeded" && !isLocalFetched || !isApiFetched) {
      if (dataSource === "api" && !isApiFetched) {
        setIsApiFetched(true);
      } else if (dataSource === "local" && !isLocalFetched) {
        setIsLocalFetched(true);
      }

      getUserFromStore();
    }

    if (status === "failed") {
      
      if (dataSource === "api") {
        setIsApiFetched(true);
        dispatch(switchDataSource());
        setIsChecked(false);
      } else if (dataSource === "local") {
        console.log('données non récupérées');
        setIsLocalFetched(true);
      }
    }

    return () => {};
  }, [
    dataSource,
    isApiFetched,
    isChecked,
    isLocalFetched,
    params.userId,
    status
  ]);

  const handleSwitch = () => {
    setIsChecked(!isChecked);
    dispatch(switchDataSource());
  };

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
                    {userFromStore.data.userInfos.firstName}
                    <span className="datasource">
                      (données {dataSource === "local" ? "locales" : "API"})
                    </span>
                  </span>
                </h1>
              </div>
              <p>Félicitations ! Vous avez explosé vos objectifs hier 👏</p>
            </div>
            <div className="switch">
              <input
                type="checkbox"
                id="switch"
                checked={isChecked}
                onChange={handleSwitch}
              />
              <label htmlFor="switch"></label>
              Données {dataSource === "local" ? "locales" : "API"}
            </div>
          </div>
          <div className="ladderboard">
            <div className="cards">
              <Card userKeyData={userFromStore.data.keyData} />
            </div>
            <div className="activity">
              <ActivityGraph user={userFromStore.activity} />
            </div>
            <div className="graphic-squares">
              <div className="average-sessions">
                <AverageSessions user={userFromStore.averageSession} />
              </div>
              <div className="performances">
                <Performances user={userFromStore.performances} />
              </div>
              <div className="score">
                <Score user={userFromStore.data.todayScore} />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );

  if (status === "loading") {
    return (
      <div className="dashboard">
        <div className="loading"></div>
        <div className="dashboard-background"></div>
        {renderContent()}
      </div>
    );
  }

  if (dataSource === "api" && status === "failed") {
    return (
      <div className="dashboard">
        <div className="error__toast">
          <div className="error__toast-text">
            Une erreur s'est produite lors de la récupération des données
          </div>
        </div>
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="dashboard">
      {users && userFromStore? (
        renderContent()
      ) : (
        <div className="error-message">
          Les données de l'utilisateur ne sont pas disponibles pour le moment.
        </div>
      )}
    </div>
  );
}
