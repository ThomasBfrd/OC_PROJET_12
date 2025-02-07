import "./Home.scss";
import { Link } from "react-router-dom";

export default function Home() {

  return (
    <div className="home">
      <div className="home__welcome">Veuillez sélectionner un utilisateur</div>
      <div className="home__button__list">

              <Link to={`/dashboard/12`}className="link">
                <div className="home__button">
                  <span className="home__button--text">
                    Profil de Karl                  
                    </span>
                </div>
              </Link>
              <Link to={`/dashboard/18`}className="link">
                <div className="home__button">
                  <span className="home__button--text">
                    Profil de Cécilia                  
                    </span>
                </div>
              </Link>
      </div>
    </div>
  );
}
