import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useSession } from "next-auth/react";
import { getTasksFinished, getTasksUnfinished } from "../../../app/action/task";

const CardSide = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState({
    unfinished: 0,
    finished: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const userId = session?.user?._id;

    if (!userId) return; // Jika tidak ada userId, keluar lebih awal

    setLoading(true); // Mulai loading
    try {
      const [unfinishedResponse, finishedResponse] = await Promise.all([
        getTasksUnfinished(userId), // Mendapatkan task yang belum selesai
        getTasksFinished(userId), // Mendapatkan task yang sudah selesai
      ]);

      const unfinishedTasks = JSON.parse(unfinishedResponse);
      const finishedTasks = JSON.parse(finishedResponse);

      setData({
        unfinished: unfinishedTasks.length,
        finished: finishedTasks.length,
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false); // Selesai loading
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const totalTasks = data.unfinished + data.finished;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello, {session?.user?.email}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ?
          <p>Loading...</p>
        : <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Tasks:</span>
              <span className="font-bold">{totalTasks}</span>
            </div>
            <div className="flex justify-between">
              <span>In Progress:</span>
              <span className="font-bold">{data.unfinished}</span>
            </div>
            <div className="flex justify-between">
              <span>Completed:</span>
              <span className="font-bold">{data.finished}</span>
            </div>
          </div>
        }
        {!loading && totalTasks > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Completed vs Pending Tasks</h3>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{
                    width: `${(data.finished / totalTasks) * 100}%`,
                  }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                ></div>
              </div>
            </div>
            <p className="text-sm text-center">
              {data.finished} / {totalTasks} Tasks
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CardSide;
