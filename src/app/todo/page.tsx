import { createServerSupabaseClient } from '@/lib/supabase-server';
import { TaskBoard } from '@/components/tasks/task-board';

export default async function TodoPage() {
  const supabase = await createServerSupabaseClient();
  const { data: tasks } = await supabase
    .from('todo_tasks')
    .select('id,title,details,updated_at')
    .order('updated_at', { ascending: false });

  return (
    <section className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-semibold thematic-title">Crew To-Do Board</h2>
        <p className="text-sm thematic-subtitle">Every logged-in crew member can add, edit, and remove tasks.</p>
      </div>
      <TaskBoard initialTasks={tasks ?? []} />
    </section>
  );
}
