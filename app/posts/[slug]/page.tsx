import { Suspense } from "react"
import { getPostBySlug } from "@/lib/queries"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer"
import { CategoryBadge } from "@/components/blog/CategoryBadge"
import { TagList } from "@/components/blog/TagBadge"
import { CommentSection } from "@/components/blog/CommentSection"
import { Backlinks } from "@/components/blog/Backlinks"
import { formatDateLong } from "@/lib/utils"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  try {
    const { slug } = await params
    const post = await getPostBySlug(decodeURIComponent(slug))
    if (!post) return { title: "Not Found" }
    return {
      title: post.title,
      description: post.summary ?? undefined,
    }
  } catch {
    return { title: "Not Found" }
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)

  let post
  try {
    post = await getPostBySlug(decodedSlug)
  } catch (e) {
    console.error("PostPage: getPostBySlug failed:", e)
    notFound()
  }

  const t = await getTranslations("post")

  if (!post || !post.published) {
    notFound()
  }

  const tags = post.tags.map((pt) => pt.tag)

  return (
    <article className="min-h-screen">
      {/* Subtle atmospheric background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808004_1px,transparent_1px),linear-gradient(to_bottom,#80808004_1px,transparent_1px)] bg-[size:64px_64px]"
          style={{
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 95%)'
          }}
        />
      </div>

      {/* Article header - spacious and editorial */}
      <header className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20">
        {/* Metadata - subtle and refined */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 sm:mb-8 text-xs text-muted-foreground/60 font-mono">
          <time dateTime={post.publishedAt?.toISOString()}>
            {post.publishedAt ? formatDateLong(post.publishedAt) : t("draft")}
          </time>
          {post.category && (
            <>
              <span className="text-border/60">·</span>
              <span className="text-muted-foreground/70">{post.category.title}</span>
            </>
          )}
        </div>

        {/* Title - large and impactful */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-6 sm:mb-8 tracking-tight leading-[1.1] text-balance">
          {post.title}
        </h1>

        {/* Summary - editorial lead */}
        {post.summary && (
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground/80 leading-relaxed mb-8 sm:mb-10 font-serif">
            {post.summary}
          </p>
        )}

        {/* Tags - minimal styling */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="text-xs text-muted-foreground/60 font-mono"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Author - understated */}
        <div className="text-sm text-muted-foreground/60 font-mono pt-6 border-t border-border/20">
          {post.author.name}
        </div>
      </header>

      {/* Article content - optimal reading experience */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24">
        {post.content && <MarkdownRenderer content={post.content} />}
      </div>

      {/* Backlinks - knowledge connections */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <Suspense>
          <Backlinks postId={post.id} />
        </Suspense>
      </div>

      {/* Comments - separated section */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24">
        <Suspense>
          <CommentSection postId={post.id} />
        </Suspense>
      </div>
    </article>
  )
}
