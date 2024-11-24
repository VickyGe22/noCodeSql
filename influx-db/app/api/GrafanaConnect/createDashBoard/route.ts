import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {
    grafanaUrl,
    bearerToken,
    dashboardTitle,
    datasourceName,
    query,
  } = await req.json();

  try {
    const response = await fetch(`${grafanaUrl}/api/dashboards/db`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        dashboard: {
          id: null,
          title: dashboardTitle,
          tags: ["influxdb", "test"],
          timezone: "browser",
          schemaVersion: 16,
          version: 0,
          refresh: "10s",
          panels: [
            // Time series panel
            {
              datasource: datasourceName,
              fieldConfig: {
                defaults: {
                  custom: {
                    drawStyle: "line",
                    lineInterpolation: "linear",
                    barAlignment: 0,
                    lineWidth: 1,
                    fillOpacity: 0,
                    gradientMode: "none",
                    spanNulls: false,
                    showPoints: "auto",
                    pointSize: 5,
                    // stacking: {
                    //   mode: "off",
                    //   group: "A",
                    // },
                    axisPlacement: "auto",
                    axisLabel: "",
                    axisColorMode: "text",
                    scaleDistribution: {
                      type: "linear",
                    },
                    axisCenteredZero: false,
                    hideFrom: {
                      tooltip: false,
                      viz: false,
                      legend: false,
                    },
                    thresholdsStyle: {
                      mode: "off",
                    },
                    lineStyle: {
                      fill: "solid",
                    },
                  },
                  color: {
                    mode: "palette-classic",
                  },
                  mappings: [],
                  thresholds: {
                    mode: "absolute",
                    steps: [
                      {
                        color: "green",
                        value: null,
                      },
                      {
                        color: "red",
                        value: 80,
                      },
                    ],
                  },
                },
                overrides: [],
              },
              gridPos: {
                h: 11,
                w: 24,
                x: 0,
                y: 7,
              },
              id: 2,
              options: {
                tooltip: {
                  mode: "multi",
                  sort: "desc",
                },
                legend: {
                  showLegend: true,
                  displayMode: "list",
                  placement: "right",
                  calcs: [],
                },
              },
              pluginVersion: "9.5.3",
              targets: [
                {
                  datasource: datasourceName,
                  query: query,
                  refId: "A",
                },
              ],
              title: "Time series",
              type: "timeseries",
              transparent: true,
            },
            //Bargauge panel
            {
              datasource: datasourceName,
              type: "bargauge",
              title: "Mean of Field",
              gridPos: {
                x: 0,
                y: 11,
                w: 24,
                h: 5,
              },
              id: 3,
              targets: [
                {
                  datasource: datasourceName,
                  refId: "B",
                  query: query,
                },
              ],
              transparent: true,
              options: {
                reduceOptions: {
                  values: false,
                  calcs: ["mean"],
                  fields: "",
                },
                orientation: "auto",
                displayMode: "gradient",
                valueMode: "color",
                showUnfilled: false,
                minVizWidth: 0,
                minVizHeight: 10,
              },
              fieldConfig: {
                defaults: {
                  mappings: [],
                  thresholds: {
                    mode: "absolute",
                    steps: [
                      {
                        value: null,
                        color: "green",
                      },
                      {
                        value: 80,
                        color: "red",
                      },
                    ],
                  },
                  color: {
                    mode: "palette-classic",
                  },
                },
                overrides: [],
              },
              pluginVersion: "9.5.3",
            },
            //Gauge panel
            {
              datasource: datasourceName,
              type: "gauge",
              title: "The last value",
              gridPos: {
                x: 0,
                y: 18,
                w: 24,
                h: 7,
              },
              id: 4,
              targets: [
                {
                  datasource: datasourceName,
                  refId: "C",
                  query: query, 
                },
              ],
              transparent: true,
              options: {
                reduceOptions: {
                  values: false,
                  calcs: ["lastNotNull"],
                  fields: "",
                },
                orientation: "auto",
                showThresholdLabels: false,
                showThresholdMarkers: true,
              },
              fieldConfig: {
                defaults: {
                  mappings: [],
                  thresholds: {
                    mode: "absolute",
                    steps: [
                      {
                        value: null,
                        color: "green",
                      },
                      {
                        value: 80,
                        color: "red",
                      },
                    ],
                  },
                  color: {
                    mode: "continuous-GrYlRd",
                  },
                },
                overrides: [],
              },
              pluginVersion: "9.5.3",
            },
          ],
        },
        folderId: 0,
        overwrite: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create or update dashboard in Grafana",
          error: errorData.message,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("vis", data);
    return NextResponse.json(
      { success: true, dashboard: data },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: "Internal Server Error",
          error: error.message,
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
