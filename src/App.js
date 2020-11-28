import "./App.css";
import React from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "70vw",
  height: "85vh",
};

function App() {
  const [marks, setMarks] = React.useState([]);
  const [center, setCenter] = React.useState({
    lat: -26.801643,
    lng: -48.61768,
  });
  const [zoom, setZoom] = React.useState(6);
  React.useEffect(() => {
    axios.get("https://api-blog-pos.herokuapp.com/markers").then((result) => {
      setMarks(result.data);
    });
  }, []);

  return (
    <div className="map-wrapper">
      <div className="Menu-container">
        <span>Geo Mark</span>
      </div>
      <div className="map-container">
        <LoadScript googleMapsApiKey="AIzaSyAjcm9BJuYGywj6MfMI1wT94rACWDibSrA">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            onClick={(e) => {
              axios
                .post("https://api-blog-pos.herokuapp.com/marker", {
                  lat: e.latLng.lat(),
                  lon: e.latLng.lng(),
                })
                .then((result) => {
                  setMarks([...marks, result.data]);
                });
            }}
            // onClick={Marker}
          >
            {/* Child components, such as markers, info windows, etc. */}
            <>
              {marks.map((mark) => (
                <Marker
                  position={{
                    lat: parseFloat(mark.lat),
                    lng: parseFloat(mark.lon),
                  }}
                ></Marker>
              ))}
            </>
          </GoogleMap>
        </LoadScript>
        <div className="side-container">
          <button
            className="button-delete"
            onClick={() => {
              marks.map((mark) => {
                axios.delete(
                  `https://api-blog-pos.herokuapp.com/marker/${mark._id}`
                );
                axios
                  .get("https://api-blog-pos.herokuapp.com/markers")
                  .then((result) => {
                    setMarks(result.data);
                  });
              });
            }}
          >
            Apagar todos
          </button>
          <div className="container-chat">
            {marks.map((mark) => {
              return (
                <div
                  className="container-values"
                  onClick={() => {
                    setCenter({
                      lat: parseFloat(mark.lat),
                      lng: parseFloat(mark.lon),
                    });
                    setZoom(16);
                  }}
                >
                  <span>Lat: {mark.lat}</span> <span>Lon: {mark.lon}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
