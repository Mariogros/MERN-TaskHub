import { useState } from 'react';
import './TaskForm.css';

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);

    try {
      const taskData = { title: title.trim() };
      if (due) {
        // Store date as midnight UTC to avoid timezone issues
        // This ensures all systems interpret the date consistently
        taskData.due = `${due}T00:00:00.000Z`;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || ''}/api/tasks`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create task');
      }

      setTitle('');
      setDue('');
      onTaskCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form">
      <h2>Nueva Tarea</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Comprar víveres"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="due">Fecha de vencimiento (opcional)</label>
          <input
            type="date"
            id="due"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Tarea'}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
