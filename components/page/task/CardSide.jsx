import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import axios from "axios";

const CardSide = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello, hrayhansyah@gmail.com</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Tasks:</span>
            {/* <span className="font-bold">{totalTasks}</span> */}
          </div>
          <div className="flex justify-between">
            <span>In Progress:</span>
            {/* <span className="font-bold">{totalTasks - completedTasks}</span> */}
          </div>
          <div className="flex justify-between">
            <span>Open Tasks:</span>
            {/* <span className="font-bold">{totalTasks - completedTasks}</span> */}
          </div>
          <div className="flex justify-between">
            <span>Completed:</span>
            {/* <span className="font-bold">{completedTasks}</span> */}
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Completed vs Pending Tasks</h3>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              {/* <div
                style={{
                  width: `${(completedTasks / totalTasks) * 100}%`,
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
              ></div> */}
            </div>
          </div>
          <p className="text-sm text-center">
            {/* {completedTasks} / {totalTasks} Tasks */}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardSide;
