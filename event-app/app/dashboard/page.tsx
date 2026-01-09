'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { events, logout } from '@/lib/api';

interface Event {
  id: number;
  title: string;
  startDate: string;
  location?: string;
  owner: { id: number; name?: string; email: string };
  _count?: { members: number };
}

export default function DashboardPage() {
  const router = useRouter();
  const [eventList, setEventList] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', startDate: '', description: '', location: '' });

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      router.push('/login');
      return;
    }
    loadEvents();
  }, [router]);

  const loadEvents = async () => {
    try {
      const data = await events.getAll();
      setEventList(data);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await events.create(form);
      setShowCreate(false);
      setForm({ title: '', startDate: '', description: '', location: '' });
      loadEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Mes Événements</h1>
          <div className="space-x-4">
            <button onClick={() => setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              + Créer
            </button>
            <button onClick={logout} className="text-gray-600 hover:text-gray-800">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {showCreate && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Nouvel événement</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="Titre"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Lieu"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Créer
                </button>
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 border rounded">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {eventList.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="text-gray-500 text-sm mt-1">
                {new Date(event.startDate).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </p>
              {event.location && <p className="text-gray-400 text-sm">📍 {event.location}</p>}
              <p className="text-gray-400 text-sm mt-2">
                Par {event.owner.name || event.owner.email} • {event._count?.members || 0} participants
              </p>
            </Link>
          ))}
        </div>

        {eventList.length === 0 && (
          <p className="text-center text-gray-500 mt-8">Aucun événement. Créez-en un !</p>
        )}
      </main>
    </div>
  );
}
