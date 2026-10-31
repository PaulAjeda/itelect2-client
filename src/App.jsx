
import { useState } from "react";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import "./App.css";

const STARTING_TASKS = [
  { id: 1, title: "Buy groceries", completed: false },
  { id: 2, title: "Walk the dog", completed: true },
  { id: 3, title: "Finish project", completed: false },
];

function App() {
  const [tasks, setTasks] = useState(STARTING_TASKS);

  function addTask(title) {
    const newTask = {
      id: Date.now(),
      title: title,
      completed: false,
    };

    setTasks([...tasks, newTask]);
  }

  return (
    <main className="taskmanager">
      <h1>Task Manager</h1>

      <p className="count">
        {tasks.length} tasks in the catalogue
      </p>

      <TaskForm onAdd={addTask} />

      <TaskList tasks={tasks} />
    </main>
  );
}

export default App;
