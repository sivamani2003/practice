// app/api/bfhl/route.js

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
  
      const user_id = "john_doe_17091999"; // Static user_id
      const email = "john@xyz.com"; // Static email
      const roll_number = "ABCD123"; // Static roll number
  
      const numbers = [];
      const alphabets = [];
  
      data.forEach(item => {
        if (!isNaN(item)) {
          numbers.push(item);
        } else if (/^[A-Za-z]$/.test(item)) {
          alphabets.push(item);
        }
      });
  
      const highest_alphabet = alphabets.length > 0
        ? [alphabets.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).pop()]
        : [];
  
      const response = {
        is_success: true,
        user_id,
        email,
        roll_number,
        numbers,
        alphabets,
        highest_alphabet,
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
  