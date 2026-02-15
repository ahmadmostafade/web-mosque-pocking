"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const loadPosts = useCallback(async () => {
    const res = await fetch("/api/blog");
    if (res.ok) {
      const data = await res.json();
      setPosts(data.posts || []);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/session").then((r) => {
      if (!r.ok) router.push("/admin/login");
      else loadPosts();
    });
  }, [router, loadPosts]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      setMessage("Beitrag veröffentlicht.");
      setTitle("");
      setContent("");
      loadPosts();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-mosque-green-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Blog / News verwalten</h1>
        <button onClick={() => router.push("/admin")} className="text-sm hover:underline">
          ← Zurück
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Neuer Beitrag</h2>
          {message && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">{message}</div>
          )}
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Inhalt</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={6}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-mosque-green-600 text-white px-6 py-2 rounded-lg hover:bg-mosque-green-700 transition-colors"
            >
              Veröffentlichen
            </button>
          </form>
        </div>

        {posts.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-bold text-lg mb-4">Alle Beiträge</h2>
            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-mosque-green-700">{post.title}</h3>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
