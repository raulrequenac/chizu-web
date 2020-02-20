import React, { useRef, useState, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import Header from './Header'
import 'mapbox-gl/dist/mapbox-gl.css'
import '../styles/Map.css'
import pulsingDot from '../constants'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

const Map = () => {
  const [userLocation, setUserLocation] = useState(null)
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const [marker, setMarker] = useState(null)
  const index = queryString.parse(window.location.search).index

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((el) => {
      setUserLocation({lng: el.coords.longitude, lat: el.coords.latitude})
    }, )
  }, [])

  useEffect(() => {
    if (!map) {
      mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
      
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [
          userLocation ? userLocation.lng : -3.7034, 
          userLocation ? userLocation.lat : 40.4169
        ],
        zoom: userLocation ? 13 : 0,
        "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf"
      }); 
  
      map.on("load", () => {
        if (userLocation) {
          map.addImage('pulsing-dot', pulsingDot(map), { pixelRatio: 2 });
          map.addSource('user', {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': [{
                'type': 'Feature',
                'geometry': {
                  'type': 'Point',
                  'coordinates': [
                    userLocation.lng, 
                    userLocation.lat
                  ]
                }
              }]
            }
          });
          map.addLayer({
            'id': 'user',
            'type': 'symbol',
            'source': 'user',
            'layout': {
              'icon-image': 'pulsing-dot'
            }
          });
        }
        setMap(map);
        map.resize();
      });
      
      map.addControl(new mapboxgl.NavigationControl())
    }
  }, [map, userLocation])

  useEffect(() => {
    if (map) {
      map.on("mousedown", (e) => {
        if (marker) marker.remove()
        let el = document.createElement('div');
        el.className = 'marker';
        setMarker(new mapboxgl.Marker(el)
          .setOffset({x: 0, y: 22})
          .setLngLat(e.lngLat)
          .addTo(map))
      })

      if (marker) {
        map.flyTo({
          center: [
            marker.getLngLat().lng.toFixed(4),
            marker.getLngLat().lat.toFixed(4),
          ]
        })
      }
    }
  }, [map, marker, userLocation]);

  return (
    <div className="Map">
      <Header />
      <div ref={mapContainer} className="mapbox"/>
      {marker ? <div className="info">
        <Link to={`/locations?lng=${marker.getLngLat().lng}&lat=${marker.getLngLat().lat}&index=${index}`}></Link>
      </div> : <></>}
    </div>
  )
}

export default Map
