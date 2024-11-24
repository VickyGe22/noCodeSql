import React, { useState } from "react";
import { Play, Edit3, Save, XCircle } from "lucide-react";
import { FilterConfig } from "@/app/types/types";

interface CodeProps {
  onExecuteQuery: (query: string) => Promise<void>;
  generatedQuery: string; // The generated query passed from the parent
  setGeneratedQuery: (query: string) => void; // Allows us to update the query
}

const Code: React.FC<CodeProps> = ({
  onExecuteQuery,
  generatedQuery,
  setGeneratedQuery,
}) => {
  const [isEditing, setIsEditing] = useState(false); // Track whether the query is being edited
  const [editedQuery, setEditedQuery] = useState(generatedQuery); // Local state for the edited query

  // Handle the play button click (execute the query)
  const handlePlayClick = () => {
    onExecuteQuery(generatedQuery); // Execute the current query
  };

  // Toggle edit mode and prepare the query for editing
  const handleEditClick = () => {
    setEditedQuery(generatedQuery); // Set the edited query to the current generated query
    setIsEditing(true); // Switch to edit mode
  };

  // Handle saving the edited query
  const handleSaveClick = () => {
    setGeneratedQuery(editedQuery); // Update the generated query with the edited one
    setIsEditing(false); // Exit edit mode
  };

  // Handle canceling the edit
  const handleCancelClick = () => {
    setEditedQuery(generatedQuery); // Revert any changes made during editing
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className="w-full mt-4">
      <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg w-full">
        <div className="p-4 font-mono text-sm text-black relative flex flex-col">
          {/* If editing, show a textarea; otherwise, show the query in read-only mode */}
          {isEditing ? (
            <textarea
              value={editedQuery}
              onChange={(e) => setEditedQuery(e.target.value)}
              className="w-full h-64 p-2 border border-gray-300 rounded-md font-mono"
              placeholder="Edit the query here..."
            />
          ) : (
            generatedQuery.split("\n").map((line, index) => (
              <div key={index} className="flex">
                <span className="w-8 text-right mr-4 text-gray-500">
                  {index + 1}
                </span>
                <span>{line}</span>
              </div>
            ))
          )}

          {/* Buttons for Edit, Save, Cancel, and Play */}
          <div className="flex justify-end mt-4 space-x-2">
            {isEditing ? (
              <>
                {/* Save Button */}
                <button
                  className="bg-blue-500 rounded-full p-2 hover:bg-blue-400 transition-colors"
                  onClick={handleSaveClick}
                >
                  <Save className="w-4 h-4 text-white" />
                </button>

                {/* Cancel Button */}
                <button
                  className="bg-red-500 rounded-full p-2 hover:bg-red-400 transition-colors"
                  onClick={handleCancelClick}
                >
                  <XCircle className="w-4 h-4 text-white" />
                </button>
              </>
            ) : (
              <button
                className="bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
                onClick={handleEditClick}
              >
                <Edit3 className="w-4 h-4 text-white" />
              </button>
            )}

            <button
              className="bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
              onClick={handlePlayClick}
            >
              <Play className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Code;
