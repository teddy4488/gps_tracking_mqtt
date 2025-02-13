import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // Ensure Leaflet icons work
import io from "socket.io-client";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png"; // Webpack handles the import
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Fix for missing Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Component to update the map view dynamically
const UpdateMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const DroneTrackingMap = () => {
  const [dronePosition, setDronePosition] = useState(null); // Current position
  const [dronePath, setDronePath] = useState([]); // History of positions
  const [gpsInfo, setGpsInfo] = useState({ time: "Unknown" }); // Date and time from GPS data

  useEffect(() => {
    const socket = io("http://localhost:5000"); // Backend server address

    // Listen for GPS data
    socket.on("gps-data", (data) => {
      console.log("Received GPS data:", data);

      if (data.latitude !== undefined && data.longitude !== undefined) {
        const newPosition = [data.latitude, data.longitude];

        setDronePosition(newPosition);
        setDronePath((prevPath) => [...prevPath, newPosition]);

        setGpsInfo({
          time: data.time || "Unknown", // Ensure time is not undefined
        });
      }
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  if (!dronePosition) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading map and GPS data...</p>
      </div>
    ); // Show until GPS data is received
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      {/* GPS Information Display */}
      <div className="w-full max-w-md rounded bg-gray-100 p-4 text-center shadow">
        <h2 className="text-lg font-bold">Drone GPS Information</h2>
        <p>
          <strong>Date:</strong> {gpsInfo.date}
        </p>
        <p>
          <strong>Time:</strong> {gpsInfo.time}
        </p>
        <p>
          <strong>Current Position:</strong> Lat: {dronePosition[0]}, Lng:{" "}
          {dronePosition[1]}
        </p>
      </div>

      {/* Map Display */}
      <MapContainer
        center={dronePosition}
        zoom={15}
        style={{ height: "500px", width: "100%" }}
        className="rounded shadow"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <UpdateMapView center={dronePosition} />
        <Marker position={dronePosition} />
        <Polyline positions={dronePath} color="blue" />
      </MapContainer>
    </div>
  );
};

export default DroneTrackingMap;
