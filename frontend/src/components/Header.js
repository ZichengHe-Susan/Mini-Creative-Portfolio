import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="App-header">
      <nav>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>
          Creative Portfolio
        </Link>
        <Link to="/create" style={{ color: 'white', textDecoration: 'none' }}>
          Create Profile
        </Link>
      </nav>
    </header>
  );
};

export default Header; 