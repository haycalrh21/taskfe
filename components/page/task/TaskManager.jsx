"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { PlusIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Spinner } from "theme-ui";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { createTask, deleteTask, getTasks } from "../../../app/action/task";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../../../components/ui/alert-dialog";

const TaskManager = () => {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const userId = session?.user?._id;

    if (userId) {
      try {
        const response = await getTasks(userId);
        const tasks = JSON.parse(response);
        console.log("Fetched tasks:", tasks);
        setTasks(tasks);
      } catch (error) {
        // console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [session?.user?._id]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [fetchData, status]);

  // Fungsi untuk membuka dan menutup modal
  const openModal = () => setIsDialogOpen(true);
  const closeModal = () => setIsDialogOpen(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">All Tasks</CardTitle>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={openModal}
            >
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
              session={session}
              onClose={closeModal} // Menutup dialog saat panggil fungsi ini
              fetchData={fetchData}
            />
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            session={session}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            deleteTask={deleteTask}
            fetchData={fetchData}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TaskManager;
