export async function GET() {
  return new Response(JSON.stringify({ operation_code: 1 }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  try {
    const { data } = await request.json();

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

    // Find the highest alphabet (case insensitive sorting)
    let highest_alphabet = [];
    if (alphabets.length > 0) {
      const sortedAlphabets = alphabets.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      highest_alphabet = [sortedAlphabets[sortedAlphabets.length - 1]]; // Last element is the highest alphabet
    }

    // Build the response
    const response = {
      is_success: true,
      user_id,
      email,
      roll_number,
      numbers,
      alphabets,
      highest_alphabet, // Corrected highest alphabet
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
