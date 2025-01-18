import { useState } from "react";

const NavTime = ({ handleClick }) => {
  const [selectedDuration, setSelectedDuration] = useState("4 Weeks");

  const handleSelect = (value, label) => {
    handleClick(value);
    setSelectedDuration(label);
  };

  return (
    <div className="dropdown mx-auto px-3 mb-3">
      <button
        className="btn signIn text-light fw-semibold rounded-pill dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {selectedDuration}
      </button>
      <ul
        className="dropdown-menu dropdown-menu-dark"
        aria-labelledby="dropdownMenuButton"
      >
        <li>
          <button
            className="dropdown-item"
            onClick={() => handleSelect(0, "4 Weeks")}
          >
            4 Weeks
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            onClick={() => handleSelect(1, "6 Months")}
          >
            6 Months
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            onClick={() => handleSelect(2, "1 Year")}
          >
            1 Year
          </button>
        </li>
      </ul>
    </div>
  );
};

export default NavTime;
