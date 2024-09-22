export async function GET() {
  return new Response(JSON.stringify({ operation_code: 1 }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  try {
    const { data, file_b64 } = await request.json();

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

    const user_id = "sivamani_123"; // Static user_id
    const email = "sivamani_k@srmap.edu.in"; // Static email
    const roll_number = "AP21110010641"; // Static roll number

    const numbers = [];
    const alphabets = [];

    // Separate numbers and alphabets from the data array
    data.forEach(item => {
      if (!isNaN(item)) {
        numbers.push(item);
      } else if (/^[A-Za-z]$/.test(item)) {
        alphabets.push(item);
      }
    });

    // Find the highest lowercase alphabet
    let highest_alphabet = [];
    const lowercaseAlphabets = alphabets.filter(char => /^[a-z]$/.test(char));
    if (lowercaseAlphabets.length > 0) {
      highest_alphabet = [lowercaseAlphabets.sort((a, b) => b.localeCompare(a))[0]];
    }

    // File validation logic
    let file_valid = false;
    let file_mime_type = '';
    let file_size_kb = 0;

    if (file_b64) {
      // Decode base64 to binary
      const buffer = Buffer.from(file_b64, 'base64');

      // Validate file MIME type (example: image/png)
      const mime = require('mime-types');
      file_mime_type = mime.lookup(buffer);

      if (file_mime_type) {
        file_valid = true;
        // File size in kilobytes
        file_size_kb = (buffer.length / 1024).toFixed(2); // Convert bytes to KB
      }
    }

    // Build the response
    const response = {
      is_success: true,
      user_id,
      email,
      roll_number,
      numbers,
      alphabets,
      highest_alphabet,
      file_valid,
      file_mime_type: file_mime_type || null,
      file_size_kb: file_valid ? file_size_kb : null,
    };

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
