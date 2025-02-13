import React, { useState, useEffect } from "react";
import MapComponent from "./DroneTrackingMap";

const AnimatedMarker = () => {
  const [markerPosition, setMarkerPosition] = useState([51.505, -0.09]); // Initial position (London)
  const [updateInterval, setUpdateInterval] = useState(1000); // Update every second

  useEffect(() => {
    const updateMarker = () => {
      // Update logic for coordinates (replace with your desired logic)
      const newLatitude = markerPosition[0] + 0.001; // Increment latitude
      const newLongitude = markerPosition[1] + 0.002; // Increment longitude

      setMarkerPosition([newLatitude, newLongitude]);
    };

    const intervalId = setInterval(updateMarker, updateInterval);

    return () => clearInterval(intervalId); // Cleanup function to stop interval on unmount
  }, [markerPosition, updateInterval]);

  return (
    <div>
      <MapComponent markerPosition={markerPosition} />
      {/* Optional controls for update interval */}
      {/* <button onClick={() => setUpdateInterval(updateInterval * 2)}>Slow Down</button>
      <button onClick={() => setUpdateInterval(updateInterval / 2)}>Speed Up</button> */}
    </div>
  );
};

export default AnimatedMarker;
