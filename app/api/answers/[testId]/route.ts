import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { testId: string } }) {
  const { testId } = params;
  
  try {
    // Parse the JSON body from the request
    const answers = await req.json();
    console.log('Answers:', answers);
    // Call the back-end API to submit the answers
    const response = await fetch(`http://localhost:8060/api/v1/tests/${testId}/result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answers),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to submit answers' }, { status: response.status });
    }

    // Extract the result from the back-end response
    const result = await response.json();

    return NextResponse.json(result); // Return the result back to the front-end

  } catch (error) {
    console.error('Error submitting answers:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
