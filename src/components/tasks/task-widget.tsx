import Link from 'next/link';

type Task = {
  id: string;
  title: string;
  details: string | null;
};

export function TaskWidget({ tasks }: { tasks: Task[] }) {
  return (
    <div className="card">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-semibold thematic-title">Crew tasks</h3>
        <Link href="/todo" className="btn-secondary">Open to-do board</Link>
      </div>
      {tasks.length === 0 ? (
        <p className="text-sm thematic-subtitle">No active tasks. Add one from the to-do page.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="rounded-md border p-2" style={{ borderColor: 'var(--panel-border)' }}>
              <p className="font-medium text-sm">{task.title}</p>
              {task.details && <p className="text-xs thematic-subtitle">{task.details}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
