import { BlogCard } from "@/components/BlogCard";
import { useNavigate } from "react-router-dom";
import { BlogPost } from "@/data/blogPosts";

interface RelatedArticlesProps {
  posts: BlogPost[];
}

export const RelatedArticles = ({ posts }: RelatedArticlesProps) => {
  const navigate = useNavigate();

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Artigos Relacionados
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              category={post.category}
              image={post.image}
              date={post.date}
              readTime={post.readTime}
              onClick={() => navigate(`/blog/${post.slug}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
