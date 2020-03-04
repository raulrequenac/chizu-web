import React, { useRef, useState, useEffect, useContext } from 'react'
import mapboxServices from '../services/MapboxServices'
import LocationsContext from '../contexts/LocationsContext'
import mapboxgl from 'mapbox-gl'
import Header from './Header'
import 'mapbox-gl/dist/mapbox-gl.css'
import '../styles/Map.css'
import { Redirect } from 'react-router-dom'
import queryString from 'query-string'

const Map = () => {
  const { locations, setLocations } = useContext(LocationsContext)
  const [userLocation, setUserLocation] = useState(null)
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const [marker, setMarker] = useState(null)
  const [markerLocation, setMarkerLocation] = useState(null)
  const [redirect, setRedirect] = useState(false)
  const parse = queryString.parse(window.location.search)

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
        if (parse.bestPath) {
          mapboxServices.directions(parse.bestPath)
            .then(response => {
              const points = response.data.routes[0].geometry.coordinates
              map.flyTo({
                center: points[Math.floor(points.length/2-1)],
                zoom: 6
              })
              map.addSource('route', {
                'type': 'geojson',
                'data': {
                  'type': 'Feature',
                  'properties': {},
                  'geometry': {
                    'type': 'LineString',
                    'coordinates': points
                  }
                }
              });
              map.addLayer({
                  'id': 'route',
                  'type': 'line',
                  'source': 'route',
                  'layout': {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                'paint': {
                  'line-color': '#A52A2A',
                  'line-width': 8
                }
              });
            })
          const bestPathCoords = parse.bestPath.split(';').map(loc => loc.split(','))
          bestPathCoords.map((coord, i) => {
            let el = document.createElement('div');
            el.className = 'marker';
            new mapboxgl.Marker(el)
              .setOffset({x: 0, y: 22})
              .setLngLat(coord)
              .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
              .setHTML('<h3>' + String.fromCharCode(i+65) + '</h3>'))
              .addTo(map)
            return coord
          })
        }
        setMap(map);
        map.resize();
      });
      
      map.addControl(new mapboxgl.NavigationControl())
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        })
      );
    }
  }, [map, userLocation, parse])

  useEffect(() => {
    if (map && !parse.bestPath) {
      map.on("mousedown", (e) => {
        if (marker) marker.remove()
        let el = document.createElement('div');
        el.className = 'marker';
        setMarker(new mapboxgl.Marker(el)
          .setOffset({x: 0, y: 22})
          .setLngLat(e.lngLat)
          .addTo(map))
      })
    }
  }, [map, marker, userLocation, parse]);

  useEffect(() => {
    if (marker) {
      map.flyTo({
        center: [
          marker.getLngLat().lng.toFixed(4),
          marker.getLngLat().lat.toFixed(4),
        ]
      })
      mapboxServices.searchByCoords(marker.getLngLat())
        .then(response => {
          const feature = response.data.features[0]
          setMarkerLocation({
            value: feature.id,
            label: feature.place_name,
            coordinates: feature.geometry.coordinates
          })
        })
    }
  }, [map, marker])

  const handleOnClick = () => {
    const newLocations = [...locations]
    if (parse.index) newLocations[parse.index] = markerLocation
    setLocations(newLocations)

    setRedirect(true)
  }

  const showAcceptButton = () => {
    if (markerLocation) {
      const street = markerLocation.label.split(',')[0]
      const city = markerLocation.label.split(',').slice(1)
      return (
        <div className="info">
          <h1 className="info-street">{street}</h1>
          <h2 className="info-city">{city}</h2>
          <div className="accept">
            <button className="accept-button" onClick={handleOnClick}>Aceptar</button>
          </div>
        </div>
      )
    }
  }

  if (redirect) return <Redirect to='/locations'/>

  return (
    <div className="Map">
        <div>
          <Header />
          <div ref={mapContainer} className="mapbox"/>
          {showAcceptButton()}
        </div>
    </div>
  )
}

export default Map
