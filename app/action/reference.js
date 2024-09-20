"use server";

import connectMongo from "@/lib/mongoDb";

import ReferenceModel from "../models/referenceModel";

export async function getReference(userId) {
  await connectMongo();

  const reference = await ReferenceModel.find({ user: userId }).lean(); // Gunakan .lean() untuk mengonversi ke objek biasa
  return JSON.stringify(reference);
}

export async function createReference(formData) {
  await connectMongo();

  const reference = new ReferenceModel(formData);
  await reference.save();
}

export async function deleteReference(referenceId) {
  await connectMongo();

  await ReferenceModel.findByIdAndDelete(referenceId);

  return referenceId;
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
