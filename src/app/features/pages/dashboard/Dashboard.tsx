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
import { UserData } from "../../../core/interfaces/user-infos.interface";
import { UserAverageSession } from "../../../core/interfaces/user-average";
import { UserActivity } from "../../../core/interfaces/user-activity";
import { UserPerformances } from "../../../core/interfaces/user-performance";
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

    if (!users.localAllData && !isLocalFetched) {
      setIsLocalFetched(true);
      dispatch(fetchLocalUserAllData());
    }

    if (userId && !isApiFetched && isChecked) {
      dispatch(fetchApiUserAllData(userId));
    }

    const getUserFromStore = () => {
      const localUserWithUserId: User = {
        data: users.localAllData.data
          ? users.localAllData.data.filter(
              (user: UserData) => user.id.toString() === userId
            )[0]
          : [],
        userAverage: users.localAllData.averageSession
          ? users.localAllData.averageSession.filter(
              (user: UserAverageSession) => user.userId.toString() === userId
            )[0]
          : [],
        userActivity: users.localAllData.activity
          ? users.localAllData.activity.filter(
              (user: UserActivity) => user.userId.toString() === userId
            )[0]
          : [],
        userPerformances: users.localAllData.performances
          ? users.localAllData.performances.filter(
              (user: UserPerformances) => user.userId.toString() === userId
            )[0]
          : [],
      };

      const user: User =
        dataSource === "local" ? localUserWithUserId : users.apiAllData;

      if (
        user &&
        user.data &&
        user.userAverage &&
        user.userAverage &&
        user.userPerformances
      ) {
        setUserFromStore({
          userAverage: Array.isArray(user.userAverage)
            ? user.userAverage
            : [user.userAverage],
          userActivity: Array.isArray(user.userActivity)
            ? user.userActivity
            : [user.userActivity],
          userPerformances: Array.isArray(user.userPerformances)
            ? user.userPerformances
            : [user.userPerformances],
          data: Array.isArray(user.data) ? user.data : [user.data],
        });
      }
    };
    if (status === "succeeded") {
      if (dataSource === "api" && !isApiFetched) {
        setIsApiFetched(true);
      } else if (dataSource === "local" && !isLocalFetched) {
        setIsLocalFetched(true);
      }

      getUserFromStore();
    }

    if (status === "failed") {
      if (dataSource === "api") {
        setIsApiFetched(false);
        dispatch(switchDataSource());
      } else if (dataSource === "local") {
        setIsLocalFetched(false);
      }
      setIsChecked(false);
    }

    return () => {};
  }, [
    dataSource,
    users.localAllData,
    users.apiAllData,
    isApiFetched,
    isLocalFetched,
    status,
    dispatch,
    isChecked,
    params.userId,
  ]);

  const handleSwitch = () => {
    setIsChecked(!isChecked);
    dispatch(switchDataSource());
    setIsApiFetched(false);
    setIsLocalFetched(false);
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
                    {userFromStore.data[0].userInfos.firstName}
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
              <Card userKeyData={userFromStore.data[0].keyData} />
            </div>
            <div className="activity">
              <ActivityGraph user={userFromStore.userActivity[0]} />
            </div>
            <div className="graphic-squares">
              <div className="average-sessions">
                <AverageSessions user={userFromStore.userAverage[0]} />
              </div>
              <div className="performances">
                <Performances user={userFromStore.userPerformances[0]} />
              </div>
              <div className="score">
                <Score user={userFromStore.data[0].todayScore} />
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
      {users && userFromStore ? (
        renderContent()
      ) : (
        <div className="error-message">
          Les données de l'utilisateur ne sont pas disponibles pour le moment.
        </div>
      )}
    </div>
  );
}
