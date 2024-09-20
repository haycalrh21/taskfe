"use server";

import connectMongo from "@/lib/mongoDb";
import TaskModel from "../models/taskModel";

export async function getTasks(userId) {
  await connectMongo();

  const tasks = await TaskModel.find({ user: userId }).lean(); // Gunakan .lean() untuk mengonversi ke objek biasa
  return JSON.stringify(tasks);
}

export async function createTask(formData) {
  await connectMongo();

  const task = new TaskModel(formData);
  await task.save();
}

export async function deleteTask(taskId) {
  await connectMongo();

  await TaskModel.findByIdAndDelete(taskId);

  return taskId;
}

export async function updateTask(taskId, formData) {
  await connectMongo();

  // Menggunakan opsi `{ new: true }` untuk mengembalikan dokumen yang telah diperbarui.
  const updatedTask = await TaskModel.findByIdAndUpdate(taskId, formData, {
    new: true,
  }).lean(); // Mengubah ke plain object

  if (!updatedTask) {
    throw new Error("Task not found");
  }

  return updatedTask;
}
