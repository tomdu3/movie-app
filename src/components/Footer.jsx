import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook text-2xl hover:text-gray-400"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-x-twitter text-2xl hover:text-gray-400"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram text-2xl hover:text-gray-400"></i>
          </a>
        </div>
        <div className="text-center text-gray-400">
          &copy; {new Date().getFullYear()} Tom's Movie DB. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;