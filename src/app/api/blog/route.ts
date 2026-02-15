import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, addBlogPost } from "@/lib/blog-store";

export async function GET() {
  const posts = getBlogPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, date } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Titel und Inhalt sind erforderlich." },
        { status: 400 }
      );
    }

    const postDate = date || new Date().toISOString().split("T")[0];
    const post = addBlogPost({ title, content, date: postDate });
    return NextResponse.json({ post }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Ungültige Anfrage." },
      { status: 400 }
    );
  }
}
