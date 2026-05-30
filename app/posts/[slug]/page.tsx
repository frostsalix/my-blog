import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Backlinks } from "@/components/blog/Backlinks"
import { CommentSection } from "@/components/blog/CommentSection"
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer"
import { RelatedNotes } from "@/components/blog/RelatedNotes"
import { isPostRevisited } from "@/lib/posts/revision-status"
import { getPostBySlug } from "@/lib/queries"
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
    <article className="relative">
      <header className="mx-auto max-w-[760px] px-5 pb-12 pt-16 sm:px-6 sm:pb-14 sm:pt-24">
        <div className="mb-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase text-muted-foreground/55">
          <time dateTime={post.publishedAt?.toISOString()}>
            {post.publishedAt ? formatDateLong(post.publishedAt) : t("draft")}
          </time>
          {isPostRevisited(post) && (
            <>
              <span className="text-border/50">/</span>
              <time dateTime={post.updatedAt.toISOString()}>
                {t("updated")} {formatDateLong(post.updatedAt)}
              </time>
            </>
          )}
          {post.category && (
            <>
              <span className="text-border/50">/</span>
              <Link
                href={`/categories/${post.category.slug}`}
                className="transition-colors hover:text-foreground/80"
              >
                {post.category.title}
              </Link>
            </>
          )}
          <span className="text-border/50">/</span>
          <span>{post.author.name}</span>
        </div>

        <h1 className="max-w-[720px] text-balance font-serif text-[2.25rem] font-medium leading-[1.18] text-foreground/95 sm:text-[3.6rem] sm:leading-[1.12]">
          {post.title}
        </h1>

        {post.summary && (
          <p className="mt-7 max-w-[680px] font-serif text-lg leading-[1.85] text-muted-foreground/75 sm:text-xl">
            {post.summary}
          </p>
        )}

        {tags.length > 0 && (
          <div className="mt-7 flex flex-wrap gap-x-4 gap-y-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="font-mono text-[11px] lowercase text-muted-foreground/45 transition-colors hover:text-foreground/75"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="mx-auto max-w-[760px] px-5 pb-16 sm:px-6">
        <div className="mb-12 h-px bg-gradient-to-r from-transparent via-border/45 to-transparent" />
        {post.content && <MarkdownRenderer content={post.content} />}
      </div>

      <div className="mx-auto max-w-[760px] px-5 pb-10 sm:px-6">
        <Suspense>
          <Backlinks postId={post.id} />
        </Suspense>
      </div>

      <div className="mx-auto max-w-[760px] px-5 pb-10 sm:px-6">
        <Suspense>
          <RelatedNotes postId={post.id} tags={tags} categoryId={post.categoryId} />
        </Suspense>
      </div>

      <div className="mx-auto max-w-[760px] px-5 pb-16 sm:px-6 sm:pb-20">
        <Suspense>
          <CommentSection postId={post.id} />
        </Suspense>
      </div>
    </article>
  )
}
