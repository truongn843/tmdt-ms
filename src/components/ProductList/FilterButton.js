import React from "react";

function FilterButton(props) {
  const data = props.data;
  return (
    <div>
      <select className="select">
        {data.map((item, index) => (
          <option className="option" key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterButton;
