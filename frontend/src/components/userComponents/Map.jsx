import { useEffect, useRef, useState } from 'react';
import H from '@here/maps-api-for-javascript';

const Map = ({ latitude, longitude }) => {
  const mapRef = useRef(null);
  const map = useRef(null);
  const platform = useRef(null);
  const [showMap, setShowMap] = useState(false);
  const [error, setError] = useState(null);
  const apiKey = import.meta.env.VITE_HERE_MAP_API_KEY;

  useEffect(() => {
    setTimeout(() => {
      setShowMap(true);
    }, 1000);

    if (showMap) {
      try {
        calculateRoute(platform.current, map.current, { lat: latitude, lng: longitude }, { lat: latitude, lng: longitude });
      } catch (error) {
        setError(error);
      }
    }

    function calculateRoute(platform, map, start, destination) {
      function routeResponseHandler(response) {
        map.addObjects([
          new H.map.Marker(start, {
            icon: getMarkerIcon('black')
          }),
        ]);
      }

      const router = platform.getRoutingService(null, 8);

      const routingParams = {
        'origin': `${start.lat},${start.lng}`,
        'destination': `${destination.lat},${destination.lng}`,
        'transportMode': 'car',
        'return': 'polyline'
      };

      router.calculateRoute(routingParams, routeResponseHandler, console.error);
    }

    function getMarkerIcon(color) {
      const svgCircle = `<svg width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g id="marker">
          <circle cx="10" cy="10" r="7" fill="${color}" stroke="${color}" stroke-width="4" />
          <circle cx="10" cy="10" r="4" fill="white" />
          <polygon points="10,3 6,14 14,14" fill="red" />
        </g>
      </svg>`;
      return new H.map.Icon(svgCircle, {
        anchor: {
          x: 10,
          y: 10
        }
      });
    }

    if (!map.current) {
      platform.current = new H.service.Platform({ apiKey });
      const rasterTileService = platform.current.getRasterTileService({
        queryParams: {
          style: "explore.day",
          size: 512,
        },
      });

      const rasterTileProvider = new H.service.rasterTile.Provider(rasterTileService);
      const rasterTileLayer = new H.map.layer.TileLayer(rasterTileProvider);

      const newMap = new H.Map(
        mapRef.current,
        rasterTileLayer, {
          pixelRatio: window.devicePixelRatio,
          center: { lat: latitude, lng: longitude },
          zoom: 14,
        },
      );

      const behavior = new H.mapevents.Behavior(
        new H.mapevents.MapEvents(newMap)
      );

      map.current = newMap;
    }
  }, [apiKey, showMap, latitude, longitude]);

  if (error) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  return <div style={{ width: "100%", height: "300px" }} ref={mapRef} />;
};

export default Map;

