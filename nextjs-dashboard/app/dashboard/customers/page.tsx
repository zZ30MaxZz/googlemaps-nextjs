'use client'

import { PlaceAutocompleteClassic } from '@/app/ui/customers/PlaceAutocompleteClassic';
import { GoogleMap, useLoadScript, LoadScript } from '@react-google-maps/api';
import { APIProvider, ControlPosition, Map, MapControl, Marker, useMap, useMarkerRef } from '@vis.gl/react-google-maps';
import React, { useEffect, useRef, useState } from 'react';
import styles from './customerPage.module.css'

const GOOGLE_MAPS_API_KEY = "AIzaSyD8X2RXvyAv2STMbE20XxcPxd2s_U5hrBE"
const LatDefault = -12.04318;
const LngDefault = -77.02824;
const Zoom = 12;

type AutocompleteMode = { id: string; label: string };

type CustomAutocompleteControlProps = {
    controlPosition: ControlPosition;
    selectedAutocompleteMode: AutocompleteMode;
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
};

export default function CustomerPage() {
    const [clientSide, setClientSide] = useState(false);
    const [googleApiKey, setGoogleApiKey] = useState('');
    const map = useMap();
    const [markerRef, marker] = useMarkerRef();
    const inputRef = useRef<HTMLInputElement>(null);
    const inputStyle = {
        boxShadow: 'inset 0 0 10px #eee !important',
        border: '2px solid #eee',
        width: '456px',
        height: '40px',
        marginLeft: '16px',
        borderRadius: '20px',
        fontWeight: '300 !important',
        outline: 'none',
        padding: '10px 20px',
        marginBottom: '10px',
    }

    console.log(GOOGLE_MAPS_API_KEY)

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    const center = { lat: LatDefault, lng: LngDefault };

    //Input
    const [selectedPlace, setSelectedPlace] =
        useState<google.maps.places.PlaceResult | null>(null);

    useEffect(() => {
        if (!marker) {
            return;
        }

    }, [marker]);

    useEffect(() => {
        if (!map) return;
    }, [map]);

    useEffect(() => {
        setClientSide(true);
        setGoogleApiKey(GOOGLE_MAPS_API_KEY);

        if (inputRef.current) {
            // Crear la instancia de Autocomplete solo si inputRef.current es un elemento válido
            const autoComplete = new window.google.maps.places.Autocomplete(
                inputRef.current
            );

            autoComplete.addListener('place_changed', () => {
                const place = autoComplete.getPlace();

                if (!place.geometry || !place.geometry.location) {
                    // User entered the name of a Place that was not suggested and
                    // pressed the Enter key, or the Place Details request failed.
                    alert("this location not available")
                }

                if (place.geometry?.viewport || place.geometry?.location) {
                    // do something
                    console.log(place.geometry.location)
                }
            });
        }
    }, []);

    return (
        <>
            {clientSide ? <p>Google API Key: {googleApiKey}</p> : <p>Loading...</p>}
            {/* <APIProvider apiKey="AIzaSyD8X2RXvyAv2STMbE20XxcPxd2s_U5hrBE">
                <Map
                    zoom={12}
                    defaultCenter={{ lat: LatDefault, lng: LngDefault }}>
                    <Marker ref={markerRef} position={{ lat: LatDefault, lng: LngDefault }} />
                </Map>
                <MapControl position={ControlPosition.BLOCK_START_INLINE_CENTER}>
                    <PlaceAutocompleteClassic onPlaceSelect={setSelectedPlace} />
                </MapControl>
            </APIProvider> */}
            {!isLoaded ? (
                <h3>Loading…..</h3>
            ) : (
                <>
                    <label >Location</label>
                    <input
                        placeholder='Ingresa una localización'
                        ref={inputRef}
                        style={inputStyle}
                    />
                    <GoogleMap
                        mapContainerClassName={styles.mapContainer}
                        center={center}
                        zoom={Zoom}
                    />
                </>
            )
            }
        </>
    )
}