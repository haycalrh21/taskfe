"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  GithubIcon,
  MenuIcon,
  MoonIcon,
  PlusIcon,
  UserIcon,
} from "lucide-react";
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
import axios from "axios";
import UserContext from "@/app/server/userContext";

import baseUrl from "@/lib/baseUrl";
import { useTaskContext } from "@/app/server/TaskContext";

const TaskForm = ({ formData, handleChange, handleSubmit }) => (
  <form className="space-y-4">
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

const Header = ({ toggleSidebar, totalTasks }) => {
  const { user, logout } = useContext(UserContext);
  const { fetchTasks } = useTaskContext(); // Untuk refresh task setelah submit

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    completed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  useEffect(() => {
    fetchTasks();
  }, []);
  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `${baseUrl}/task/create-task`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      fetchTasks(); // Refresh task list setelah submit
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="md:hidden mr-2"
              onClick={toggleSidebar}
            >
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Open sidebar</span>
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                👋 Welcome, {user?.name}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                You have {totalTasks} active tasks
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Create New Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Fill in the details below to create a new task.
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
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <GithubIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <MoonIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <UserIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
