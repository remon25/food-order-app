import { useEffect, useState } from "react";

export function useProfile() {
  const [data, setData] = useState(null); // `null` indicates no user logged in
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Optional: Handle errors

  useEffect(() => {
    setLoading(true);
    setError(null); // Reset error state
    fetch('/api/profile')
      .then((response) => {
        if (!response.ok) {
          // Handle non-2xx HTTP responses
          throw new Error('Failed to fetch profile');
        }
        return response.json();
      })
      .then((data) => {
        // Check if data indicates no user is logged in
        if (!data || Object.keys(data).length === 0) {
          setData(null); // No user logged in
        } else {
          setData(data); // User is logged in
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message); // Handle errors
        setLoading(false);
      });
  }, []);

  return { loading, data, error };
}
