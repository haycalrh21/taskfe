import React from "react";
import { Card, CardContent } from "../../ui/card";
import { StarIcon, Edit, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../../components/ui/alert-dialog";
import { formatDate } from "@/lib/dataTime";
import EditTaskDialog from "./EditTaskDialog";
import { deleteTask } from "@/app/action/task";

const TaskCard = ({
  task,
  handleEditClick,

  fetchData,
  setTasks,
  handleChange,
}) => {
  const onEditClick = () => {
    handleEditClick(task); // Set the task to be edited
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{task.title}</h3>
            <p className="text-sm text-gray-500">{task.description}</p>
          </div>
          <StarIcon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex justify-between items-center mt-4">
          <span
            className={`text-xs px-2 py-1 rounded ${
              task.priority === "low"
                ? "bg-green-100 text-green-800"
                : task.priority === "medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {task.priority === "low"
              ? "low"
              : task.priority === "medium"
              ? "medium"
              : "high"}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(task.dueDate)}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded ${
              task.completed
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {task.completed ? "completed" : "not completed"}
          </span>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <EditTaskDialog
            task={task}
            formData={{
              title: task.title,
              description: task.description,
              dueDate: task.dueDate,
              priority: task.priority,
              completed: task.completed,
            }}
            handleChange={handleChange}
            fetchData={fetchData}
          />

          {/* Delete Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Trash2 className=" h-8 w-8 text-red-500 border rounded-md p-1 border-red-500 cursor-pointer " />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this task?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    try {
                      await deleteTask(task._id);
                      fetchData();
                    } catch (error) {
                      console.error("Error deleting task:", error);
                    }
                  }}
                  className="bg-red-600 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
