import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

type PostMeta = {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug: string;
};

function getPosts(): PostMeta[] {
  const dir = path.join(process.cwd(), "content", "posts");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      const slug = file.replace(/\.md$/, "");
      // Normalize date to a readable string if provided
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
        title: data.title || slug,
        excerpt: data.excerpt || "",
        date: dateStr,
        readTime: data.readTime || "",
        slug,
      } as PostMeta;
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export default function BlogPage() {
  const posts = getPosts();
  return (
    <div className="relative">
      {/* Subtle background animation */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-tan-200/10 via-transparent to-transparent animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight">Our Blog</h1>
        <p className="mt-6 text-slate-700 max-w-2xl">Thoughts on building quiet, enduring systems.</p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <a key={p.slug} href={`/blog/${p.slug}`} className="glass rounded-2xl p-6 bg-white/30 elevate hover:-translate-y-0.5 transition-transform">
              <h2 className="font-serif text-2xl">{p.title}</h2>
              <p className="mt-3 text-slate-700">{p.excerpt}</p>
              <div className="mt-4 text-sm text-slate-700/80">{p.date} • {p.readTime}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}


