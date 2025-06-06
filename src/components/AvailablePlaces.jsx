import Places from './Places.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';
import { useFetch } from '../hooks/useFetch.js';

async function fetchSortedPlaces() {
  const fetchedPlaces = await fetchAvailablePlaces();

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        fetchedPlaces,
        position.coords.latitude,
        position.coords.longitude
      );

      resolve(sortedPlaces);
    });
  });
}


export default function AvailablePlaces({ onSelectPlace }) {
  const {
      fetchedData: availablePlaces,
      isFetching,
      error,
    } = useFetch(fetchSortedPlaces, []);

  if (error) {
    return <ErrorMessage
      title="An Error Occurred!" message={error.message} />
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching places..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
