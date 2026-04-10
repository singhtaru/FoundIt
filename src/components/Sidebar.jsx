import { NavLink } from 'react-router-dom';
import { adminMenu } from '../assets/mockData';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-links">
        {adminMenu.map((item) => (
          <NavLink
            key={`${item.label}-${item.path}`}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <div className="sidebar-profile">
        <div className="avatar-chip large">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21M16 8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <strong>Admin</strong>
          <span>Admin Panel</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
