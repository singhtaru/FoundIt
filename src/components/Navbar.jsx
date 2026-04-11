import { useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logoMark from '../assets/logo-mark.svg';
import { clearSession, getStoredUser, hasMemberAccess, isGuestUser } from '../services/session';

const navLinks = [
  { label: 'Home', path: '/home' },
  { label: 'Search Items', path: '/search' },
  { label: 'Report Found Item', path: '/report' },
];

function Navbar({ admin = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const activeLink = admin ? '/admin' : location.pathname;
  const user = useMemo(() => getStoredUser(), [location.pathname]);
  const guestUser = isGuestUser();
  const memberAccess = hasMemberAccess();

  return (
    <header className="topbar">
      <div className="brand">
        <img src={logoMark} alt="FoundIt VIT" />
        <div>
          <span>FoundIt</span>
          {!admin && <small>VIT</small>}
        </div>
      </div>

      {!admin && (
        <>
          <button
            className={`menu-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
          <nav className={`topnav ${menuOpen ? 'show' : ''}`}>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive || activeLink === link.path ? 'active' : ''
                }
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </>
      )}

      <div className="avatar-chip">
        {user?.name ? <span>{guestUser ? 'G' : user.name.charAt(0).toUpperCase()}</span> : (
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21M16 8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {!admin && (
        <div className="session-chip">
          <strong>{guestUser ? 'Guest User' : user?.name || 'Visitor'}</strong>
          <span>{memberAccess ? 'Member access' : 'Browse only'}</span>
          {user && (
            <button
              type="button"
              className="session-action"
              onClick={() => {
                clearSession();
                window.location.href = '/auth';
              }}
            >
              {guestUser ? 'Sign in' : 'Logout'}
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
