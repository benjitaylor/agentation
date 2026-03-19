"use client";

import Link from "next/link";
import { Footer } from "../Footer";

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
}

const posts: BlogPost[] = [
  {
    slug: "introducing-agentation-2",
    title: "Introducing Agentation 2.0",
    description: "Annotations become a two-way conversation. Your AI agent can now see, respond to, and resolve your feedback in real time.",
    date: "February 5, 2026",
    image: "/blog/agentation-2.png",
  },
];

export default function BlogPage() {
  return (
    <>
      <article className="article">
        <header>
          <h1>Blog</h1>
          <p className="tagline">Announcements and updates</p>
        </header>

        <section>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "0.5rem" }}>
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="blog-post-card"
              >
                <div
                  style={{
                    aspectRatio: "3600 / 1890",
                    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div style={{ padding: "1rem 1.25rem", background: "rgba(0, 0, 0, 0.02)" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginTop: "0.25rem",
                      marginBottom: "0.375rem",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: 550,
                        color: "rgba(0, 0, 0, 0.85)",
                        margin: 0,
                      }}
                    >
                      {post.title}
                    </h3>
                    <span style={{ color: "rgba(0, 0, 0, 0.25)" }}>•</span>
                    <time
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 450,
                        color: "rgba(0, 0, 0, 0.4)",
                      }}
                    >
                      {post.date}
                    </time>
                  </div>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "rgba(0, 0, 0, 0.55)",
                      lineHeight: 1.45,
                      margin: 0,
                    }}
                  >
                    {post.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </article>

      <Footer />
    </>
  );
}
