import React, { useState, useEffect } from "react";
import Tab from "../../components/ui/tabs";
import Code from "./ResultsTab/code";
import { ResultTable } from "./ResultsTab/Table/table";
import { Visualisation } from "./ResultsTab/visualisation";
import { FilterConfig } from "../types/types";
import { useUser } from "@/app/contexts/UserContext";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BotIcon } from "lucide-react";

interface ResultsProps {
  selectedMeasurements: string[];
  selectedFields: string[];
  selectedFilters: FilterConfig[];
  selectedBucket: string;
  generatedQuery: string;
  setGeneratedQuery: (query: string) => void;
  dashboardUrl: string | null;
  setIsTableSet: (isTableSet: boolean) => void;
}

export interface QueryResult {
  _time: string;
  _value: number;
  _field: string;
  _measurement: string;
  [key: string]: any;
}

const Results: React.FC<ResultsProps> = ({
  selectedMeasurements,
  selectedFields,
  selectedFilters,
  selectedBucket,
  generatedQuery,
  setGeneratedQuery,
  dashboardUrl,
  setIsTableSet,
}) => {
  const [currentTab, setCurrentTab] = useState("Code");
  const [queryResult, setQueryResult] = useState<QueryResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { url, orgId, token } = useUser();

  // Define the tabs array
  const tabs = [
    { name: "Code", href: "#", current: currentTab === "Code" },
    { name: "Table", href: "#", current: currentTab === "Table" },
    { name: "Visualisation", href: "#", current: currentTab === "Visualisation" },
  ];


  const handleTabClick = (tab: { name: string; href: string }) => {
    setCurrentTab(tab.name);
  };

  const handleQueryExecution = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/executeQuery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          bucket: selectedBucket,
          url,
          orgId,
          token,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to execute query");
      }

      const data = await response.json();
      setQueryResult(data);
      setCurrentTab("Table"); // Automatically switch to Table tab
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#1D191A] rounded-lg mt-4 ml-12 w-[1200px] h-auto flex flex-col">
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-2">
          <div className="text-white text-lg font-semibold">Results</div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                <BotIcon className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[600px] h-[700px] absolute bottom-12 right-0">
              <iframe
                src="https://udify.app/chatbot/roIAuMlqcsMm2g3d"
                className="w-full h-full"
                frameBorder="0"
                allow="microphone"
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="p-2 bg-[#4D494A] rounded-lg h-13">
          <Tab tabs={tabs} onTabClick={handleTabClick} />
        </div>
      </div>

      <div className="flex flex-col items-center w-full mt-4 space-y-4">
        {currentTab === "Code" && (
          <Code
            onExecuteQuery={handleQueryExecution}
            generatedQuery={generatedQuery}
            setGeneratedQuery={setGeneratedQuery}
          />
        )}
        {currentTab === "Table" && (
          <ResultTable
            data={queryResult || []}
            bucket={selectedBucket}
            setIsTableSet={setIsTableSet}
          />
        )}
        {currentTab === "Visualisation" && (
          <Visualisation data={queryResult} dashboardUrl={dashboardUrl} />
        )}
        {isLoading && <div className="text-white">Loading...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}
      </div>
    </div>
  );
};

export default Results;