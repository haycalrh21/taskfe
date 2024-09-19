"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
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
import { PlusIcon, Trash2 } from "lucide-react";
import baseUrl from "@/lib/baseUrl";
import axios from "axios";

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
        Name Reference
      </label>
      <input
        type="text"
        name="reference"
        value={formData.reference}
        onChange={handleChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Enter reference title"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Link Reference
      </label>
      <textarea
        name="link"
        value={formData.link}
        onChange={handleChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Enter reference link"
        rows="3"
        required
      />
    </div>
  </form>
);

const CardReference = () => {
  const [reference, setReference] = useState([]);

  const fetchData = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const { data } = await axios.get(`${baseUrl}/reference/references`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setReference(data);
    } catch (error) {
      console.error("Error fetching references:", error);
    }
  };

  const [formData, setFormData] = useState({
    reference: "",
    link: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.post(
        `${baseUrl}/reference/create-reference`,
        {
          name: formData.reference,
          link: formData.link,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // Clear the form data after successful submission
      setFormData({
        reference: "",
        link: "",
      });
      // Refetch the data to update the list
      fetchData();
    } catch (error) {
      console.error(
        "Error creating reference:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-bold">All References</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Reference
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
                Create Reference
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {reference.map((ref) => (
            <Card
              key={ref._id}
              className="bg-white shadow-lg rounded-lg border border-gray-200"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{ref.name}</h3>
                    <p className="text-sm text-gray-500">{ref.link}</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" size="icon" className="p-1">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CardReference;
