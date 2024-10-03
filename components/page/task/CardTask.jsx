"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";

import { Edit, PlusIcon, StarIcon, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";

import moment from "moment";
import "moment/locale/id"; // Import locale Bahasa Indonesia

import { useSession } from "next-auth/react";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../../../app/action/task";

import { Spinner } from "theme-ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";

moment.locale("id");
const TaskForm = ({ formData, handleChange, handleSubmit }) => (
  <form
    className="space-y-4"
    onSubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}
  >
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Task Title
      </label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Enter task title"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Description
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Enter task description"
        rows="3"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Due Date
      </label>
      <input
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Priority
      </label>
      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
    <div className="flex items-center">
      <input
        id="completed"
        name="completed"
        type="checkbox"
        checked={formData.completed}
        onChange={handleChange}
        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
      />
      <label htmlFor="completed" className="ml-2 block text-sm text-gray-900">
        Completed
      </label>
    </div>
  </form>
);

const CardTask = () => {
  const { data: session, status } = useSession();
  const [data, setDataTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // Tambahkan state untuk loading

  const [editTask, setEditTask] = useState(null);
  const [formData, setFormData] = useState({
    user: session?.user?._id,
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    completed: false,
  });
  const [activeFilter, setActiveFilter] = useState("All");

  const fetchData = async () => {
    setLoading(true); // Mulai loading
    const userId = session?.user?._id;

    if (userId) {
      try {
        const response = await getTasks(userId);
        const tasks = JSON.parse(response);
        setDataTasks(tasks);
        // console.log(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false); // Selesai loading
      }
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const handleEditClick = (task) => {
    setEditTask(task);
    setFormData({
      user: session?.user?._id, // Ensure user is set
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      completed: task.completed,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Pastikan 'editTask' menyimpan ID task yang sedang diedit
      const updatedTask = await updateTask(editTask._id, formData);

      // Update state tasks secara langsung tanpa fetch ulang data
      setDataTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );

      setEditTask(null); // Reset edit task
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "low",
        completed: false,
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Create task logic here
      await createTask(formData);
      fetchData();
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "low",
        completed: false,
      });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const filteredTasks =
    data?.filter((t) => {
      if (activeFilter === "All") return true;
      return t.priority.toLowerCase() === activeFilter.toLowerCase();
    }) || [];
  const formatDate = (dateString) => {
    if (!dateString) {
      console.error("Invalid date input:", dateString);
      return "Tanggal tidak valid";
    }

    try {
      // Menggunakan moment untuk format tanggal
      return moment(dateString).format("DD MMMM YYYY");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Tanggal tidak valid";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">All Tasks</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Create New Reference</AlertDialogTitle>
              <AlertDialogDescription>
                Fill in the details below to create a new reference.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <TaskForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>
                Create Task
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <Tabs value={activeFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {["All", "Low", "Medium", "High"].map((filter) => (
                <TabsTrigger
                  key={filter}
                  value={filter}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeFilter}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {filteredTasks.map((task) => (
                  <Card key={task._id} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {task.description}
                          </p>
                        </div>
                        <StarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            task.priority === "low"
                              ? "bg-green-100 text-green-800"
                              : task.priority === "medium"
                              ? "bg-yellow-500 text-yellow-800"
                              : task.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : ""
                          }`}
                        >
                          {task.priority}
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
                          {task.completed ? "Sudah selesai" : "Belum selesai"}
                        </span>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="p-1"
                            >
                              <Edit
                                className="h-4 w-4 text-blue-500 cursor-pointer"
                                onClick={() => handleEditClick(task)}
                              />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Edit Task</AlertDialogTitle>
                              <AlertDialogDescription>
                                Edit your task details below.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <form
                              onSubmit={handleEditSubmit}
                              className="space-y-4"
                            >
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Task Title
                                </label>
                                <input
                                  type="text"
                                  name="title"
                                  value={formData.title}
                                  onChange={handleChange}
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  placeholder="Enter task title"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Description
                                </label>
                                <textarea
                                  name="description"
                                  value={formData.description}
                                  onChange={handleChange}
                                  rows="3"
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  placeholder="Enter task description"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Priority
                                </label>
                                <select
                                  name="priority"
                                  value={formData.priority}
                                  onChange={handleChange}
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                </select>
                              </div>

                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="completed"
                                  checked={formData.completed}
                                  onChange={handleChange}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm font-medium text-gray-700">
                                  Mark as Completed
                                </label>
                              </div>

                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleEditSubmit}>
                                  Save
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </form>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="p-1"
                            >
                              <Trash2 className="h-4 w-4 text-red-500 cursor-pointer" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Task</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this task?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                <Button type="button">Cancel</Button>
                              </AlertDialogCancel>
                              <AlertDialogAction>
                                <Button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      await deleteTask(task._id);
                                      fetchData();
                                    } catch (error) {
                                      console.error(
                                        "Error deleting task:",
                                        error.response?.data || error.message
                                      );
                                    }
                                  }}
                                  className="bg-red-600 text-white"
                                >
                                  Delete
                                </Button>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default CardTask;
