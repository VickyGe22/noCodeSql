"use client";

import * as React from "react";
import { QueryResult } from '../Results';


// Configuration for chart display
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
};

interface VisualisationProps {
  data: QueryResult[] | null;
  dashboardUrl: string | null;
}

// Modified Visualisation component
export function Visualisation({ dashboardUrl }: {data: QueryResult[] | null; dashboardUrl: string | null }) {
  const [timeRange, setTimeRange] = React.useState("90d");
  const [chartData, setChartData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  // Fetch chart data when time range changes
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/data?timeRange=${timeRange}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);
  
  // If a dashboard URL is provided, display the Grafana dashboard in an iframe
  if (dashboardUrl) {
    return (
      <div className="w-full h-full">
        <iframe
          src={`${dashboardUrl}`} // Use Grafana kiosk mode to hide the top bar
          width="100%"
          height="800px"
          title="Grafana Dashboard"
        ></iframe>
      </div>
    );
  }

  // If no dashboard URL, display the InfluxDB data visualization
  if (loading) {
    return <div>Loading...</div>;
  }
}
