import { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTaskCreated = () => {
    // Trigger refresh of task list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📝 Task Hub</h1>
        <p>Administra tus tareas de forma simple y eficiente</p>
      </header>
      
      <main className="app-container">
        <TaskForm onTaskCreated={handleTaskCreated} />
        <TaskList refresh={refreshKey} />
      </main>
    </div>
  );
}

export default App;
