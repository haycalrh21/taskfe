"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import baseUrl from "@/lib/baseUrl";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);

  // Hanya fokus pada fetching data
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${baseUrl}/task/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setTasks(response.data);
    } catch (error) {
      console.error(
        "Error fetching tasks:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        fetchTasks,
        editTask,
        setEditTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
