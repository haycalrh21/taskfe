import { useTaskContext } from "../server/TaskContext";
const useTask = () => {
  const context = useTaskContext();
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

export default useTask;
