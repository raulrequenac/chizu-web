import React, { useRef, useState, useEffect, useContext } from 'react'
import mapboxServices from '../services/MapboxServices'
import LocationsContext from '../contexts/LocationsContext'
import mapboxgl from 'mapbox-gl'
import Header from './Header'
import 'mapbox-gl/dist/mapbox-gl.css'
import '../styles/Map.css'
import pulsingDot from '../constants'
import { Redirect } from 'react-router-dom'
import queryString from 'query-string'

const Map = () => {
  const { locations, setLocations } = useContext(LocationsContext)
  const [userLocation, setUserLocation] = useState(null)
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const [marker, setMarker] = useState(null)
  const [markerLocation, setMarkerLocation] = useState({})
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

  // useEffect(() => {
  //   if (map && parse.bestPath) {
  //     mapboxServices.directions(parse.bestPath)
  //       .then(response => {
  //         let geojson = {
  //           type: 'Feature',
  //           properties: {},
  //           geometry: {
  //             type: 'LineString',
  //             coordinates: response.data.routes[0].geometry.coordinates
  //           }
  //         }
  //         if (map.getSource('route')) {
  //           map.getSource('route').setData(geojson);
  //         } else { // otherwise, make a new request
  //           map.addLayer({
  //             id: 'route',
  //             type: 'line',
  //             source: {
  //               type: 'geojson',
  //               data: {
  //                 type: 'Feature',
  //                 properties: {},
  //                 geometry: {
  //                   type: 'LineString',
  //                   coordinates: geojson
  //                 }
  //               }
  //             },
  //             layout: {
  //               'line-join': 'round',
  //               'line-cap': 'round'
  //             },
  //             paint: {
  //               'line-color': '#3887be',
  //               'line-width': 5,
  //               'line-opacity': 0.75
  //             }
  //           });
  //         }
  //       })
  //   }
  // }, [map, parse])

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

  return (
    <div className="Map">
      {redirect ? <Redirect to='/locations'/> :
        <div>
          <Header />
          <div ref={mapContainer} className="mapbox"/>
          {marker ? <div className="info">
            <button className="btn btn-primary" onClick={handleOnClick}>Aceptar</button>
          </div> : <></>}
        </div>
      }
    </div>
  )
}

export default Map
