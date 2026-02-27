"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { Newspaper, ExternalLink, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DeleteBlogButton } from "@/components/admin/delete-blog-button";
import { EmptyState } from "@/components/admin/empty-state";
import type { Post } from "@/lib/types";

export function BlogList({ initialPosts }: { initialPosts: Post[] }) {
  const [optimisticPosts, removeOptimisticPost] = useOptimistic(
    initialPosts,
    (state, id: string) => state.filter((p) => p.id !== id)
  );
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(() => {
      removeOptimisticPost(id);
    });
  };

  if (optimisticPosts.length === 0) {
    return (
      <EmptyState
        icon={Newspaper}
        title="No blog posts yet"
        description="Share insights and updates with your audience to build authority."
        actionLabel="New Post"
        actionHref="/admin/blog/new"
      />
    );
  }

  return (
    <div className="grid gap-6">
      {optimisticPosts.map((post: Post) => (
        <Card key={post.id} className="group overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {post.image_url && (
              <div className="md:w-48 h-32 relative flex-shrink-0">
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      {post.author || "MAPRIMO Team"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.published_at || post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/blog/${post.id}`}>
                    <Button variant="ghost" size="icon" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <DeleteBlogButton 
                    id={post.id} 
                    title={post.title} 
                    onDelete={handleDelete}
                  />
                  <Link href={`/blog/${post.slug}`} target="_blank">
                    <Button variant="ghost" size="icon" title="View Live">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
