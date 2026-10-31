
import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import LoginForm from "./components/LoginForm.jsx";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [loggedInAs, setLoggedInAs] = useState("");

  async function fetchTasks() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/api/tasks`);

      if (!res.ok) {
        throw new Error("Failed to fetch tasks.");
      }

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(email, password) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed.");
    }

    setToken(data.token);
    setLoggedInAs(email);
  }

  function handleLogout() {
    setToken("");
    setLoggedInAs("");
  }

  async function handleAddTask(title) {
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
        completed: false,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to add task.");
    }

    await fetchTasks();
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <main className="taskmanager">
      <h1>Task Manager</h1>

      <p className="count">
        {tasks.length} tasks in the catalogue
      </p>

      {loading && <p>Loading tasks...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          {!token ? (
            <LoginForm onLogin={handleLogin} />
          ) : (
            <div>
              <p>Logged in as: {loggedInAs}</p>
              <button onClick={handleLogout}>Logout</button>

              <TaskForm onAdd={handleAddTask} />
            </div>
          )}

          <TaskList tasks={tasks} />
        </>
      )}
    </main>
  );
}

export default App;
