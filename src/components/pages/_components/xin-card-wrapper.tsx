import React from "react";
import XinCard from "./xin-card";

const XinCardWrapper = () => {
  return (
    <>
      <XinCard title="年收入" value="20000" />
      <XinCard title="月收入" value="2000" />
      <XinCard title="总维修数" value="300" />
      <XinCard title="月维修" value="50" />
    </>
  );
};

export default XinCardWrapper;
