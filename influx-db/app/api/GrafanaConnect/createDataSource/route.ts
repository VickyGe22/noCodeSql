import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {
    grafanaUrl,
    bearerToken,
    datasourceName,
    datasourceUrl,
    org,
    bucket,
    influxdbToken,
  } = await req.json();

  try {
    const response = await fetch(`${grafanaUrl}/api/datasources`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: `${datasourceName}`,
        type: "influxdb",
        url: `${datasourceUrl}`,
        access: "proxy",
        // bearerToken: "your_actual_bearer_token",
        
        //dataSourceUrl: `${datasourceUrl}`,
        
        jsonData: {
          version: "Flux",
          organization: `${org}`,
          bucket: `${bucket}`,
        },
        secureJsonData: {
          token: `${influxdbToken}`,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create data source in Grafana",
          error: errorData.message,
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(
      { success: true, dataSource: data },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: "Internal Server Error",
          error: error.message,
        },
        { status: 500 },
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Unknown error occurred" },
        { status: 500 },
      );
    }
  }
}
