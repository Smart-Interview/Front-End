export async function GET(request: Request): Promise<Response> {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');
  
    if (!testId) {
      return new Response(JSON.stringify({ error: 'testId is required' }), { status: 400 });
    }
  
    const backendUrl = `http://localhost:8060/api/v1/tests/${testId}`;
  
    try {
      const response = await fetch(backendUrl);
      if (!response.ok) {
        return new Response(JSON.stringify({ error: 'Failed to fetch questions from backend' }), { status: 500 });
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Error fetching questions from backend' }), { status: 500 });
    }
}
  