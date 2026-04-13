'use client';

import { useState } from 'react';

type Task = {
  id: string;
  title: string;
  details: string | null;
  updated_at: string;
};

export function TaskBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function createTask() {
    setStatus(null);
    const response = await fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title, details })
    });
    if (!response.ok) {
      setStatus('Could not add task.');
      return;
    }

    const payload = (await response.json()) as { task: Task };
    setTasks((prev) => [payload.task, ...prev]);
    setTitle('');
    setDetails('');
    setStatus('Task added to the ship log.');
  }

  async function saveTask(task: Task) {
    const response = await fetch('/api/tasks', {
      method: 'PATCH',
      body: JSON.stringify({ id: task.id, title: task.title, details: task.details ?? '' })
    });

    if (!response.ok) {
      setStatus('Could not update task.');
      return;
    }

    const payload = (await response.json()) as { task: Task };
    setTasks((prev) => prev.map((item) => (item.id === task.id ? payload.task : item)));
    setEditingTaskId(null);
    setStatus('Task updated.');
  }

  async function removeTask(id: string) {
    const response = await fetch('/api/tasks', {
      method: 'DELETE',
      body: JSON.stringify({ id })
    });

    if (!response.ok) {
      setStatus('Could not remove task.');
      return;
    }

    setTasks((prev) => prev.filter((task) => task.id !== id));
    setStatus('Task removed from the list.');
  }

  return (
    <section className="space-y-4">
      <div className="card space-y-3">
        <h2 className="text-lg font-semibold thematic-title">Add crew task</h2>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task title" />
        <textarea value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Optional details" rows={3} />
        <button className="btn-primary w-fit" onClick={createTask} disabled={!title.trim()}>
          Add task
        </button>
      </div>

      <div className="card space-y-3">
        <h2 className="text-lg font-semibold thematic-title">Current to-do manifest</h2>
        {tasks.length === 0 && <p className="thematic-subtitle text-sm">No tasks yet. Add one above.</p>}
        <ul className="space-y-3">
          {tasks.map((task) => {
            const isEditing = editingTaskId === task.id;
            return (
              <li key={task.id} className="rounded-lg border p-3" style={{ borderColor: 'var(--panel-border)' }}>
                {isEditing ? (
                  <EditableTask task={task} onCancel={() => setEditingTaskId(null)} onSave={saveTask} />
                ) : (
                  <div className="space-y-2">
                    <p className="font-semibold">{task.title}</p>
                    {task.details && <p className="text-sm thematic-subtitle whitespace-pre-wrap">{task.details}</p>}
                    <div className="flex gap-2">
                      <button className="btn-secondary" onClick={() => setEditingTaskId(task.id)}>Edit</button>
                      <button className="btn-danger" onClick={() => removeTask(task.id)}>Remove</button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {status && <p className="text-xs thematic-subtitle">{status}</p>}
    </section>
  );
}

function EditableTask({ task, onCancel, onSave }: { task: Task; onCancel: () => void; onSave: (task: Task) => void }) {
  const [title, setTitle] = useState(task.title);
  const [details, setDetails] = useState(task.details ?? '');

  return (
    <div className="space-y-2">
      <input value={title} onChange={(event) => setTitle(event.target.value)} />
      <textarea value={details} onChange={(event) => setDetails(event.target.value)} rows={3} />
      <div className="flex gap-2">
        <button className="btn-primary" onClick={() => onSave({ ...task, title, details })} disabled={!title.trim()}>
          Save
        </button>
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
