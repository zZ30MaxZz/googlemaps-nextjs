'use client'

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import styles from './retails.module.css'

const LatDefault = -12.04318;
const LngDefault = -77.02824;
const Center = { lat: LatDefault, lng: LngDefault };
const Zoom = 12;
const libs: Library[] = ["core", "maps", "places", "marker"];

export default function RetailsPage() {
    const [map, setMap] = useState<google.maps.Map | null>();
    const [center, setCenter] = useState(Center);
    const [markerPosition, setMarkerPosition] = useState(Center)

    const mapRef = useRef<HTMLInputElement>(null);
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

    const { isLoaded } = useLoadScript({
        // googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        libraries: libs,
    });

    useEffect(() => {
        if (!inputRef.current) return;

        const autoComplete = new window.google.maps.places.Autocomplete(
            inputRef.current,
        )

        autoComplete.addListener('place_changed', () => {
            const place = autoComplete.getPlace()
            if (!place.geometry || !place.geometry.location) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                alert("this location not available")
            }

            if (place?.geometry?.viewport || place?.geometry?.location) {
                // do something
                console.log(place.geometry.location?.lat())
                console.log(place.geometry.location?.lng())

                const newCenter = {
                    lat: place.geometry.location?.lat() as number,
                    lng: place.geometry.location?.lng() as number
                }

                setMarkerPosition(newCenter);
                setCenter(newCenter);
            }
        })
    }, [isLoaded])

    return (
        <>
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
                    >
                        <Marker position={markerPosition} />
                    </GoogleMap>
                </>
            )
            }
        </>
    )
}