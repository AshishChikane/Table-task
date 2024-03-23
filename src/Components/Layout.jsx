import React, { useState, useEffect } from "react";
import axios from "axios";
import "./comman.css";
import Spinner from "../Components/Atoms/Spinner";
import useDebounce from "./hooks/useDebounce";
import Table from "./Atoms/Table";

export default function Layout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityCount, setCityCount] = useState(5);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [paginationSize, setPaginationSize] = useState(3);
  const [page, setPage] = useState(1);
  const rowsCount = paginationSize;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      if (!debouncedSearchQuery.trim()) {
        setIsLoading(false);
        setCities([]);
        return;
      }

      const options = {
        method: "GET",
        url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
        params: {
          namePrefix: debouncedSearchQuery,
          limit: cityCount,
        },
        headers: {
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
          "x-rapidapi-key":
            "daae60c9e9mshd65f1ce92891504p1fac78jsn9fa08c3dc7c3",
        },
      };

      try {
        const response = await axios.request(options);
        setCities(response.data.data);
        const totalCount = response.data.metadata.totalCount;
        const remainingCities = totalCount - (page - 1) * paginationSize;
        setTotalPages(Math.ceil(remainingCities / paginationSize));
      } catch (error) {
        console.error(error);
        setCities([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [debouncedSearchQuery, cityCount, page, paginationSize]);

  const startIndex = (page - 1) * rowsCount + 1;
  const endIndex = Math.min(startIndex + rowsCount - 1, cities.length);
  const visibleData = cities.slice(startIndex - 1, endIndex);

  return (
    <div className="container">
      <input
        id="search-box"
        type="text"
        className="search-box"
        placeholder="Search City..."
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            setSearchQuery(event.target.value);
          }
        }}
        onKeyDown={(event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === "/") {
            document.getElementById("search-box").focus();
          }
        }}
        onChange={(event) => setSearchQuery(event.target.value)}
      />
      <div className="table-container">
        {isLoading && <Spinner />}
        {!isLoading && cities.length > 0 && (
          <Table data={visibleData} startIndex={startIndex} />
        )}
        {!isLoading && cities.length === 0 && searchQuery.trim() && (
          <div>No result found</div>
        )}
        {!isLoading && cities.length === 0 && !searchQuery.trim() && (
          <div>Start searching</div>
        )}
      </div>
      {totalPages > 0 && cities.length > 0 && (
        <div className="pagination-container">
          <div>
            <label htmlFor="city-count">Cities:</label>
            <input
              type="number"
              value={cityCount}
              min={1}
              max={10}
              onChange={(e) => {
                let count = parseInt(e.target.value);
                if (count > 10) {
                  count = 10;
                  alert("Maximum limit exceeded. Maximum allowed: 10");
                }
                setCityCount(count);
              }}
            />
          </div>
          <div>
            <div className="pagination-size">
              <div>
                <label htmlFor="pagination-size">Pagination Size:</label>
                <select
                  id="pagination-size"
                  value={paginationSize}
                  onChange={(e) => {
                    setPaginationSize(parseInt(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </select>
              </div>
              <div>
                <button
                  className="bg-white text-lg rounded-l-lg p-1.5 ring-1 ring-gray-300 disabled:text-secondary-light disabled:cursor-not-allowed"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Prev
                </button>
                <button
                  className="bg-white text-lg rounded-r-lg p-1.5 ring-1 ring-gray-300 disabled:text-secondary-light disabled:cursor-not-allowed"
                  onClick={() => setPage(page + 1)}
                  disabled={
                    page === totalPages || visibleData.length < paginationSize
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
