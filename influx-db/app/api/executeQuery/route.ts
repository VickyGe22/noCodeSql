import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { query, bucket, url, orgId, token } = await req.json();

  if (!url || !token || !orgId) {
    return NextResponse.json({ error: 'InfluxDB configuration is missing' }, { status: 400 });
  }

  try {
    const response = await fetch(`${url}/api/v2/query?org=${orgId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/vnd.flux',
        'Accept': 'application/csv',
      },
      body: query,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('InfluxDB API error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const csvData = await response.text();
    const result = parseCSV(csvData);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error executing query:', error);
    return NextResponse.json({ 
      error: 'Failed to execute query', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function parseCSV(csv: string) {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    const values = lines[i].split(',');
    const obj: Record<string, any> = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j];
    }
    result.push(obj);
  }

  return result;
}