'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { events, logout, invitations } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Event {
  id: number;
  title: string;
  startDate: string;
  location?: string;
  owner: { id: number; name?: string; email: string };
  _count?: { members: number };
}

interface Invitation {
  id: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  message?: string;
  event: {
    id: number;
    title: string;
    startDate: string;
    location?: string;
    owner: { id: number; name?: string; email: string };
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [eventList, setEventList] = useState<Event[]>([]);
  const [myInvitations, setMyInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', startDate: '', description: '', location: '' });

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      router.push('/login');
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const [eventsData, invitationsData] = await Promise.all([
        events.getAll(),
        invitations.getMy(),
      ]);
      setEventList(eventsData);
      setMyInvitations(invitationsData);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleRsvp = async (invitationId: number, status: 'ACCEPTED' | 'DECLINED') => {
    try {
      await invitations.rsvp(invitationId, status);
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await events.create(form);
      setShowCreate(false);
      setForm({ title: '', startDate: '', description: '', location: '' });
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  const pendingInvitations = myInvitations.filter((inv) => inv.status === 'PENDING');

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-background border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Mes Événements</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowCreate(true)}>+ Créer</Button>
            <Button variant="ghost" onClick={logout}>Déconnexion</Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {pendingInvitations.length > 0 && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertTitle className="text-yellow-800">
              📬 Invitations reçues ({pendingInvitations.length})
            </AlertTitle>
            <AlertDescription>
              <div className="space-y-3 mt-3">
                {pendingInvitations.map((inv) => (
                  <Card key={inv.id}>
                    <CardContent className="flex justify-between items-center py-4">
                      <div>
                        <p className="font-medium">{inv.event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Par {inv.event.owner.name || inv.event.owner.email} •{' '}
                          {new Date(inv.event.startDate).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                          })}
                        </p>
                        {inv.message && (
                          <p className="text-sm text-muted-foreground italic mt-1">"{inv.message}"</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleRsvp(inv.id, 'ACCEPTED')}>
                          Accepter
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRsvp(inv.id, 'DECLINED')}>
                          Refuser
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvel événement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  placeholder="Titre de l'événement"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Date et heure</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  placeholder="Lieu de l'événement"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description de l'événement"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
                  Annuler
                </Button>
                <Button type="submit">Créer</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {eventList.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <Card className="hover:shadow-md transition cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription>
                    {new Date(event.startDate).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {event.location && (
                    <p className="text-sm text-muted-foreground">📍 {event.location}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">
                      {event._count?.members || 0} participants
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Par {event.owner.name || event.owner.email}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {eventList.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">Aucun événement. Créez-en un !</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
