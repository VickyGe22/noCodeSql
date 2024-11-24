"use client";
require('dotenv').config();
import React, { useEffect, useState } from "react";
import Header from "@/app/ClientComponent/loginComponent/header";
import Footer from "@/app/ClientComponent/loginComponent/footer";
import NavBar from "@/app/ServerComponent/Dashboard/navbar";
import Sidebar from "@/app/ServerComponent/Sidebar";
import QueryBuilder from "@/app/ServerComponent/QueryBuilder";
import Results from "@/app/ServerComponent/Results";
import { useUser } from "@/app/contexts/UserContext";
import { useRouter } from "next/navigation";
import {
  fetchBuckets,
  fetchMeasurements,
  fetchFields,
  fetchTags,
  fetchTagsKeys,
  createDataSource,
  createDashBoard, //newly added
} from "@/app/utils/api";
import {
  BucketMeasurements,
  BucketFields,
  BucketTags,
  BucketTagsKeys,
  FilterConfig,
  DataThresholdFilterConfig
} from "@/app/types/types";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import DraggableMeasurementItem from "@/app/ServerComponent/DraggableMeasurementItem";
import DraggableFieldItem from "@/app/ServerComponent/DraggableFieldItem";
import DraggableFilterItem from "@/app/ServerComponent/DraggableFilterItem";
import DataThreshold from "@/app/ServerComponent/DataThreshold";
import TimeRangeSelector from "@/app/ServerComponent/TimeRange";
import SortSelector from "@/app/ServerComponent/Sort";

export default function Main() {
  const { url, orgId, token } = useUser();
  const router = useRouter();

  // Data fetching area
  const [bucketMeasurements, setBucketMeasurements] =
    useState<BucketMeasurements>({});
  const [bucketFields, setBucketFields] = useState<BucketFields>({});
  const [bucketTags, setBucketTags] = useState<BucketTags>({});
  const [bucketTagsKeys, setBucketTagsKeys] = useState<BucketTagsKeys>({});
  const [isLoading, setIsLoading] = useState(true);

  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [selectedMeasurements, setSelectedMeasurements] = useState<string[]>(
    []
  );
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  // Dialog state
  const [dataThresholdDialogOpen, setDataThresholdDialogOpen] = useState(false);
  const [timeRangeDialogOpen, setTimeRangeDialogOpen] = useState(false);
  const [sortDialogOpen, setSortDialogOpen] = useState(false);

  // Temporary storage for the filter being configured
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);

  const [selectedFilters, setSelectedFilters] = useState<FilterConfig[]>([]);

  // New state for the active draggable item
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);

  // State to hold the generated Flux query
  const [generatedQuery, setGeneratedQuery] = useState<string>("");
  const [IsDataSourceCreated, setIsDataSourceCreated] = useState<boolean>(false);
  const [currentDataSource, setCurrentDataSource] = useState<string | null>(null);
  const [IsDashboardCreated, setIsDashboardCreated] = useState<boolean>(false);
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
  const [isTableSet, setIsTableSet] = useState(false);
  const [DataSourceName, setDataSourceName] = useState<string>(""); // Moved DataSourceName to state
 
  const formatDateForInflux = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  useEffect(() => {
    if (!url || !orgId || !token) {
      router.push("/");
    } else {
      setIsLoading(true);
      fetchBuckets(url, orgId, token).then(async (buckets) => {
        try {
          const measurements: BucketMeasurements = {};
          const fields: BucketFields = {};
          const tags: BucketTags = {};
          const tagsKeys: BucketTagsKeys = {};

          for (const bucket of buckets) {
            measurements[bucket] = await fetchMeasurements(url, token, bucket);
            fields[bucket] = await fetchFields(url, token, bucket);
            // tags[bucket] = await fetchTags(url, token, bucket);
            tagsKeys[bucket] = await fetchTagsKeys(url, token, bucket);
          }

          setBucketMeasurements(measurements);
          setBucketFields(fields);
          // setBucketTags(tags);
          setBucketTagsKeys(tagsKeys);
          console.log("Bucket Measurements:", measurements);
          console.log("Bucket Fields:", fields);
          // console.log("Bucket Tags:", tags);
          console.log("Bucket Tags Keys:", tagsKeys);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      });
    }
  }, [url, orgId, token, router]);

  useEffect(() => {
    // Reset selected measurements when the bucket changes
    setSelectedMeasurements([]);
    setSelectedFields([]);
  }, [selectedBucket]);

  useEffect(() => {
    if (!selectedBucket) {
      setSelectedFields([]);
      return;
    }

    // Get all valid fields from current selected measurements
    const validFields = selectedMeasurements.flatMap(
      (measurement) => bucketFields[selectedBucket]?.[measurement] || []
    );

    // Update selectedFields to only include fields that are still valid
    setSelectedFields((prevFields) =>
      prevFields.filter((field) => validFields.includes(field))
    );
  }, [selectedMeasurements, bucketFields, selectedBucket]);

  // Logic for data threshold filter, when selected fields change, remove any Data Threshold filters that are no longer valid
  useEffect(() => {
    // When selectedFields changes, remove any Data Threshold filters that are no longer valid
    setSelectedFilters((prevFilters) =>
      prevFilters.filter((filter) => {
        if (filter.filter !== "Data Threshold") {
          // Keep filters that are not Data Threshold
          return true;
        }
        // For Data Threshold filters, check if the field is still in selectedFields
        const field = filter.config.field;
        return selectedFields.includes(field);
      })
    );
  }, [selectedFields]);

  // useEffect(() => {
  //   console.log("Selected Measurements in main page:", selectedMeasurements);
  //   console.log("Selected Fields in main page:", selectedFields);
  //   console.log("Selected Filters in main page:", selectedFilters);
  //   console.log("Generated Query in main page:", generatedQuery);
  // }, [selectedMeasurements, selectedFields, selectedFilters, generatedQuery]);

  // Create Data Source on Grafana
  const grafanaUrl = process.env.GRAFANA_URL || "";
  const bearerToken = process.env.BEARER_TOKEN || "";
  
  if (!grafanaUrl || !bearerToken) {
    throw new Error("Grafana URL or Bearer Token is missing.");
  }

  useEffect(() => {
    async function initializeData() {
      if (!url || !orgId || !token) {
        router.push("/");
      } else {
        setIsLoading(true);
        try {
          if (selectedBucket) {
            const DataSourceNameTemp = `${url}_${selectedBucket}`;
            setDataSourceName(DataSourceNameTemp);

            const dataSourceResponse = await createDataSource(
              grafanaUrl,
              bearerToken,
              DataSourceNameTemp,
              url,
              orgId,
              selectedBucket,
              token
            );
            //console.log("Data source response:", dataSourceResponse);

            if (dataSourceResponse != null) {
              console.log(
                "Data source created successfully:",
                dataSourceResponse.dataSource
              );
              setIsDataSourceCreated(true);
              setCurrentDataSource(DataSourceNameTemp);
            } else {
              console.error(
                "Failed to create data source:",
                dataSourceResponse.error
              );
            }
          }
        } catch (error) {
          console.error("Error initializing data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    initializeData();
  }, [url, orgId, token, selectedBucket, router]);

  useEffect(() => {
    const createDashboard = async () => {
      console.log("Selected Measurements in main page:", selectedMeasurements);
      console.log("Selected Fields in main page:", selectedFields);
      console.log("Selected Filters in main page:", selectedFilters);
      console.log("Generated Query in main page:", generatedQuery);
      console.log("Current Data Source:", currentDataSource);
      console.log("Dashboard created:", IsDashboardCreated);
      console.log("Dashboard URL:", dashboardUrl);
      if (isTableSet) {
        console.log("Table is set");
        if (IsDataSourceCreated && selectedBucket) {
          const dashboardTitle = DataSourceName;
          const dashboardResponse = await createDashBoard(
            grafanaUrl,
            bearerToken,
            dashboardTitle,
            DataSourceName,
            selectedBucket,
            generatedQuery
          );
          console.log("Dashboard response:", dashboardResponse);

          if (dashboardResponse.success) {
            console.log(
              "Dashboard created or updated successfully:",
              dashboardResponse.dashboard
            );

            setIsDashboardCreated(true);
            const fullDashboardUrl = `${grafanaUrl}/d/${dashboardResponse.dashboard.uid}?orgId=1&kiosk&api_key=${bearerToken}`; //
            //console.log("Full Dashboard URL:", fullDashboardUrl);
            //const fullDashboardUrl = `${grafanaUrl}${dashboardResponse.dashboard.url}`;
            setDashboardUrl(fullDashboardUrl);
          } else {
            console.error(
              "Failed to create or update dashboard:",
              dashboardResponse.error
            );
          }
        }
      } else {
        console.log("Tab is not set");
      }
    };

    createDashboard();
  }, [
    selectedMeasurements,
    selectedFields,
    selectedFilters,
    generatedQuery,
    IsDataSourceCreated,
    currentDataSource,
    IsDashboardCreated,
    dashboardUrl,
    isTableSet,
    DataSourceName, // Added DataSourceName to dependencies
    selectedBucket,
  ]);

  useEffect(() => {
    const generateQuery = () => {
      if (!selectedBucket) return "";
  
      let query = `from(bucket: "${selectedBucket}")\n`;
  
      // Add time range filter
      const timeRangeFilter = selectedFilters.find(
        (filter) => filter.filter === "Time Range"
      );
      if (
        timeRangeFilter &&
        timeRangeFilter.config.startDateTime &&
        timeRangeFilter.config.endDateTime
      ) {
        const startDateTime = formatDateForInflux(
          timeRangeFilter.config.startDateTime
        );
        const endDateTime = formatDateForInflux(
          timeRangeFilter.config.endDateTime
        );
        query += `  |> range(start: ${startDateTime}, stop: ${endDateTime})\n`;
      } else {
        query += `  |> range(start: -1h)\n`;
      }
  
      // Add measurement filter
      if (selectedMeasurements.length > 0) {
        const measurementFilter = selectedMeasurements
          .map((m) => `r["_measurement"] == "${m}"`)
          .join(" or ");
        query += `  |> filter(fn: (r) => ${measurementFilter})\n`;
      }
  
      // Add field filter
      if (selectedFields.length > 0) {
        const fieldFilter = selectedFields
          .map((f) => `r["_field"] == "${f}"`)
          .join(" or ");
        query += `  |> filter(fn: (r) => ${fieldFilter})\n`;
      }

      // Sort filter
      const sortFilter = selectedFilters.find((filter) => filter.filter === "Sort");
      if (sortFilter && sortFilter.config.column && sortFilter.config.order) {
        const column = sortFilter.config.column.toLowerCase(); // Make sure column is lower case
        const isDescending = sortFilter.config.order === "Descending";

        if (column === "time") {
          query += `  |> sort(columns: ["_time"], desc: ${isDescending})\n`;
        } else if (column === "value") {
          query += `  |> sort(columns: ["_value"], desc: ${isDescending})\n`;
        }
      }
  
      // Add custom filters like Data Threshold
      selectedFilters.forEach((filter) => {
        if (filter.filter === "Data Threshold") {
          const { field, condition, value, minValue, maxValue } = filter.config;
          let filterCondition = "";
          switch (condition) {
            case "Is":
              filterCondition = `r["_field"] == "${field}" and r._value == ${value}`;
              break;
            case "Is not":
              filterCondition = `r["_field"] == "${field}" and r._value != ${value}`;
              break;
            case "Greater than":
              filterCondition = `r["_field"] == "${field}" and r._value > ${value}`;
              break;
            case "Less than":
              filterCondition = `r["_field"] == "${field}" and r._value < ${value}`;
              break;
            case "Between":
              filterCondition = `r["_field"] == "${field}" and r._value >= ${minValue} and r._value <= ${maxValue}`;
              break;
            case "Greater than or equal to":
              filterCondition = `r["_field"] == "${field}" and r._value >= ${value}`;
              break;
            case "Less than or equal to":
              filterCondition = `r["_field"] == "${field}" and r._value <= ${value}`;
              break;
            case "Is empty":
              filterCondition = `r["_field"] == "${field}" and exists r._value == false`;
              break;
            case "Is not empty":
              filterCondition = `r["_field"] == "${field}" and exists r._value == true`;
              break;
          }
          query += `  |> filter(fn: (r) => ${filterCondition})\n`;
        }
      });
  
      query += '  |> yield(name: "result")';
      return query;
    };
  
    // Generate and set the query
    const newQuery = generateQuery();
    setGeneratedQuery(newQuery);  // Use this for both Grafana and Results
  }, [selectedBucket, selectedMeasurements, selectedFields, selectedFilters]);
  
  
  
  const handleSelectField = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleSelectFilter = (filter: FilterConfig) => {
    setSelectedFilters((prev) => [...prev, filter]);
  };

  const handleRemoveFilter = (filterToRemove: FilterConfig) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.filter(
        (filter) =>
          filter.filter !== filterToRemove.filter ||
          filter.config !== filterToRemove.config
      )
    );
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveId(active.id);
    setActiveType(active.data.current?.type);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);

    if (over && over.id) {
      const type = active.data.current?.type;

      if (type === "measurement" && over.id === "measurement-drop-area") {
        const measurement = active.id;
        setSelectedMeasurements((prev) =>
          prev.includes(measurement) ? prev : [...prev, measurement]
        );
      } else if (type === "field" && over.id === "field-drop-area") {
        const field = active.id;
        setSelectedFields((prev) =>
          prev.includes(field) ? prev : [...prev, field]
        );
      } else if (type === "filter" && over.id === "filter-drop-area") {
        const filter = active.id;
        if (filter === "Data Threshold") {
          // Open DataThreshold dialog
          setCurrentFilter("Data Threshold");
          setDataThresholdDialogOpen(true);
        } else if (filter === "Time Range") {
          setTimeRangeDialogOpen(true);
          setCurrentFilter("Time Range");
        }else if (filter === "Sort") {
          setSortDialogOpen(true);
          setCurrentFilter("Sort");
        } else {
          // Handle other filters similarly
          // For other filters, add them directly to selectedFilters
          setSelectedFilters((prev) => [...prev, { filter, config: {} }]);
        }
      }
    }
  };

  const handleDataThresholdSave = (config: DataThresholdFilterConfig) => {
    // Add the filter with its configuration to selectedFilters
    const newFilter = { filter: "Data Threshold", config: config.config };
    setSelectedFilters((prev) => [...prev, newFilter]);
    setDataThresholdDialogOpen(false);
    setCurrentFilter(null);
  };

  const handleTimeRangeSave = (config: FilterConfig) => {
    setSelectedFilters((prev) => [...prev, config]);
    setTimeRangeDialogOpen(false);
    setCurrentFilter(null);
  };

  const handleSortSave = (config: FilterConfig) => {
    setSelectedFilters((prev) => [...prev, config]);
    setSortDialogOpen(false);
    setCurrentFilter(null);
  };

  const handleTimeRangeClose = () => {
    setTimeRangeDialogOpen(false);
    setCurrentFilter(null);
  };

  const handleDataThresholdClose = () => {
    setDataThresholdDialogOpen(false);
    setCurrentFilter(null);
  };

  const handleSortClose = () => {
    setSortDialogOpen(false);
    setCurrentFilter(null);
  };

  return (
    <>
      <Header />
      <NavBar />
      <div className="flex flex-col min-h-screen bg-[#0B090A] bottom-4">
        <div className="flex flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center w-full">
              <p>Loading...</p>
            </div>
          ) : (
            <DndContext
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              autoScroll={false}
            >
              <Sidebar
                buckets={Object.keys(bucketMeasurements)}
                bucketMeasurements={bucketMeasurements}
                bucketFields={bucketFields}
                selectedBucket={selectedBucket}
                selectedMeasurements={selectedMeasurements}
                onSelectBucket={setSelectedBucket}
                onSelectMeasurement={(measurement) =>
                  setSelectedMeasurements((prev) =>
                    prev.includes(measurement) ? prev : [...prev, measurement]
                  )
                }
                selectedFields={selectedFields}
                onSelectField={handleSelectField}
                selectedFilters={selectedFilters}
                onSelectFilter={handleSelectFilter}
              />
              <div className="flex flex-col w-full space-y-4">
                <QueryBuilder
                  selectedMeasurements={selectedMeasurements}
                  selectedFields={selectedFields}
                  onRemoveMeasurement={(measurement) => {
                    setSelectedMeasurements((prevMeasurements) =>
                      prevMeasurements.filter((m) => m !== measurement)
                    );
                  }}
                  onRemoveField={(field) => {
                    setSelectedFields((prevFields) =>
                      prevFields.filter((f) => f !== field)
                    );
                  }}
                  selectedFilters={selectedFilters}
                  onRemoveFilter={handleRemoveFilter}
                />
                <Results
                  selectedMeasurements={selectedMeasurements}
                  selectedFields={selectedFields}
                  selectedFilters={selectedFilters}
                  selectedBucket={selectedBucket || ""}
                  generatedQuery={generatedQuery}
                  setGeneratedQuery={setGeneratedQuery} 
                  dashboardUrl={dashboardUrl}
                  setIsTableSet={setIsTableSet}// Pass setGeneratedQuery to Results
                />
              </div>
              <DragOverlay>
                {activeId ? (
                  activeType === "measurement" ? (
                    <DraggableMeasurementItem
                      measurement={activeId}
                      isOverlay={true}
                    />
                  ) : activeType === "field" ? (
                    <DraggableFieldItem field={activeId} isOverlay={true} />
                  ) : activeType === "filter" ? (
                    <DraggableFilterItem
                      filter={activeId}
                      isOverlay={true}
                      selectedFilters={selectedFilters}
                    />
                  ) : null
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>
      {dataThresholdDialogOpen && currentFilter === "Data Threshold" && (
        <DataThreshold
          isOpen={dataThresholdDialogOpen}
          onClose={handleDataThresholdClose}
          onSave={handleDataThresholdSave}
          selectedFields={selectedFields}
        />
      )}
      {timeRangeDialogOpen && currentFilter === "Time Range" && (
        <TimeRangeSelector
          isOpen={timeRangeDialogOpen}
          onClose={handleTimeRangeClose}
          onSave={handleTimeRangeSave}
        />
      )}
      {sortDialogOpen && currentFilter === "Sort" && (
        <SortSelector
          isOpen={sortDialogOpen}
          onClose={handleSortClose}
          onSave={handleSortSave}
        />
      )}
      <Footer />
    </>
  );
}
