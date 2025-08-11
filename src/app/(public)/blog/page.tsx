import { Navbar } from "@/components/public/ui/navbar/navbar";
import Footer from "@/components/ui/footer/footer";
import Link from "next/link";
import { getSortedPostsData } from "@/lib/blog";
// i18n desactivado para textos estáticos por ahora

const categories = ["All", "Desarrollo", "Proceso", "Mejoras"] as const;

type Category = (typeof categories)[number];

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: Category }> | { category?: Category };
}) {
  const allPosts = getSortedPostsData();
  const sp = (await (searchParams as any)) ?? {};
  const activeCategory: Category =
    sp?.category && categories.includes(sp.category as Category)
      ? (sp.category as Category)
      : "All";

  const filteredPosts =
    activeCategory === "All"
      ? allPosts
      : allPosts.filter((post) => post.category === activeCategory);

  // Define a specific order for bento layout based on slug
  const bentoLayoutOrder = [
    {
      slug: filteredPosts[0]?.slug,
      colSpan: "md:col-span-2",
      rowSpan: "md:row-span-2",
      isFeatured: true,
    },
    { slug: filteredPosts[1]?.slug, colSpan: "md:col-span-1", rowSpan: "" },
    { slug: filteredPosts[2]?.slug, colSpan: "md:col-span-1", rowSpan: "" },
    { slug: filteredPosts[3]?.slug, colSpan: "md:col-span-2", rowSpan: "" },
    { slug: filteredPosts[4]?.slug, colSpan: "md:col-span-2", rowSpan: "" },
    { slug: filteredPosts[5]?.slug, colSpan: "md:col-span-1", rowSpan: "" },
    { slug: filteredPosts[6]?.slug, colSpan: "md:col-span-1", rowSpan: "" },
  ].filter((item) => item.slug !== undefined);

  let finalPostsToDisplay = filteredPosts.map((post) => {
    const layout = bentoLayoutOrder.find((item) => item.slug === post.slug);
    return { ...post, ...layout } as typeof post & {
      colSpan?: string;
      rowSpan?: string;
    };
  });

  if (
    filteredPosts.length < 7 ||
    (activeCategory !== "All" && !filteredPosts.some((p) => p.isFeatured))
  ) {
    finalPostsToDisplay = filteredPosts.map((post) => ({
      ...post,
      colSpan: "md:col-span-1",
      rowSpan: "",
    }));
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="sm:mt-24.5 md:mt-24.5 mt-22">
        <div className="w-full py-16 md:py-24">
          <div className="mx-auto px-2 sm:px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Novack Journal
              </h1>
              <p className="text-white/70 mt-4 text-lg">
                Ideas, insights and updates from the Novack team.
              </p>
            </div>

            <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const href =
                  cat === "All"
                    ? "/blog"
                    : `/blog?category=${encodeURIComponent(cat)}`;
                return (
                  <Link
                    key={cat}
                    href={href}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      isActive
                        ? "bg-[#07D9D9] text-[#010440]"
                        : "text-white/70 bg-white/5 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {cat === "All"
                      ? "All"
                      : cat === "Desarrollo"
                      ? "Development"
                      : cat === "Proceso"
                      ? "Process"
                      : cat === "Mejoras"
                      ? "Improvements"
                      : cat}
                  </Link>
                );
              })}
            </div>

            {finalPostsToDisplay.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(() => {
                  const [featured, ...rest] = finalPostsToDisplay;
                  return (
                    <>
                      {/* Featured first post spanning full first row */}
                      {featured && (
                        <Link
                          href={`/blog/${featured.slug}`}
                          key={featured.slug}
                          className="block group md:col-span-2 lg:col-span-3"
                        >
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col h-full overflow-hidden hover:border-[#07D9D9]/50 transition-all duration-300">
                            <div
                              className={`relative h-64 md:h-80 lg:h-96 rounded-lg bg-gradient-to-br ${featured.gradient} mb-6 overflow-hidden flex-shrink-0`}
                            >
                              <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:opacity-0"></div>
                            </div>
                            <p className="text-sm font-medium text-[#07D9D9] mb-3">
                              {featured.category}
                            </p>
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                              {featured.title}
                            </h3>
                            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6 line-clamp-3">
                              {featured.excerpt}
                            </p>
                            <div className="flex items-center gap-2 text-xs md:text-sm text-white/60 mt-auto">
                              <span>By {featured.author}</span>
                              <span>&bull;</span>
                              <span>{featured.date}</span>
                            </div>
                          </div>
                        </Link>
                      )}

                      {/* Rest of posts */}
                      {rest.map((post) => (
                        <Link
                          href={`/blog/${post.slug}`}
                          key={post.slug}
                          className={`block group ${post.colSpan ?? ""} ${
                            post.rowSpan ?? ""
                          }`}
                        >
                          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col h-full overflow-hidden hover:border-[#07D9D9]/50 transition-all duration-300">
                            <div
                              className={`relative h-56 md:h-64 rounded-lg bg-gradient-to-br ${post.gradient} mb-5 overflow-hidden flex-shrink-0`}
                            >
                              <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:opacity-0"></div>
                            </div>
                            <p className="text-sm font-medium text-[#07D9D9] mb-2">
                              {post.category}
                            </p>
                            <h3 className="text-2xl font-bold text-white mb-3 flex-grow">
                              {post.title}
                            </h3>
                            <p className="text-white/70 text-base leading-relaxed mb-5 line-clamp-3">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-white/60 mt-auto">
                              <span>By {post.author}</span>
                              <span>&bull;</span>
                              <span>{post.date}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-white/70 text-lg">
                  No posts found in this category.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
