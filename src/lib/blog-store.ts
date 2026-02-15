export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
}

let posts: BlogPost[] = [
  {
    id: "post-1",
    title: "Renovierungsarbeiten gestartet",
    content: "Die ersten Renovierungsarbeiten an unserer Moschee haben begonnen. Wir danken allen Spendern für ihre Unterstützung.",
    date: "2026-02-01",
  },
];

export function getBlogPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function addBlogPost(post: Omit<BlogPost, "id">): BlogPost {
  const newPost: BlogPost = {
    ...post,
    id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  };
  posts.push(newPost);
  return newPost;
}

export function resetBlogStore(): void {
  posts = [];
}
