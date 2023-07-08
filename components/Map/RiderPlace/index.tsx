import React from "react";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";

const Marker = () => {
  const bikeStyle = {
    height: 30,
    width: 30,
    cursor: "pointer",
    zIndex: 10,
  };

  return (
    <>
      <div>
        <DirectionsBikeIcon style={bikeStyle} />
      </div>
      {/* {show && <InfoWindow rider={rider} />} */}
    </>
  );
};

export default Marker;
