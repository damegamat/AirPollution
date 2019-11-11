import React from "react";
import City from "./City";
import "../styles/css/CityList.css";

const CityList = props => {
  const city = props.cities.map(name => <City key={name} name={name} />);
  return (
    <div className="City">
      <ul className="City__list-item">{city}</ul>
    </div>
  );
};

export default CityList;
