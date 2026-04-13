import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getCurrentProfile } from '@/lib/authz';
import { MotdCard } from '@/components/motd-card';
import { TaskWidget } from '@/components/tasks/task-widget';

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  const supabase = await createServerSupabaseClient();

  const [{ data: settings }, { data: tasks }] = await Promise.all([
    supabase.from('app_settings').select('message_of_the_day').eq('id', 1).single<{ message_of_the_day: string }>(),
    supabase.from('todo_tasks').select('id,title,details').order('updated_at', { ascending: false }).limit(5)
  ]);

  const displayName = profile?.display_name?.trim() || profile?.email;

  return (
    <section className="grid gap-4">
      <div className="card">
        <h2 className="text-lg font-semibold">Ahoy, {displayName}</h2>
        <p className="text-sm thematic-subtitle">Role aboard ship: {profile?.role}</p>
      </div>
      <MotdCard initialMessage={settings?.message_of_the_day ?? 'Welcome aboard, captain.'} isAdmin={profile?.role === 'admin'} />
      <TaskWidget tasks={tasks ?? []} />
    </section>
  );
}
