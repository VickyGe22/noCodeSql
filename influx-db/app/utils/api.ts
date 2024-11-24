export async function fetchBuckets(url: string, orgId: string, token: string) {
  try {
    const response = await fetch("/api/influxDbConnect/buckets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, orgId, token }),
    });
    const data = await response.json();
    if (data.success) {
      return data.buckets;
    } else {
      console.error("Failed to fetch buckets:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching buckets:", error);
    return [];
  }
}

export async function fetchMeasurements(
  url: string,
  token: string,
  bucketName: string,
) {
  try {
    const response = await fetch("/api/influxDbConnect/measurement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, token, bucketName }),
    });
    const data = await response.json();
    if (data.success) {
      return data.measurements;
    } else {
      console.error("Failed to fetch measurements:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching measurements:", error);
    return [];
  }
}

export async function fetchFields(
  url: string,
  token: string,
  bucketName: string,
) {
  try {
    const response = await fetch("/api/influxDbConnect/fields", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, token, bucketName }),
    });
    const data = await response.json();
    if (data.success) {
      return data.fieldMap;
    } else {
      console.error("Failed to fetch fields:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching fields:", error);
    return [];
  }
}

export async function fetchTags(
  url: string,
  token: string,
  bucketName: string,
) {
  try {
    const response = await fetch("/api/influxDbConnect/tags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, token, bucketName }),
    });
    const data = await response.json();
    if (data.success) {
      return data.tagMap;
    } else {
      console.error("Failed to fetch tags:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

export async function fetchTagsKeys(
  url: string,
  token: string,
  bucketName: string,
) {
  try {
    const response = await fetch("/api/influxDbConnect/tags/keys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, token, bucketName }),
    });
    const data = await response.json();
    if (data.success) {
      return data.tagMap;
    } else {
      console.error("Failed to fetch tags:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}


export async function createDataSource(
  grafanaUrl: string,
  bearerToken: string,
  datasourceName: string,
  datasourceUrl: string,
  org: string,
  bucket: string,
  influxdbToken: string,
) {
  try {
    const response = await fetch("/api/GrafanaConnect/createDataSource", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grafanaUrl,
        bearerToken,
        datasourceName,
        datasourceUrl,
        org,
        bucket,
        influxdbToken,
      }),
    });

    const data = await response.json();

    if (data.success || data.error === "data source with the same name already exists") {
      return data;
    } else {
      console.error("Failed to create data source:", data.message || data.error);
      return null;
    }
  } catch (error) {
    console.error("Error creating data source:", error);
    return null;
  }
}

export async function createDashBoard(
  grafanaUrl: string,
  bearerToken: string,
  dashboardTitle: string,
  datasourceName: string,
  bucketName: string,
  query: string,
) {
  try {
    const response = await fetch("/api/GrafanaConnect/createDashBoard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grafanaUrl,
        bearerToken,
        dashboardTitle,
        datasourceName,
        //bucketName,
        query,
      }),
    });

    const data = await response.json();

    if (data.success) {
      return data;
    } else {
      console.error("Failed to create dashboard:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error creating dashboard:", error);
    return null;
  }
}