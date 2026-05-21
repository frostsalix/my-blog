import { prisma } from "@/lib/prisma";

export default async function Home() {
  const posts = await prisma.post.findMany();

  return (
    <main>
      <h1>My Blog</h1>

      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
        </div>
      ))}
    </main>
  );
}