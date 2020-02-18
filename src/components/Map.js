import React, { useRef, useState, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import Header from './Header'
import 'mapbox-gl/dist/mapbox-gl.css'
import '../styles/Map.css'

const Map = () => {
  const [userLocation, setUserLocation] = useState({})
  const [locations, setLocations] = useState([])
  const [mapOpts, setMapOpts] = useState({ lng: -3.7034, lat: 40.4169, zoom: 15 })
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  const initializeMap = ({ setMap, mapContainer }) => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [
        userLocation.lng ? userLocation.lng : mapOpts.lng, 
        userLocation.lat ? userLocation.lat : mapOpts.lat
      ],
      zoom: mapOpts.zoom,
      "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf"
    });

    map.on("load", () => {
      setMap(map);
      map.resize();
    });
    
    map.addControl(new mapboxgl.NavigationControl())
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((el) => {
      setUserLocation({lng: el.coords.longitude, lat: el.coords.latitude})
    })

    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

    if (!map) initializeMap({ setMap, mapContainer })
    else {
      map.on('move', () => {
        setMapOpts({
          lng: map.getCenter().lng.toFixed(4),
          lat: map.getCenter().lat.toFixed(4),
          zoom: map.getZoom().toFixed(2)
        });
      });

      map.on("click", (e) => {
        setLocations([...locations, e.lngLat])
      })
    }

    if (map && userLocation.lng && userLocation.lat) {
      setMapOpts({
        lng: userLocation.lng.toFixed(4),
        lat: userLocation.lat.toFixed(4),
        zoom: mapOpts.zoom
      })
    }
  }, [map, mapOpts.lng, mapOpts.lat, mapOpts.zoom, locations]);

  

  return (
    <div className="Map">
      <Header />
      <div ref={mapContainer} className="mapbox"/>
    </div>
  )
}

export default Map
