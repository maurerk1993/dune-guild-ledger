'use client';

import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-md space-y-4 card">
      <h2 className="text-xl font-semibold">Create account</h2>
      <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {message && <p className="thematic-subtitle">{message}</p>}
      <button
        className="w-full btn-primary"
        onClick={async () => {
          const supabase = createClient();
          const { error } = await supabase.auth.signUp({ email, password });
          if (error) return setMessage(error.message);
          setMessage('Account created. Check your email if confirmation is enabled.');
          router.push('/auth/login');
        }}
      >
        Sign up
      </button>
      <button className="w-full btn-secondary" onClick={() => router.push('/auth/login')}>
        Sign in
      </button>
    </section>
  );
}
