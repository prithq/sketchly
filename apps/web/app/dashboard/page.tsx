"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, LogIn, Hash, X, Search, DoorOpen, Loader2 } from "lucide-react";

interface Room {
  id: string;
  name: string;
  slug: string;
  createdAt: string; // ISO date string from backend
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-xl shadow-xl border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [newName, setNewName] = useState("");
  const [joinSlug, setJoinSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  // Fetch rooms on mount
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/rooms", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load rooms");
      const data = await res.json();
      setRooms(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const filtered = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = useCallback(async () => {
    if (!newName.trim() || creating) return;
    try {
      setCreating(true);
      const res = await fetch("/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (!res.ok) throw new Error("Creation failed");
      const newRoom = await res.json();
      // Fetch the full room object (or you can construct it with the returned slug and name)
      // We'll refetch all rooms to get the full data (including id and createdAt)
      await fetchRooms();
      setNewName("");
      setShowCreate(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  }, [newName, creating]);

  const handleJoin = useCallback(async () => {
    if (!joinSlug.trim() || joining) return;
    try {
      setJoining(true);
      // Check if the room exists
      const res = await fetch(`/rooms/${joinSlug.trim()}/join`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Room not found");
      }
      // Room exists – you could navigate to the canvas here, e.g.:
      // router.push(`/canvas/${joinSlug.trim()}`);
      // For now, just close the modal and maybe refresh
      alert("Room found! (Navigation not yet implemented)");
      setJoinSlug("");
      setShowJoin(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setJoining(false);
    }
  }, [joinSlug, joining]);

  return (
    <div className="min-h-screen bg-white font-sans">
      

      <div className="ml-14 min-h-screen">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 pt-10 pb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Rooms</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowJoin(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <LogIn size={15} />
              Join Room
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-all shadow-sm shadow-indigo-200"
            >
              <Plus size={15} />
              New Room
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-8 mb-2">
          <div className="relative max-w-xl">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rooms..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-gray-50"
            />
          </div>
        </div>

        {/* Table header */}
        <div className="px-8 mt-4">
          <div className="flex items-center px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-gray-100">
            <span className="flex-1">Room Name</span>
            <span className="w-44 text-right">Slug</span>
            <span className="w-32 text-right">Created</span>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="py-20 flex justify-center">
              <Loader2 size={24} className="animate-spin text-gray-400" />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="py-20 text-center text-sm text-red-500">
              {error}{" "}
              <button onClick={fetchRooms} className="underline text-indigo-600">
                Retry
              </button>
            </div>
          )}

          {/* Room rows */}
          {!loading && !error && (
            <div className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <div className="py-20 text-center text-sm text-gray-400">No rooms found.</div>
              )}
              {filtered.map((room) => (
                <div
                  key={room.id}
                  className="group flex items-center px-4 py-4 hover:bg-indigo-50/50 cursor-pointer transition-colors rounded-lg"
                  onClick={() => {
                    // Navigate to canvas: router.push(`/canvas/${room.slug}`);
                    console.log("Open room:", room.slug);
                  }}
                >
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <Hash size={14} className="text-indigo-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {room.name}
                    </span>
                  </div>
                  <span className="w-44 text-right text-xs text-gray-400 font-mono truncate pl-4">
                    {room.slug}
                  </span>
                  <span className="w-32 text-right text-xs text-gray-400">
                    {timeAgo(room.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <Modal title="Create a new room" onClose={() => setShowCreate(false)}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Room name</label>
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="e.g. Design Sprint"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              {newName.trim() && (
                <p className="mt-1.5 text-xs text-gray-400 font-mono">
                  Slug preview: {newName.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}
                </p>
              )}
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim() || creating}
                className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {creating ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Create"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Join Modal */}
      {showJoin && (
        <Modal title="Join a room" onClose={() => setShowJoin(false)}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Room slug</label>
              <input
                autoFocus
                type="text"
                value={joinSlug}
                onChange={(e) => setJoinSlug(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                placeholder="e.g. design-sprint-a1b2c3"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 font-mono focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowJoin(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleJoin}
                disabled={!joinSlug.trim() || joining}
                className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {joining ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Join"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}