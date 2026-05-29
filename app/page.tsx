import { getPublishedPosts, getAllCategories } from "@/lib/queries"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home")
  return {
    title: t("siteTitle"),
    description: t("tagline"),
  }
}

export default async function HomePage() {
  const t = await getTranslations("home")

  // Get only 3 featured posts
  const { posts } = await getPublishedPosts({ page: 1, pageSize: 3 })

  // Get categories
  const categories = await getAllCategories()

  return (
    <div className="min-h-screen relative">
      {/* Refined grid background with fade */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]"
          style={{
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)'
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Hero Section - More spacious and personal */}
        <header className="pt-24 pb-32 md:pt-32 md:pb-40">
          <div className="max-w-2xl">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-muted to-muted/50 border border-border/40 flex items-center justify-center text-xl font-serif mb-8 backdrop-blur-sm">
              S
            </div>

            {/* Name and intro */}
            <h1 className="text-4xl md:text-5xl font-serif mb-6 tracking-tight leading-tight">
              {t("heroName")}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
              {t("heroIntro")}
            </p>

            {/* Currently exploring */}
            <p className="text-sm text-muted-foreground/80 leading-relaxed border-l-2 border-border/40 pl-4">
              {t("currentlyExploring")}
            </p>

            {/* Simple navigation */}
            <nav className="flex gap-6 text-sm mt-12">
              <Link
                href="/posts"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {t("navWriting")}
              </Link>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {t("navAbout")}
              </Link>
              <Link
                href="/search"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {t("navSearch")}
              </Link>
            </nav>
          </div>
        </header>

        {/* Knowledge Areas - Card-based with descriptions */}
        {categories.length > 0 && (
          <section className="pb-32 md:pb-40">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-12 font-mono">
              {t("knowledgeAreas")}
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group block p-6 border border-border/40 hover:border-border/80 bg-card/30 hover:bg-card/50 backdrop-blur-sm transition-all duration-300 rounded-lg"
                >
                  <div className="flex items-baseline justify-between mb-3">
                    <h3 className="text-lg font-medium group-hover:text-foreground transition-colors">
                      {category.title}
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono">
                      {category._count.documents}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground/80 leading-relaxed">
                    {t(`categoryDesc.${category.slug}`, { defaultValue: t("categoryDescDefault") })}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Writing - Editorial style */}
        <section className="pb-32 md:pb-40">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-12 font-mono">
            {t("featuredWriting")}
          </h2>

          {posts.length === 0 ? (
            <p className="text-muted-foreground/60 italic">
              {t("noPostsYet")}
            </p>
          ) : (
            <div className="space-y-16">
              {posts.map((post, index) => (
                <article
                  key={post.id}
                  className={`group ${index === 0 ? 'pb-8' : ''}`}
                >
                  <Link href={`/posts/${post.slug}`} className="block">
                    {/* Metadata */}
                    <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground/60 font-mono">
                      <time dateTime={post.publishedAt?.toISOString()}>
                        {post.publishedAt?.toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        }).replace(/\//g, '.')}
                      </time>
                      {post.category && (
                        <>
                          <span className="text-border/60">·</span>
                          <span>{post.category.title}</span>
                        </>
                      )}
                    </div>

                    {/* Title - larger for first post */}
                    <h3 className={`font-serif mb-4 group-hover:text-muted-foreground transition-colors duration-200 leading-snug ${
                      index === 0
                        ? 'text-3xl md:text-4xl'
                        : 'text-2xl md:text-3xl'
                    }`}>
                      {post.title}
                    </h3>

                    {/* Summary */}
                    {post.summary && (
                      <p className={`text-muted-foreground/80 leading-relaxed ${
                        index === 0 ? 'text-base md:text-lg mb-6' : 'text-base mb-4'
                      }`}>
                        {post.summary}
                      </p>
                    )}

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        {post.tags.slice(0, 3).map((pt) => (
                          <span
                            key={pt.tag.id}
                            className="text-xs text-muted-foreground/60 font-mono"
                          >
                            #{pt.tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </article>
              ))}
            </div>
          )}

          {/* View all */}
          {posts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-border/30">
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 font-mono group"
              >
                <span>{t("viewAllWriting")}</span>
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="pb-16 pt-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground/60 leading-relaxed max-w-2xl">
            {t("footerNote")}
          </p>
        </footer>
      </div>
    </div>
  )
}
