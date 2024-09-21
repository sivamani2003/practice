// app/page.js (Frontend UI)

"use client";
import { useState } from "react";

export default function Home() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  const handleSubmit = async () => {
    setError('');

    try {
      const parsedInput = JSON.parse(jsonInput);
      const res = await fetch('/api/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedInput),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data);
      } else {
        setError(data.message || 'Something went wrong');
      }

    } catch (err) {
      setError('Invalid JSON input');
    }
  };

  const handleOptionChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedOptions((prev) => [...prev, value]);
    } else {
      setSelectedOptions((prev) => prev.filter((option) => option !== value));
    }
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    const filteredResponse = {};

    if (selectedOptions.includes('Alphabets')) {
      filteredResponse.alphabets = response.alphabets;
    }

    if (selectedOptions.includes('Numbers')) {
      filteredResponse.numbers = response.numbers;
    }

    if (selectedOptions.includes('Highest alphabet')) {
      filteredResponse.highest_alphabet = response.highest_alphabet;
    }

    return JSON.stringify(filteredResponse, null, 2);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">ABCD123</h1>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON here'
        className="border p-2 mb-4 w-full"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Submit
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {response && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Response</h2>
          <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(response, null, 2)}</pre>

          <div className="mt-4">
            <h3>Select Filters:</h3>
            <label>
              <input
                type="checkbox"
                value="Alphabets"
                onChange={handleOptionChange}
              />
              Alphabets
            </label>
            <label className="ml-4">
              <input
                type="checkbox"
                value="Numbers"
                onChange={handleOptionChange}
              />
              Numbers
            </label>
            <label className="ml-4">
              <input
                type="checkbox"
                value="Highest alphabet"
                onChange={handleOptionChange}
              />
              Highest alphabet
            </label>

            <div className="mt-4">
              <h3>Filtered Response:</h3>
              <pre className="bg-gray-100 p-2 rounded">
                {renderFilteredResponse()}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
