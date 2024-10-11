import { useState } from "react";

const NavTime = ({ handleClick }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ul className="nav justify-content-center mb-4 gap-5 d-flex align-items-center m-auto">
      <li className="nav-item">
        <button
          className={`btn-nav ${
            activeTab === 0 ? "text-accent fs-5 fw-bold" : "text-light"
          }`}
          onClick={() => {
            handleClick(0);
            setActiveTab(0);
          }}
        >
          4 weeks
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`btn-nav ${
            activeTab === 1 ? "text-accent fs-5 fw-bold" : "text-light"
          }`}
          onClick={() => {
            handleClick(1);
            setActiveTab(1);
          }}
        >
          6 Months
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`btn-nav ${
            activeTab === 2 ? "text-accent fs-5 fw-bold" : "text-light"
          }`}
          onClick={() => {
            handleClick(2);
            setActiveTab(2);
          }}
        >
          1 Year
        </button>
      </li>
    </ul>
  );
};

export default NavTime;
