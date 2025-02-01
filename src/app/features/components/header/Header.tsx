import { Link } from 'react-router-dom';
import './Header.scss';

export default function Header() {
  return (
    <div className='header__menu'>
      <div className="header__menu-logo">
        <Link to={'/home'}>
          <img src="/public/logo.png" alt="logo" className='header__menu-img'/>
        </Link>
      </div>
      <div className="header__menu-nav">
        <ul className="header__menu-nav-urls">
          <Link to={'/home'} className='link'>
            <li className='header__menu-nav-url'>Accueil</li>
          </Link>
          <li className='header__menu-nav-url'>Profil</li>
          <li className='header__menu-nav-url'>Réglage</li>
          <li className='header__menu-nav-url'>Communauté</li>
        </ul>
      </div>
    </div>
  )
}
