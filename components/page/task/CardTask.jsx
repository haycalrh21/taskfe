import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import axios from "axios";
import { Edit, PlusIcon, StarIcon, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
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
} from "@/components/ui/alert-dialog";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import baseUrl from "@/lib/baseUrl";

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

const CardTask = ({ setTotalTasks }) => {
  const [taskUpdated, setTaskUpdated] = useState(false);

  useEffect(() => {
    if (taskUpdated) {
      fetchTasks();
      setTaskUpdated(false); // Reset the flag after fetching
    }
  }, [taskUpdated]);
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    completed: false,
  });
  const [activeFilter, setActiveFilter] = useState("All");
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${baseUrl}/task/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        setTasks(response.data);
      } else {
        setError(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      setError(error.response?.data || error.message);
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEditClick = (task) => {
    if (!task._id) {
      console.error("Task ID is missing in the task object.");
      return;
    }
    setEditTask(task);
    setFormData({
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
    if (!editTask?._id) {
      console.error("Task ID is missing.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.patch(
        `${baseUrl}/task/edit/${editTask._id}`,
        {
          title: formData.title,
          description: formData.description,
          completed: formData.completed,
          priority: formData.priority,
          // Jangan sertakan dueDate
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        fetchTasks();
        setEditTask(null);
      } else {
        "Unexpected response status:", response.status;
      }
    } catch (error) {
      console.error(
        "Error updating task:",
        error.response?.data || error.message
      );
    }
  };

  const filteredTasks =
    tasks?.filter((t) => {
      if (activeFilter === "All") return true;
      return t.priority.toLowerCase() === activeFilter.toLowerCase();
    }) || [];

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd MMMM yyyy", { locale: id });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Tanggal tidak valid";
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.post(`${baseUrl}/task/create-task`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      // Fetch ulang tasks setelah task baru ditambahkan
      // Clear form setelah berhasil submit
      setTaskUpdated(true);
      fetchTasks();
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "low",
        completed: false,
      });
      setTaskUpdated(true);
      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
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
                        <h3 className="font-semibold text-lg">{task.title}</h3>
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
                          <Button variant="outline" size="icon" className="p-1">
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

                            {/* Hapus bagian input tanggal */}
                            {/* <div>
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
  </div> */}

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
                              <AlertDialogCancel>
                                <Button type="button">Cancel</Button>
                              </AlertDialogCancel>
                              <AlertDialogAction>
                                <Button type="submit">Save</Button>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </form>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="p-1">
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
                                    const token =
                                      localStorage.getItem("authToken");
                                    await axios.delete(
                                      `${baseUrl}/task/task/${task._id}`,
                                      {
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                        withCredentials: true,
                                      }
                                    );
                                    fetchTasks();
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
      </CardContent>
    </Card>
  );
};

export default CardTask;
