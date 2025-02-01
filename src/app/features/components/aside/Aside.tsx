import './Aside.scss';

export default function Aside() {
  interface MenuIcons {
    id: number;
    title: string;
    icon: string;
  }

  const menuAside: Array<MenuIcons> = [
    {
      id: 0,
      title: 'yoga',
      icon: '/public/icons/yoga-icon.png'
    },
    {
      id: 1,
      title: 'swim',
      icon: '/public/icons/swim-icon.png'
    },
    {
      id: 2,
      title: 'velo',
      icon: '/public/icons/velo-icon.png'
    },
    {
      id: 3,
      title: 'alter',
      icon: '/public/icons/alter-icon.png'
    },
  ]
  return (
    <div className='sideNav'>
      <div className="sideNav__menu">
        <ul className='sideNav__menu--list'>
          {menuAside.map((icon: MenuIcons) => (
            <li key={icon.id} className='sideNav__menu--list-icon'>
              <img src={icon.icon} alt={icon.title} className='sideNav__menu--list-img'/>
            </li>
          ))}
        </ul>
      </div>
      <div className="sideNav__legal">
        <span className='sideNav__legal--text'>Copyrights, SportSee 2020</span>
      </div>
    </div>
  )
}
