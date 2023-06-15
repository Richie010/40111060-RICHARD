import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [numbers, setNumbers] = useState([]);
  const [error, setError] = useState("");

  const handleGetNumbers = async () => {
    const urlList = [
      "http://104.211.219.98/numbers/primes",
      "http://104.211.219.98/numbers/fibo",
      "http://104.211.219.98/numbers/odd",
      "http://104.211.219.98/numbers/rand",
    ];

    const requests = urlList.map((url) =>
      axios
        .get(url, { timeout: 500 })
        .then((response) => response.data.numbers)
        .catch((error) => {
          console.error(`Error fetching numbers from ${url}:`, error);
          return [];
        })
    );

    const responses = await Promise.all(
      requests.map((request) =>
        Promise.race([
          request,
          new Promise((resolve, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 500)
          ),
        ])
      )
    );

    const validNumbers = responses
      .filter((response) => response instanceof Array)
      .map((response) => response)
      .flat();

    const uniqueNumbers = Array.from(new Set(validNumbers));
    const sortedNumbers = uniqueNumbers.sort((a, b) => a - b);
    setNumbers(sortedNumbers);
    setError("");
  };

  return (
    <div>
      <h1>Number Management Service</h1>
      <button onClick={handleGetNumbers}>Get Numbers</button>
      {error && <p>{error}</p>}
      {numbers.length > 0 && (
        <div>
          <h2>Numbers</h2>
          <ul>
            {numbers.map((number) => (
              <li key={number}>{number}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
