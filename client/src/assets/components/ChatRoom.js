import React, { useState } from "react";
import Genchatnav from "./Genchatnav";
import Genchatmain from "./Genchatmain";
import "../css/Genchat.css";
export default function Genchat() {
  const [isNavOpen, setIsNavOpen] = useState(true);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="genchat">
      <div className="genchat__mains">
        <Genchatmain />
      </div>
      {isNavOpen ? (
        <>
          <div className="include__button--open">
            <button onClick={toggleNav}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          <div className="genchat__nav">
            <Genchatnav />
          </div>
        </>
      ) : (
        <div className="include__button--close">
          <button onClick={toggleNav}>
            <i class="fas fa-chevron-left"></i>
          </button>
        </div>
      )}
    </div>
  );
}
