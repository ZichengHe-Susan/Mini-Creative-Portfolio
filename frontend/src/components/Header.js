import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Creative Portfolio
        </Link>
        <nav className="nav-links">
          <NavLink to="/" className="nav-link" end>
            Home
          </NavLink>
          <NavLink to="/create" className="nav-link">
            Create Profile
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header; 