import React, { useState } from "react";
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
} from "@/components/ui/alert-dialog";

import { updateTask } from "@/app/action/task";
import { Pencil } from "lucide-react";

const EditTaskDialog = ({ task, onEditSubmit }) => {
  // State untuk form data
  const [formData, setFormData] = useState({
    title: task.title || "",
    description: task.description || "",
    dueDate: task.dueDate || "",
    priority: task.priority || "low",
    completed: task.completed || false,
  });

  // Handler untuk perubahan input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await updateTask(task._id, formData);
    onEditSubmit(response);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Pencil className=" h-8 w-8 text-black border rounded-s-none border-black cursor-pointer " />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Task</AlertDialogTitle>
          <AlertDialogDescription>
            Edit your task details below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Judul Tugas
            </label>
            <input
              type="text"
              name="title"
              value={formData.title} // Pastikan ada nilai default
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Masukkan judul tugas"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Deskripsi
            </label>
            <textarea
              name="description"
              value={formData.description} // Pastikan ada nilai default
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Masukkan deskripsi tugas"
              rows="3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tenggat Waktu
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate} // Pastikan ada nilai default
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prioritas
            </label>
            <select
              name="priority"
              value={formData.priority} // Pastikan ada nilai default
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="low">Rendah</option>
              <option value="medium">Sedang</option>
              <option value="high">Tinggi</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              id="completed"
              name="completed"
              type="checkbox"
              checked={formData.completed} // Pastikan ada nilai default
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label
              htmlFor="completed"
              className="ml-2 block text-sm text-gray-900"
            >
              Selesai
            </label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit" className="bg-blue-600 text-white">
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditTaskDialog;
