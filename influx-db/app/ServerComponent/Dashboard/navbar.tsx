import React from "react";

const NavBar = () => {
  return (
    <header className="bg-[#1D191A] p-4 md:p-6 text-white flex flex-row justify-between items-center">
      <div className="flex items-center justify-center md:justify-start mb-0 md:mb-0">
        <div className="flex items-center">
          <span className="text-[#989797] text-sm font-sans tracking-wide">Home</span>
          <span className="text-[#989797] text-sm mx-2 font-sans tracking-wide">&gt;</span>
          <span className="text-[#E9E8E8] text-sm font-sans tracking-wide">SEP-PG3</span>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
