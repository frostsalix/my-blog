import { getPublishedPosts, getAllCategories } from "@/lib/queries"
import { getTranslations } from "next-intl/server"
import { PostCard } from "@/components/blog/PostCard"
import { CategoryBadge } from "@/components/blog/CategoryBadge"
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
  const tPosts = await getTranslations("posts")

  // Get recent posts (limit to 6)
  const { posts } = await getPublishedPosts({ page: 1, pageSize: 6 })

  // Get all categories
  const categories = await getAllCategories()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            {t("heroTitle")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            {t("heroSubtitle")}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/posts"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t("explorePosts")}
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {t("aboutMe")}
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-12 px-4 border-b">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{t("categories")}</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group"
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-card hover:bg-accent transition-colors">
                    <span className="font-medium">{category.title}</span>
                    <span className="text-sm text-muted-foreground">
                      ({category._count.documents})
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">{t("recentPosts")}</h2>
            <Link
              href="/posts"
              className="text-sm text-primary hover:underline"
            >
              {t("viewAll")} →
            </Link>
          </div>

          {posts.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              {tPosts("noPosts")}
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">{t("ctaTitle")}</h2>
          <p className="text-muted-foreground mb-6">
            {t("ctaDescription")}
          </p>
          <Link
            href="/posts"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t("startReading")}
          </Link>
        </div>
      </section>
    </div>
  )
}
