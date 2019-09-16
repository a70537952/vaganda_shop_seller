import GoogleMapReact from 'google-map-react';
import React, {ReactNode, useState} from 'react';

interface IProps {
    children?: ReactNode;
    defaultLat?: number;
    defaultLng?: number;
    latitude?: number;
    longitude?: number;
    onClick: (data: any) => void;
}

export default function GoogleMap(props: IProps) {
    const {
        latitude,
        longitude,
        onClick,
        children
    } = props;

    const [mapsApiLoaded, setMapsApiLoaded] = useState<boolean>(false);
    const [mapInstance, setMapInstance] = useState<any>(null);
    const [mapsapi, setMapsapi] = useState<any>(null);

    function apiLoaded(map: any, maps: any) {
        setMapsApiLoaded(true);
        setMapInstance(map);
        setMapsapi(maps);
    }

    let defaultLat = props.defaultLat || -1;
    let defaultLng = props.defaultLng || 67;

    return <GoogleMapReact
        resetBoundsOnResize
        bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_API_KEY || ''}}
        options={maps => {
            return {
                mapTypeControl: true,
                mapTypeId: maps.MapTypeId.HYBRID,
                mapTypeControlOptions: {
                    style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: maps.ControlPosition.TOP_LEFT,
                    mapTypeIds: [
                        maps.MapTypeId.ROADMAP,
                        maps.MapTypeId.TERRAIN,
                        maps.MapTypeId.HYBRID
                    ]
                }
            };
        }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({map, maps}) => {
            apiLoaded(map, maps);
        }}
        defaultCenter={{
            lat: defaultLat,
            lng: defaultLng
        }}
        center={{
            lat: latitude || defaultLat,
            lng: longitude || defaultLng
        }}
        defaultZoom={2}
        zoom={
            latitude !== defaultLat && latitude !== null &&
            longitude !== defaultLng  && longitude !== null
                ? 20
                : 2
        }
        onClick={data => {
            onClick(data);
        }}
    >
        {children}
    </GoogleMapReact>;
}