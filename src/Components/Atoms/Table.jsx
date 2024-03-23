import React from "react";
import "../../Components/comman.css";

export default function Table({ data, startIndex }) {
  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Place Name</th>
          <th>Country</th>
        </tr>
      </thead>
      <tbody>
        {data.map((city, index) => (
          <tr key={city.id}>
            <td>{startIndex + index}</td>
            <td>{city.city}</td>
            <td>
              {city.country ? (
                <img
                  src={`https://flagsapi.com/${city.countryCode}/flat/64.png`}
                  alt={city.country}
                  style={{ width: "24px", height: "auto" }}
                />
              ) : (
                "No flag"
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
