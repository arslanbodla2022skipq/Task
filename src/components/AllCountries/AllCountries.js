import React, { useState, useEffect } from "react";
import { apiURL } from "../util/api";

import SearchInput from "../Search/SearchInput";
import FilterCountry from "../FilterCountry/FilterCountry";

import { Link } from "react-router-dom";

const AllCountries = () => {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [exchangeRates, setExchangeRates] = useState({});

  useEffect(() => {
    // Fetch the exchange rates when the component mounts
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    const apiKey = "65a46a3c3c9c4a87ab07b6a72500b80d";
    const apiUrl = `http://data.fixer.io/api/latest?base=EUR&access_key=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Check if the response has rates data
      if (data && data.rates && typeof data.rates === "object") {
        // Extract exchange rates for each country from the data
        const exchangeRatesData = data.rates;
        console.log(data.rates)
        // Update the state with the fetched data
        setExchangeRates(exchangeRatesData);
      } else {
        console.error("Invalid response format. Missing 'rates' data.");
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  };

  const getAllCountries = async () => {
    try {
      const res = await fetch(`${apiURL}/all`);

      if (!res.ok) throw new Error("Something went wrong!");

      const data = await res.json();

      setCountries(data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  const getCountryByName = async (countryName) => {
    try {
      const res = await fetch(`${apiURL}/name/${countryName}`);

      if (!res.ok) throw new Error("Not found any country!");

      const data = await res.json();
      setCountries(data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  const getCountryByRegion = async (regionName) => {
    try {
      const res = await fetch(`${apiURL}/region/${regionName}`);

      if (!res.ok) throw new Error("Failed..........");

      const data = await res.json();
      setCountries(data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(false);
    }
  };

  const getCountryByCurrency = async (currencyName) => {
    try {
      const res = await fetch(`${apiURL}/currency/${currencyName}`);

      if (!res.ok) throw new Error("Failed..........");

      const data = await res.json();
      setCountries(data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(false);
    }
  };

  useEffect(() => {
    getAllCountries();
  }, []);

  return (
    <div className="all__country__wrapper">
      <div className="country__top">
        <div className="search">
          <SearchInput onSearch={getCountryByName} />
        </div>

        <div className="filter">
          <FilterCountry onSelect={getCountryByRegion} />
        </div>
        <div className="filter">
          <FilterCountry onSelect={getCountryByCurrency} />
        </div>
      </div>

      <div className="country__bottom">
        {isLoading && !error && <h4>Loading........</h4>}
        {error && !isLoading && <h4>{error}</h4>}

        {countries?.map((country) => (
        <Link to={`/country/${country.name.common}`} key={country.cca3}>
            <div className="country__card">
            <div className="country__img">
                <img src={country.flags.png} alt="" />
            </div>

            <div className="country__data">
                <h3>{country.name.common}</h3>
                <h6>Population: {new Intl.NumberFormat().format(country.population)}</h6>
                <h6>Region: {country.region}</h6>
                <h6>Capital: {country.capital}</h6>
                {country.currencies ? (
                <h6>
                    Currencies:{" "}
                    {Object.entries(country.currencies).map(([code, currency]) => (
                    <span key={code}>
                      {`${code}: ${currency.name} (${currency.symbol}) - Exchange Rate based on EUR: ${exchangeRates[code]}`}                   
                    </span>
                    ))}
                </h6>
                ) : (
                <h6>Currencies: N/A</h6>
                )}
            </div>
            </div>
        </Link>
        ))}
      </div>
    </div>
  );
};


export default AllCountries;