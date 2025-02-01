import React from "react";
import "./Home.scss";
import { useSelector } from "react-redux";
import { selectUsers } from "../../../core/selectors";
import { UserData } from "../../../core/interfaces/user-infos.interface";
import { Link } from "react-router-dom";

export default function Home() {
  const users = useSelector(selectUsers);

  return (
    <div className="home">
      <div className="home__welcome">Veuillez sélectionner un utilisateur</div>
      <div className="home__button__list">
        {users.localAllData.data
          ? users.localAllData.data.map((user: UserData) => (
              <Link to={`/dashboard/${user.id}`} key={user.id} className="link">
                <div className="home__button">
                  <span className="home__button--text">
                    Profil de {user.userInfos.firstName}
                  </span>
                </div>
              </Link>
            ))
          : null}
      </div>
    </div>
  );
}
