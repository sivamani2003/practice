import { Buffer } from 'buffer';

// Handle GET request
export async function GET() {
  return new Response(JSON.stringify({ operation_code: 1 }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Handle POST request
export async function POST(request) {
  try {
    // Extract data from request body
    const { data, file_b64 } = await request.json();

    // Validate input
    if (!data || !Array.isArray(data)) {
      return new Response(
        JSON.stringify({
          is_success: false,
          message: 'Invalid input data format',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Static user details
    const user_id = "sivamani_13102003";
    const email = "sivamani_k@srmap.edu.in";
    const roll_number = "AP21110010641";

    // Arrays to store numbers and alphabets
    const numbers = [];
    const alphabets = [];

    // Separate numbers and alphabets
    data.forEach(item => {
      if (!isNaN(item)) {
        numbers.push(item);
      } else if (/^[A-Za-z]$/.test(item)) {
        alphabets.push(item);
      }
    });

    // Find the highest lowercase alphabet
    let highest_alphabet = '';
    const lowercaseAlphabets = alphabets.filter(char => /^[a-z]$/.test(char));

    if (lowercaseAlphabets.length > 0) {
      // Use Math.max and spread operator to find the highest alphabet character
      highest_alphabet = lowercaseAlphabets.reduce((max, current) => 
        current > max ? current : max
      );
    }

    // File validation logic
    let file_valid = false;
    let file_mime_type = '';
    let file_size_kb = 0;

    if (file_b64) {
      // Decode base64 to binary
      const buffer = Buffer.from(file_b64, 'base64');

      // Validate file MIME type using basic MIME detection
      if (file_b64.startsWith('/9j/')) {
        file_mime_type = 'image/jpeg';
        file_valid = true;
      } else if (file_b64.startsWith('iVBORw0KGgo')) {
        file_mime_type = 'image/png';
        file_valid = true;
      } else {
        file_mime_type = 'unknown';
        file_valid = false;
      }

      // Calculate file size in kilobytes
      file_size_kb = (buffer.length / 1024).toFixed(2);
    }

    // Build the response
    const response = {
      is_success: true,
      user_id,
      email,
      roll_number,
      numbers,
      alphabets,
      highest_alphabet: highest_alphabet || null,
      file_valid,
      file_mime_type: file_mime_type || null,
      file_size_kb: file_valid ? file_size_kb : null,
    };

    // Return successful response
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({
        is_success: false,
        message: 'Server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
