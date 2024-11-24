import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { CardContent } from "@/components/ui/card";
import { FilterConfig } from "@/app/types/types";

const TimeRangeSelector: React.FC<any> = ({ isOpen, onClose, onSave }) => {
  const [startDateTime, setStartDateTime] = useState<string>("");
  const [endDateTime, setEndDateTime] = useState<string>("");

  const handleSave = () => {
    if (onSave && isFormValid()) {
      const filterConfig: FilterConfig = {
        filter: "Time Range",
        config: {
          startDateTime: new Date(startDateTime).toISOString(),
          endDateTime: new Date(endDateTime).toISOString()
        }
      };
      onSave(filterConfig);
    }
  };

  const isFormValid = () => {
    if (!startDateTime || !endDateTime) return false;
  
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
  
    return !isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end;
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Time Range Selector</AlertDialogTitle>
          <AlertDialogDescription>
            Please select the start and end date-time for the time range.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row items-center space-x-4">
              <label htmlFor="startDateTime" className="text-md font-medium w-1/3">
                Start Date-Time
              </label>
              <input
                id="startDateTime"
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                className="text-black bg-white border border-gray-300 rounded-md px-3 py-2 w-2/3"
              />
            </div>
            <div className="flex flex-row items-center space-x-4">
              <label htmlFor="endDateTime" className="text-md font-medium w-1/3">
                End Date-Time
              </label>
              <input
                id="endDateTime"
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                className="text-black bg-white border border-gray-300 rounded-md px-3 py-2 w-2/3"
              />
            </div>
          </div>
        </CardContent>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave} disabled={!isFormValid()}>
            Save
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TimeRangeSelector;