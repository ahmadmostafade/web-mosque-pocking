import { Metadata } from "next";
import { getBlogPosts } from "@/lib/blog-store";

export const metadata: Metadata = {
  title: "News",
  description: "Aktuelle Neuigkeiten und Projektaktualisierungen der Moschee Pocking.",
};

export default function NewsPage() {
  const posts = getBlogPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-mosque-green-700 mb-8">
        News & Aktualisierungen
      </h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">Noch keine Beiträge vorhanden.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold text-mosque-green-700">
                  {post.title}
                </h2>
                <time className="text-sm text-gray-500 whitespace-nowrap ml-4">
                  {new Date(post.date).toLocaleDateString("de-DE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
              <p className="text-gray-700 leading-relaxed">{post.content}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
