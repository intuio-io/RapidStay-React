import axios from 'axios';

export async function reverseGeocode(latitude: number, longitude: number) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GEOLOCATION_API_KEY}`;
    try {
        const response = await axios.get(url);

        if (response.data.status === 'OK') {
            const result = response.data.results[0];
            let countryCode = '';
            let countryName = '';
            let region = '';

            result.address_components.forEach((component: { types: string[]; short_name: string; long_name: string; }) => {
                if (component.types.includes('country')) {
                    countryCode = component.short_name;
                    countryName = component.long_name;
                }
                if (component.types.includes('administrative_area_level_1')) {
                    region = component.long_name;
                }
            });

            if (countryCode && countryName) {
                return { countryCode, countryName, region };
            } else {
                console.error('Country code or country name not found in the response.');
                return null;
            }
        } else {
            console.error('Geocode was not successful for the following reason:', response.data.status);
            return null;
        }
    } catch (error) {
        console.error('Error fetching geocode:', error);
        return null;
    }
}
