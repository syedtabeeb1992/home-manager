import React, { useState } from "react";
import { FormControlLabel, Switch } from "@mui/material";
import "../../styles/global.css";
const RadioSelector = ({ isVegSelected, setIsVegSelected, isNonVegSelected, setIsNonVegSelected }) => {
  const handleVegChange = (event) => {
    setIsVegSelected(event.target.checked);
  };

  const handleNonVegChange = (event) => {
    setIsNonVegSelected(event.target.checked);
  };

  return (
    <div className="padding-univarsal">
      <FormControlLabel
        control={<Switch checked={isVegSelected} onChange={handleVegChange} />}
        label="Veg"
      />
      <FormControlLabel
        control={
          <Switch checked={isNonVegSelected} onChange={handleNonVegChange} />
        }
        label="Non-Veg"
      />
    </div>
  );
};

export default RadioSelector;
