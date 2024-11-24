import React from "react";
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { FaTimes } from "react-icons/fa";
import { FilterConfig } from "@/app/types/types";

interface QueryBuilderProps {
  selectedMeasurements: string[];
  selectedFields: string[];
  onRemoveMeasurement: (measurement: string) => void;
  onRemoveField: (field: string) => void;
  selectedFilters: FilterConfig[];
  onRemoveFilter: (filter: FilterConfig) => void;
}

function QueryBuilder({
  selectedMeasurements,
  selectedFields,
  selectedFilters,
  onRemoveMeasurement,
  onRemoveField,
  onRemoveFilter,
}: QueryBuilderProps) {
  const [showDragArea, setShowDragArea] = useState(false);

  const handleFilterClick = () => {
    setShowDragArea(!showDragArea);
  };

  // Measurement drop area
  const { isOver: isOverMeasurements, setNodeRef: setNodeRefMeasurements } =
    useDroppable({
      id: "measurement-drop-area",
    });

  // Field drop area
  const { isOver: isOverFields, setNodeRef: setNodeRefFields } = useDroppable({
    id: "field-drop-area",
  });

  // Filter drop area
  const { isOver: isOverFilters, setNodeRef: setNodeRefFilters } = useDroppable(
    {
      id: "filter-drop-area",
    },
  );

  return (
    <div className="flex flex-col space-y-4 p-6 bg-[#1D191A] rounded-lg mt-6 ml-12 w-[1200px] h-auto">
      <div className="text-white text-lg font-semibold">Query Builder</div>

      <div className="flex flex-col space-y-4">
        <label className="text-white">Measurement</label>
        <div
          ref={setNodeRefMeasurements}
          className={`p-2 bg-[#8EC1C3] text-black rounded h-auto ${
            isOverMeasurements ? "bg-blue-200" : ""
          }`}
        >
          {selectedMeasurements.length > 0 ? (
            <div className="flex flex-wrap">
              {selectedMeasurements.map((measurement) => (
                <div
                  key={measurement}
                  className="flex items-center bg-blue-500 text-white rounded-full px-3 py-1 m-1"
                >
                  <span>{measurement}</span>
                  <button
                    onClick={() => onRemoveMeasurement(measurement)}
                    className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <img 
                src="/icon/drop.png"
                alt="Loading" 
                className="w-8 h-8 mr-2" 
              />
              <p className="text-center">Drag measurements to start analyse</p>
            </div>
          )}
        </div>
      </div>

      {/* Fields Section */}
      <div className="flex flex-col space-y-2">
        <label className="text-white">Fields</label>
        <div
          ref={setNodeRefFields}
          className={`p-2 bg-[#D8E59D] text-black rounded h-auto ${
            isOverFields ? "bg-blue-200" : ""
          }`}
        >
          {selectedFields.length > 0 ? (
            <div className="flex flex-wrap">
              {selectedFields.map((field: any) => (
                <div
                  key={field}
                  className="flex items-center bg-green-500 text-white rounded-full px-3 py-1 m-1"
                >
                  <span>{field}</span>
                  <button
                    onClick={() => onRemoveField(field)}
                    className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <img 
                src="/icon/drop.png"
                alt="Loading" 
                className="w-8 h-8 mr-2" 
              />
              <p className="text-center">Drag fields to select your data</p>
            </div>
          )}
        </div>
      </div>

      {/* Filters Section */}

      <div className="flex flex-col space-y-2">
        <label className="text-white">Filters</label>
        <div
          ref={setNodeRefFilters}
          className={`p-2 bg-[#E3A8A7] text-black rounded h-auto ${
            isOverFilters ? "bg-blue-200" : ""
          }`}
        >
          {selectedFilters.length > 0 ? (
            <div className="flex flex-wrap">
              {selectedFilters.map((filterObj, index) => {
                let filterDescription = filterObj.filter;
                if (filterObj.filter === "Time Range") {
                  const { startDateTime, endDateTime } = filterObj.config;
                  filterDescription = `${filterObj.filter}: From ${startDateTime} to ${endDateTime}`;
                } else if (filterObj.filter === "Data Threshold") {
                  const { field, condition, value, minValue, maxValue } =
                    filterObj.config;
                  if (condition === "Between") {
                    filterDescription = `${filterObj.filter}: ${field} ${condition} ${minValue} and ${maxValue}`;
                  } else if (
                    condition === "Is empty" ||
                    condition === "Is not empty"
                  ) {
                    filterDescription = `${filterObj.filter}: ${field} ${condition}`;
                  } else {
                    filterDescription = `${filterObj.filter}: ${field} is ${condition} ${value}`;
                  }
                } else if (filterObj.filter === "Sort") {
                  const { column, order } = filterObj.config;
                  filterDescription = `${filterObj.filter}: ${column} ${order}`;
                }

                return (
                  <div
                    key={`${filterObj.filter}-${index}`}
                    className="flex items-center bg-red-500 text-white rounded-full px-3 py-1 m-1"
                  >
                    <span>{filterDescription}</span>
                    <button
                      onClick={() => onRemoveFilter(filterObj)}
                      className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                    >
                      <FaTimes />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <img 
                src="/icon/drop.png"
                alt="Loading" 
                className="w-8 h-8 mr-2" 
              />
              <p className="text-center">Drag filters to tailor your data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QueryBuilder;
