"use client";
import { createTask } from "@/app/action/task";
import React, { useState } from "react";

const TaskForm = ({ session, onClose, fetchData }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("low");
  const [completed, setCompleted] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("low");
    setCompleted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      title,
      description,
      dueDate,
      priority,
      completed,
      user: session?.user?._id,
    };

    const response = await createTask(formData);

    resetForm();
    onClose(); // Menutup dialog setelah berhasil
    fetchData(); // Memperbarui data tugas
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Judul Tugas
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Update title
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
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Update description
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
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)} // Update dueDate
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Prioritas
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)} // Update priority
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
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)} // Update completed
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
        />
        <label htmlFor="completed" className="ml-2 block text-sm text-gray-900">
          Selesai
        </label>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded"
      >
        Buat Tugas
      </button>
    </form>
  );
};

export default TaskForm;
