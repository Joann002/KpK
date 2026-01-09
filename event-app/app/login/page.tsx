'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const tokens = isRegister
        ? await auth.register(email, password, name || undefined)
        : await auth.login(email, password);
      
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          {isRegister ? 'Inscription' : 'Connexion'}
        </h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg text-black"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-lg text-black"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full p-3 border rounded-lg text-black"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '...' : isRegister ? "S'inscrire" : 'Se connecter'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-black">
          {isRegister ? 'Déjà un compte?' : 'Pas de compte?'}{' '}
          <button onClick={() => setIsRegister(!isRegister)} className="text-blue-600 hover:underline">
            {isRegister ? 'Se connecter' : "S'inscrire"}
          </button>
        </p>
      </div>
    </div>
  );
}
