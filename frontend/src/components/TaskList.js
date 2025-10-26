import { useState, useEffect, useCallback } from 'react';
import './TaskList.css';

function TaskList({ refresh }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Debounce search query - wait 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const url = debouncedQuery
        ? `${process.env.REACT_APP_API_URL || ''}/api/tasks?q=${encodeURIComponent(debouncedQuery)}`
        : `${process.env.REACT_APP_API_URL || ''}/api/tasks`;

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch tasks');
      }

      setTasks(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refresh]);

  const handleDelete = async (taskId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      return;
    }

    setDeletingId(taskId);
    setError('');

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || ''}/api/tasks/${taskId}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete task');
      }

      // Remove task from local state
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    // Parse as UTC to avoid timezone shifts
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Mis Tareas</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar tareas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading && <div className="loading">Cargando tareas...</div>}
      
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && tasks.length === 0 && (
        <div className="empty-state">
          {searchQuery ? 'No se encontraron tareas' : 'No hay tareas aún. ¡Crea tu primera tarea!'}
        </div>
      )}

      {!loading && !error && tasks.length > 0 && (
        <div className="tasks">
          {tasks.map((task) => (
            <div key={task._id} className="task-card">
              <div className="task-content">
                <h3>{task.title}</h3>
                <div className="task-meta">
                  <span className="task-due">📅 {formatDate(task.due)}</span>
                  <span className="task-created">
                    Creada: {formatDate(task.createdAt)}
                  </span>
                </div>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(task._id)}
                disabled={deletingId === task._id}
                title="Eliminar tarea"
              >
                {deletingId === task._id ? '...' : '🗑️'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;
