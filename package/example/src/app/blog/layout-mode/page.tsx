"use client";

import Link from "next/link";
import { Footer } from "../../Footer";

export default function LayoutModePage() {
  return (
    <>
      <article className="article">
        <header>
          <p
            style={{
              fontSize: "0.6875rem",
              fontWeight: 450,
              color: "rgba(0, 0, 0, 0.4)",
              margin: "0 0 0.5rem 0",
            }}
          >
            March 24, 2026
          </p>
          <h1>Introducing Layout Mode</h1>
          <p className="tagline">Explore, wireframe, rearrange</p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <p style={{ margin: 0 }}>
            Annotations are good for pointing at things and saying what&rsquo;s wrong. But sometimes you don&rsquo;t know what&rsquo;s wrong yet. You&rsquo;re still figuring out what the page should look like.
          </p>

          <p style={{ margin: 0 }}>
            Layout mode lets you show that instead of explaining it. Press <code>L</code>, drag components onto the page, rearrange sections, or wireframe a new page from scratch. Your agent gets coordinates and dimensions instead of a paragraph.
          </p>
        </div>

        <section>
          <h2 id="exploration">How It Works</h2>
          <p>
            &ldquo;What if the testimonials went above the pricing table?&rdquo; &ldquo;I want a sidebar here, about this wide.&rdquo; &ldquo;Build me a dashboard that looks roughly like this.&rdquo; That kind of thing is hard to describe in text. So you just sketch it out.
          </p>
          <p>
            Press <code>L</code> and the toolbar switches into layout mode. Drop components where you want them, grab existing sections and drag them around, or clear the page and wireframe something new. Everything you do turns into structured output with positions, sizes, and labels.
          </p>
        </section>

        <section>
          <h2 id="wireframe">Wireframing</h2>
          <p>
            Toggle &ldquo;Wireframe New Page&rdquo; and the current page fades out. There&rsquo;s an opacity slider if you want to reference what&rsquo;s already there while you work.
          </p>
          <p>
            A purpose field at the top lets you give context: &ldquo;landing page with pricing table and testimonials&rdquo; or &ldquo;settings page with tabs.&rdquo; That gets included in the output so the agent knows what the boxes are for.
          </p>
          <p>
            Wireframe placements and rearrange changes keep their state separately. You can toggle wireframe on and off without losing work in either.
          </p>
        </section>

        <section>
          <h2 id="rearrange">Rearranging</h2>
          <p>
            Every section of the page becomes draggable in layout mode. Hover over a section and it gets outlined with its CSS selector label. Drag to reorder. You can rearrange sections and place new components in the same session.
          </p>
        </section>

        <section>
          <h2 id="components">Component Palette</h2>
          <p>
            The palette has 65+ component types across five categories: Layout, Content, Controls, Elements, and Blocks. Pick a type, drag it onto the page, resize it. Each placement records the component type, pixel dimensions, and position on the page.
          </p>
        </section>

        <section>
          <h2 id="schema">Under the Hood</h2>
          <p>
            Layout mode extends the <Link href="/schema">Annotation Format Schema</Link> to AFS 1.1. Annotations now carry a <code>kind</code> field: <code>feedback</code>, <code>placement</code>, or <code>rearrange</code>. Each kind has its own structured data so agents know what to do with it.
          </p>
          <p>
            With the <Link href="/mcp">MCP server</Link> running, your agent sees layout changes as they happen.
          </p>
        </section>

        <p>
          Layout mode extends Agentation beyond feedback into planning, wireframing, and exploring ideas in real-time. It ships in <Link href="/changelog">v3.0</Link>. We hope you find it useful.
        </p>
      </article>

      <Footer />
    </>
  );
}
