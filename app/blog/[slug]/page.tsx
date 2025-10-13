import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "content", "posts");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => ({ slug: file.replace(/\.md$/, "") }));
}

async function getPost(slug: string) {
  const file = path.join(process.cwd(), "content", "posts", `${slug}.md`);
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const processed = await remark().use(html).process(content);
  let dateStr = "";
  if (data.date) {
    try {
      const d = new Date(data.date);
      dateStr = isNaN(d.getTime()) ? String(data.date) : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      dateStr = String(data.date);
    }
  }
  return {
    meta: {
      title: data.title || slug,
      date: dateStr,
      readTime: data.readTime || "",
    },
    html: processed.toString(),
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPost(slug);
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-tan-200/10 via-transparent to-transparent animate-[pulse_6s_ease-in-out_infinite]" />
      <article className="relative mx-auto max-w-3xl px-6 py-24">
        <header className="liquid-glass rounded-2xl p-6 md:p-8 bg-white/25 elevate">
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight">{post.meta.title}</h1>
          <p className="mt-3 text-slate-700">{post.meta.date} • {post.meta.readTime}</p>
        </header>
        <div className="liquid-glass rounded-2xl p-6 md:p-8 bg-white/25 prose prose-slate mt-10 max-w-none" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </div>
  );
}


