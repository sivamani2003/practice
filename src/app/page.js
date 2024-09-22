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
    <div className="p-6 min-h-screen flex flex-col items-center bg-gray-50">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Task Filter System</h1>

      {/* Instructions */}
      <p className="mb-4 text-gray-600">
        Enter a JSON input to filter the alphabets and numbers. Example: 
        <code className="text-blue-500">{"{\"data\": [\"A\", \"1\", \"B\", \"3\"]}"}</code>
      </p>

      {/* JSON Input */}
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON here (e.g. {"data": ["A", "1", "B", "3"]})'
        className="border border-gray-300 p-4 mb-4 w-full max-w-lg h-32 resize-none rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Enter your JSON input"
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Submit
      </button>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Response Section */}
      {response && (
        <div className="mt-8 w-full max-w-lg bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Filters:</h3>

          {/* Filters */}
          <div className="flex flex-col space-y-2">
            {response.alphabets?.length > 0 && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="Alphabets"
                  onChange={handleOptionChange}
                  className="form-checkbox h-5 w-5 text-blue-500"
                  checked={selectedOptions.includes('Alphabets')}
                />
                <span className="text-gray-900">Alphabets</span>
              </label>
            )}

            {response.numbers?.length > 0 && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="Numbers"
                  onChange={handleOptionChange}
                  className="form-checkbox h-5 w-5 text-blue-500"
                  checked={selectedOptions.includes('Numbers')}
                />
                <span className="text-gray-900">Numbers</span>
              </label>
            )}

            {response.highest_alphabet && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="Highest alphabet"
                  onChange={handleOptionChange}
                  className="form-checkbox h-5 w-5 text-blue-500"
                  checked={selectedOptions.includes('Highest alphabet')}
                />
                <span className="text-gray-900">Highest Alphabet</span>
              </label>
            )}
          </div>

          {/* Filtered Response */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Filtered Response:</h3>
            <pre className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap text-gray-800 border border-gray-200">
              {renderFilteredResponse()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
