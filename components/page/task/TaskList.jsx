import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import TaskCard from "./TaskCard";

// Helper function to filter tasks based on the active filter
const TaskList = ({
  tasks,
  activeFilter,
  setActiveFilter,
  session,
  fetchData,
}) => {
  // Available filters
  const filters = ["all", "low", "medium", "high"]; // Filter yang ada

  // Filter the tasks based on the activeFilter
  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "all") return true; // Show all tasks
    return task.priority === activeFilter; // Filter by priority
  });

  return (
    <div>
      <Tabs value={activeFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {filters.map((filter) => (
            <TabsTrigger
              key={filter}
              value={filter}
              onClick={() => setActiveFilter(filter)} // Update active filter on click
            >
              {filter}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeFilter}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                session={session}
                fetchData={fetchData}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskList;
