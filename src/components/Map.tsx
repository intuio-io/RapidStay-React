import L, { LatLngExpression } from "leaflet";
import { MapContainer, Marker, TileLayer  } from 'react-leaflet';

import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// utils
import { reverseGeocode } from "../utils/reverseGeoDecoding";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

// @ts-ignore
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

export type CountrySelectValue = {
  flag: string;
  label: string;
  latlng: number[];
  region: string;
  value: string;
}

interface MapProps {
    center?: number [];
    location?: CountrySelectValue | undefined;
    onChange?: (value: CountrySelectValue) => void;
}

const handleMarkerDragEnd =  async (e: L.DragEndEvent, location?: CountrySelectValue, onChange?: (value: CountrySelectValue) => void) => {
    const newLatlng = e.target.getLatLng();
  
    const data = await  reverseGeocode(newLatlng.lat, newLatlng.lng);
  
        const updatedLocation = {
          ...location,
          label: data?.countryName || location?.label,
          value: data?.countryCode || location?.value,
          region: data?.region || location?.region,
          latlng: [newLatlng.lat, newLatlng.lng],
        };
  
        
      onChange?.(updatedLocation as CountrySelectValue)
  };


  

  const Map: React.FC<MapProps> = ({center, location, onChange}) => {


  return (
    <MapContainer center={center as LatLngExpression || [51, -0.09]}
        zoom={center ? 4 : 2}
        scrollWheelZoom={false}
        className='h-[35vh] rounded-lg'
        >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {center && (
        <Marker position={center as L.LatLngExpression} draggable={location ? true : false} eventHandlers={{
          dragend: (e) => handleMarkerDragEnd(e, location, onChange)}}/>
    )}
    </MapContainer>
  )
}

export default Map
