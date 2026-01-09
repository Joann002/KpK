'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { events, members } from '@/lib/api';

interface Member {
  id: number;
  role: string;
  user: { id: number; name?: string; email: string };
}

interface Event {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  owner: { id: number; name?: string; email: string };
  members: Member[];
}

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      router.push('/login');
      return;
    }
    loadEvent();
    // Decode user ID from token
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.sub);
      } catch {}
    }
  }, [params.id, router]);

  const loadEvent = async () => {
    try {
      const data = await events.getOne(Number(params.id));
      setEvent(data);
    } catch {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    try {
      await members.join(Number(params.id));
      loadEvent();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleLeave = async () => {
    try {
      await members.leave(Number(params.id));
      loadEvent();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer cet événement ?')) return;
    try {
      await events.delete(Number(params.id));
      router.push('/dashboard');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  if (loading) return <div className="p-8">Chargement...</div>;
  if (!event) return <div className="p-8">Événement non trouvé</div>;

  const isOwner = currentUserId === event.owner.id;
  const isMember = event.members.some((m) => m.user.id === currentUserId);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ← Retour
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{event.title}</h1>
              <p className="text-gray-500 mt-1">
                Organisé par {event.owner.name || event.owner.email}
              </p>
            </div>
            <div className="space-x-2">
              {isOwner ? (
                <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                  Supprimer
                </button>
              ) : isMember ? (
                <button onClick={handleLeave} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                  Quitter
                </button>
              ) : (
                <button onClick={handleJoin} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Rejoindre
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <p className="flex items-center gap-2">
              <span>📅</span>
              {new Date(event.startDate).toLocaleDateString('fr-FR', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
              {event.endDate && ` - ${new Date(event.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
            </p>
            {event.location && <p className="flex items-center gap-2"><span>📍</span>{event.location}</p>}
            {event.description && <p className="text-gray-700 mt-4">{event.description}</p>}
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Participants ({event.members.length})</h2>
            {event.members.length > 0 ? (
              <ul className="space-y-2">
                {event.members.map((member) => (
                  <li key={member.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                      {(member.user.name || member.user.email)[0].toUpperCase()}
                    </span>
                    <span>{member.user.name || member.user.email}</span>
                    <span className="text-gray-400 text-sm">({member.role})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Aucun participant pour le moment</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
