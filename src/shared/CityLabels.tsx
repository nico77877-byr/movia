import { memo } from 'react';
import { Marker } from 'react-leaflet';
import { CIUDADES } from '../config/catalogos';
import { cityIcon } from '../config/map';

/** Nombres de ciudades sobre el mapa. */
export default memo(function CityLabels() {
  return <>{Object.entries(CIUDADES).map(([name, pos]) => <Marker key={name} position={pos} icon={cityIcon(name)} interactive={false} />)}</>;
});
