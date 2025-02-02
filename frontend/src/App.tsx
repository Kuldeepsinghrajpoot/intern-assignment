import { Navigation } from 'lucide-react';
import React, { useState } from 'react';
import Home from './chart';

function App() {
  const navbar = [
    {
      name: 'Home',
      url: '/'
    },
    {
      name: 'About',
      url: '/about'
    },
    {
      name: 'Services',
      url: '/services'
    },
    {
      name: 'Contact',
      url: '/contact'
    },
    {
      name: 'Login',
      url: '/login'
    }
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    
    <>
    <nav className="  border-b  py-4 px-10 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section (Optional) */}
        <div className=" font-sans  text-2xl font-medium text-gray-700">
         Stock EXCHANGE
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className=" lg:hidden"
        >
          <Navigation/>
        </button>

        {/* Navbar Links */}
        <ul
          className={`lg:flex ${isOpen ? 'flex' : 'hidden'} space-x-10 items-center`}
        >
          {navbar.map((item, index) => (
            <li key={index}>
              <a
                href={item.url}
                className=" font-sans  text-gray-700  text-base    font-medium"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
    {/* <StockComponent/> */}
    <Home/>
    </>
  );
}

export default App;
