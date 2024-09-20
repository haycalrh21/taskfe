"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getTasks } from "@/app/action/task";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getReference } from "@/app/action/reference";
import moment from "moment"; // Import Moment.js

export const description = "A multiple bar chart";

const chartConfig = {
  tasks: {
    label: "Tasks",
    color: "hsl(var(--chart-1))",
  },
  references: {
    label: "References",
    color: "hsl(var(--chart-2))",
  },
};

export default function MyChart() {
  const { data: session, status } = useSession();
  const [dataTasks, setDataTasks] = useState([]);
  const [dataReferences, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const userId = session?.user?._id;

    if (userId) {
      try {
        const response = await getTasks(userId);
        const tasks = JSON.parse(response);
        setDataTasks(tasks);
        console.log("Tasks:", tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchDataReference = async () => {
    setLoading(true);
    const userId = session?.user?._id;

    if (userId) {
      try {
        const response = await getReference(userId);
        const references = JSON.parse(response);
        setReferences(references);
        console.log("References:", references);
      } catch (error) {
        console.error("Error fetching references:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
      fetchDataReference();
    }
  }, [status]);

  // Gabungkan data tasks dan references menjadi chartData
  const chartData = [];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  months.forEach((month, index) => {
    const monthTasks = dataTasks.filter(
      (task) => moment(task.date).month() === index
    );
    const monthReferences = dataReferences.filter(
      (reference) => moment(reference.date).month() === index
    );

    chartData.push({
      month,
      tasks: monthTasks.length,
      references: monthReferences.length,
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="tasks" fill="var(--color-tasks)" radius={4} />
            <Bar
              dataKey="references"
              fill="var(--color-references)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total tasks and references for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
