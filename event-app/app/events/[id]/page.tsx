'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { events, members, invitations, users } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Member {
  id: number;
  role: string;
  user: { id: number; name?: string; email: string };
}

interface Invitation {
  id: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  message?: string;
  user: { id: number; name?: string; email: string };
}

interface User {
  id: number;
  name?: string;
  email: string;
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
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [eventInvitations, setEventInvitations] = useState<Invitation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      router.push('/login');
      return;
    }
    loadEvent();
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

  const loadInviteData = async () => {
    try {
      const [usersData, invitationsData] = await Promise.all([
        users.getAll(),
        invitations.getForEvent(Number(params.id)),
      ]);
      setAllUsers(usersData);
      setEventInvitations(invitationsData);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const openInviteModal = async () => {
    await loadInviteData();
    setShowInviteModal(true);
  };

  const handleInvite = async () => {
    if (!selectedUserId) return;
    setInviting(true);
    try {
      await invitations.send(Number(params.id), Number(selectedUserId), inviteMessage || undefined);
      await loadInviteData();
      setSelectedUserId('');
      setInviteMessage('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setInviting(false);
    }
  };

  const handleCancelInvitation = async (invitationId: number) => {
    try {
      await invitations.cancel(invitationId);
      await loadInviteData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Événement non trouvé</p>
      </div>
    );
  }

  const isOwner = currentUserId === event.owner.id;
  const isMember = event.members.some((m) => m.user.id === currentUserId);

  const availableUsers = allUsers.filter(
    (u) =>
      u.id !== currentUserId &&
      u.id !== event?.owner.id &&
      !event?.members.some((m) => m.user.id === u.id) &&
      !eventInvitations.some((inv) => inv.user.id === u.id && inv.status === 'PENDING')
  );

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-background border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/dashboard">
            <Button variant="link" className="p-0">← Retour</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{event.title}</CardTitle>
                <p className="text-muted-foreground mt-1">
                  Organisé par {event.owner.name || event.owner.email}
                </p>
              </div>
              <div className="flex gap-2">
                {isOwner && (
                  <Button onClick={openInviteModal}>Inviter</Button>
                )}
                {isOwner ? (
                  <Button variant="destructive" onClick={handleDelete}>
                    Supprimer
                  </Button>
                ) : isMember ? (
                  <Button variant="secondary" onClick={handleLeave}>
                    Quitter
                  </Button>
                ) : (
                  <Button onClick={handleJoin}>Rejoindre</Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="flex items-center gap-2">
                <span>📅</span>
                {new Date(event.startDate).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {event.endDate &&
                  ` - ${new Date(event.endDate).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`}
              </p>
              {event.location && (
                <p className="flex items-center gap-2">
                  <span>📍</span>
                  {event.location}
                </p>
              )}
              {event.description && (
                <p className="text-muted-foreground mt-4">{event.description}</p>
              )}
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-semibold mb-4">
                Participants ({event.members.length})
              </h2>
              {event.members.length > 0 ? (
                <div className="space-y-2">
                  {event.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                    >
                      <Avatar>
                        <AvatarFallback>
                          {(member.user.name || member.user.email)[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{member.user.name || member.user.email}</span>
                      <Badge variant="outline">{member.role}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucun participant pour le moment</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Inviter des participants</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Sélectionner un utilisateur</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="-- Choisir --" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      {u.name || u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Message (optionnel)</Label>
              <Textarea
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                placeholder="Ajouter un message..."
                rows={2}
              />
            </div>

            <Button
              onClick={handleInvite}
              disabled={!selectedUserId || inviting}
              className="w-full"
            >
              {inviting ? 'Envoi...' : "Envoyer l'invitation"}
            </Button>
          </div>

          {eventInvitations.length > 0 && (
            <>
              <Separator className="my-4" />
              <div>
                <h3 className="font-semibold mb-3">Invitations envoyées</h3>
                <div className="space-y-2">
                  {eventInvitations.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <span>{inv.user.name || inv.user.email}</span>
                        <Badge
                          variant={
                            inv.status === 'PENDING'
                              ? 'secondary'
                              : inv.status === 'ACCEPTED'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {inv.status === 'PENDING'
                            ? 'En attente'
                            : inv.status === 'ACCEPTED'
                            ? 'Acceptée'
                            : 'Refusée'}
                        </Badge>
                      </div>
                      {inv.status === 'PENDING' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelInvitation(inv.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Annuler
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
