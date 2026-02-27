'use client';

import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-md space-y-4 card">
      <h2 className="text-xl font-semibold">Sign in</h2>
      <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="thematic-subtitle">{error}</p>}
      <button
        className="w-full btn-primary"
        onClick={async () => {
          const supabase = createClient();
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) return setError(error.message);
          router.replace('/dashboard');
        }}
      >
        Sign in
      </button>
      <button className="w-full btn-secondary" onClick={() => router.push('/auth/signup')}>
        Create account
      </button>
    </section>
  );
}
