"use client";
import { useState } from "react";

export default function Home() {
  // State management
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState(['Alphabets', 'Numbers', 'Highest alphabet']);

  // Submit handler
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

  // Filter options handler
  const handleOptionChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedOptions((prev) => [...prev, value]);
    } else {
      setSelectedOptions((prev) => prev.filter((option) => option !== value));
    }
  };

  // Render filtered response
  const renderFilteredResponse = () => {
    if (!response) return null;

    let result = '';

    if (selectedOptions.includes('Alphabets') && response.alphabets?.length) {
      result += `Alphabets: ${response.alphabets.join(', ')}\n`;
    }

    if (selectedOptions.includes('Numbers') && response.numbers?.length) {
      result += `Numbers: ${response.numbers.join(', ')}\n`;
    }

    if (selectedOptions.includes('Highest alphabet') && response.highest_alphabet) {
      result += `Highest Alphabet: ${response.highest_alphabet}\n`;
    }

    return result || 'No filters selected.';
  };

  return (
    <div className="p-8 min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 via-blue-100 to-white">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-blue-900 mb-8 shadow-lg shadow-blue-100 rounded-lg p-4 bg-white">
        AP21110010641 KSivamani
      </h1>

      {/* Instructions */}
      <p className="mb-6 text-gray-700 text-center max-w-xl">
        Enter a JSON input to filter the alphabets and numbers. Example:
        <code className="block text-blue-500 mt-2">{"{\"data\": [\"A\", \"1\", \"B\", \"3\"]}"}</code>
      </p>

      {/* JSON Input */}
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON here (e.g. {"data": ["A", "1", "B", "3"]})'
        className="border border-blue-300 p-4 mb-4 w-full max-w-lg h-40 resize-none rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 bg-white"
        aria-label="Enter your JSON input"
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition duration-300 shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        Submit
      </button>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Response Section */}
      {response && (
        <div className="mt-10 w-full max-w-lg bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Select Filters:</h3>

          {/* Filters */}
          <div className="flex flex-col space-y-3">
            {response.alphabets?.length > 0 && (
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  value="Alphabets"
                  onChange={handleOptionChange}
                  className="form-checkbox h-6 w-6 text-blue-600"
                  checked={selectedOptions.includes('Alphabets')}
                />
                <span className="text-gray-700">Alphabets</span>
              </label>
            )}

            {response.numbers?.length > 0 && (
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  value="Numbers"
                  onChange={handleOptionChange}
                  className="form-checkbox h-6 w-6 text-blue-600"
                  checked={selectedOptions.includes('Numbers')}
                />
                <span className="text-gray-700">Numbers</span>
              </label>
            )}

            {response.highest_alphabet && (
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  value="Highest alphabet"
                  onChange={handleOptionChange}
                  className="form-checkbox h-6 w-6 text-blue-600"
                  checked={selectedOptions.includes('Highest alphabet')}
                />
                <span className="text-gray-700">Highest Alphabet</span>
              </label>
            )}
          </div>

          {/* Filtered Response */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Filtered Response:</h3>
            <pre className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-gray-800 border border-gray-200 shadow-inner">
              {renderFilteredResponse()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
