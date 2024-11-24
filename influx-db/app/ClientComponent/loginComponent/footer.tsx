import React from 'react'

const Footer = () => {
    return (
      <footer className="bg-[#171415] p-4 md:p-6 text-white flex justify-between items-center mt-4">
        <div className="text-sm font-light text-left tracking-wide">
          <p>&copy; {new Date().getFullYear()} ATSYS all rights reserved</p>
        </div>
        <div className="text-right">
          <a href="/main" className="hover:underline mx-2 text-sm font-light tracking-wide">Privacy Policy</a>
          <a href="/main" className="hover:underline mx-2 text-sm font-light tracking-wide">Terms of Service</a>
        </div>
      </footer>
    );
  };

export default Footer