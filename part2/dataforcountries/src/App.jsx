import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCountryDetails, setSelectedCountryDetails] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (selectedCountryDetails) {
          console.log(
            "Fetching weather for:",
            selectedCountryDetails.capital[0]
          );
          console.log("Using API key:", apiKey); // Log API key for debugging
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather`,
            {
              params: {
                q: selectedCountryDetails.capital[0],
                appid: apiKey,
                units: "metric",
              },
            }
          );
          setWeatherData(response.data);
          console.log("Weather data:", response.data); // Log response data for debugging
        }
      } catch (error) {
        setError(error.message);
        console.log("Weather API error:", error); // Log error for debug
      }
    };

    fetchWeather();
  }, [selectedCountryDetails, apiKey]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search.trim() !== "") {
        const foundCountries = countries.filter((country) =>
          country.name.common.toLowerCase().includes(search.toLowerCase())
        );
        if (foundCountries.length === 1) {
          setSelectedCountry(foundCountries[0]);
          setSelectedCountryDetails(foundCountries[0]);
          setShowDetails(true);
        } else {
          setSelectedCountry(null);
          setSelectedCountryDetails(null);
          setShowDetails(false);
        }
      } else {
        setSelectedCountry(null);
        setSelectedCountryDetails(null);
        setShowDetails(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, countries]);

  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };

  const handleShowDetails = (country) => {
    setSelectedCountryDetails(country);
    setShowDetails(true);
  };

  const handleHideDetails = () => {
    setShowDetails(false);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <form>
        Find Country <input value={search} onChange={handleInputChange} />
      </form>
      {selectedCountryDetails && showDetails ? (
        <div>
          <h2>{selectedCountryDetails.name.common}</h2>
          <p>Capital: {selectedCountryDetails.capital[0]}</p>
          <p>Area: {selectedCountryDetails.area} km²</p>
          <img
            src={selectedCountryDetails.flags.png}
            alt={`Flag of ${selectedCountryDetails.name.common}`}
            style={{ height: "100px" }}
          />
          <p>
            Languages:{" "}
            {Object.values(selectedCountryDetails.languages).join(", ")}
          </p>
          {weatherData ? (
            <div>
              <h3>Weather of {selectedCountryDetails.capital[0]}</h3>
              <p>Temperature: {weatherData.main.temp} °C</p>
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].description}
              />
              <p>Wind Speed: {weatherData.wind.speed} m/s</p>
            </div>
          ) : error ? (
            <p>Error fetching weather data: {error}</p>
          ) : (
            <p>Loading weather data...</p>
          )}
          <button onClick={handleHideDetails}>Hide Details</button>
        </div>
      ) : (
        search !== "" && (
          <div>
            {filteredCountries.length > 10 ? (
              <p>Too many matches, specify another filter</p>
            ) : filteredCountries.length > 0 ? (
              <div>
                {filteredCountries.map((country) => (
                  <div key={country.cca3}>
                    <p>{country.name.common}</p>
                    {filteredCountries.length < 10 && (
                      <button onClick={() => handleShowDetails(country)}>
                        Show
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No countries found</p>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default App;

