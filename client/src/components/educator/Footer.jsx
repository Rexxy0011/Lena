import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 py-4 px-6 text-center text-xs text-gray-400">
      © {new Date().getFullYear()} Lena. All rights reserved.
    </footer>
  );
};

export default Footer;
