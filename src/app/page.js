"use client";
import { useState } from "react";

export default function Home() {
  // Initialize with all filters selected
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState(['Alphabets', 'Numbers', 'Highest alphabet']); // All filters active by default

  // Submit the API request and handle the response or errors
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

  // Handle changes in selected filter options
  const handleOptionChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedOptions((prev) => [...prev, value]);
    } else {
      setSelectedOptions((prev) => prev.filter((option) => option !== value));
    }
  };

  // Render the filtered response based on selected options
  const renderFilteredResponse = () => {
    if (!response) return null;

    let result = "";

    if (selectedOptions.includes('Alphabets') && response.alphabets?.length) {
      result += `Alphabets: ${response.alphabets.join(', ')}\n`;
    }

    if (selectedOptions.includes('Numbers') && response.numbers?.length) {
      result += `Numbers: ${response.numbers.join(', ')}\n`;
    }

    if (selectedOptions.includes('Highest alphabet') && response.highest_alphabet) {
      result += `Highest Alphabet: ${response.highest_alphabet}\n`;
    }

    return result || "No filters selected.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-4 text-white">
      {/* Header */}
      <h1 className="text-4xl font-extrabold mb-8 shadow-lg rounded-lg p-4 bg-black bg-opacity-30">
        AP21110010641 K Sivamani
      </h1>

      {/* JSON Input Area */}
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON here (e.g. {"data": ["A", "1", "B", "3"]})'
        className="w-full max-w-md p-4 mb-4 h-40 bg-white text-gray-800 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-pink-300"
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="px-6 py-3 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition duration-300 shadow-md"
      >
        Submit
      </button>

      {/* Error Message */}
      {error && <p className="text-red-200 mt-4 text-lg font-semibold">{error}</p>}

      {/* Filter Section */}
      {response && (
        <div className="mt-8 w-full max-w-lg bg-white bg-opacity-10 p-6 rounded-lg shadow-md backdrop-blur-md">
          <h3 className="text-xl font-bold text-white mb-4">Select Filters:</h3>

          {/* Conditionally render filters based on available data */}
          <div className="flex flex-col space-y-4">
            {/* Show "Alphabets" filter only if response has alphabets */}
            {response.alphabets?.length > 0 && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="Alphabets"
                  onChange={handleOptionChange}
                  className="form-checkbox h-5 w-5 text-yellow-300"
                  checked={selectedOptions.includes('Alphabets')} // Check based on state
                />
                <span className="text-white">Alphabets</span>
              </label>
            )}

            {/* Show "Numbers" filter only if response has numbers */}
            {response.numbers?.length > 0 && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="Numbers"
                  onChange={handleOptionChange}
                  className="form-checkbox h-5 w-5 text-yellow-300"
                  checked={selectedOptions.includes('Numbers')} // Check based on state
                />
                <span className="text-white">Numbers</span>
              </label>
            )}

            {/* Always show "Highest Alphabet" if available */}
            {response.highest_alphabet && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="Highest alphabet"
                  onChange={handleOptionChange}
                  className="form-checkbox h-5 w-5 text-yellow-300"
                  checked={selectedOptions.includes('Highest alphabet')} // Check based on state
                />
                <span className="text-white">Highest Alphabet</span>
              </label>
            )}
          </div>

          {/* Filtered Response */}
          <div className="mt-6">
            <h3 className="text-xl font-bold text-white mb-2">Filtered Response:</h3>
            <pre className="bg-black bg-opacity-30 p-4 rounded-lg text-white whitespace-pre-wrap">
              {renderFilteredResponse()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
