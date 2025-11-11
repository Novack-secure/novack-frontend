import { Navbar } from "@/components/public/ui/navbar/navbar";
import Footer from "@/components/ui/footer/footer";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { getPostData } from "@/lib/blog";
import fs from "fs/promises";
import path from "path";

// Static params from markdown slugs
export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "src", "content", "blog");
  const filenames = await fs.readdir(postsDirectory);
  return filenames
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => ({ slug: filename.replace(/\.md$/, "") }));
}

const BlogPostPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  // Read post from markdown (frontmatter + content)
  let post: Awaited<ReturnType<typeof getPostData>>;
  try {
    post = await getPostData(slug);
  } catch {
    // Graceful 404 when file is missing or invalid
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main>
          <article className="w-full py-24">
            <div className="mx-auto px-4 sm:px-6 max-w-3xl text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Artículo no encontrado
              </h1>
              <p className="text-white/70">
                El artículo no existe o fue movido.
              </p>
            </div>
          </article>
        </main>
        <Footer />
      </div>
    );
  }

  const words = post.content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <div className="w-full py-10 md:py-16">
          <ArticleLayout
            title={post.title}
            category={post.category}
            author={post.author}
            date={post.date}
            minutes={minutes}
          >
            <div
              className={`w-full h-56 md:h-72 lg:h-80 rounded-2xl bg-linear-to-br ${post.gradient} mb-8`}
            />
            <MarkdownRenderer content={post.content} className="prose-lg" />
          </ArticleLayout>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
