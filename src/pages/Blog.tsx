import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { blogPosts } from "@/data/blogPosts";
import logoLuna from "@/assets/logo-luna.png";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";

const Blog = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(t('blogPage.categories.all'));
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    t('blogPage.categories.all'),
    t('blogPage.categories.menstrualCycle'),
    t('blogPage.categories.nutrition'),
    t('blogPage.categories.sleep'),
    t('blogPage.categories.mentalHealth'),
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === t('blogPage.categories.all') || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
            {t('blogPage.title')}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {t('blogPage.subtitle')}
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('blogPage.searchPlaceholder')}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 justify-center">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors px-4 py-2"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
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
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {t('blogPage.noResults')}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      
      <WhatsAppButton />
    </div>
    </Layout>
  );
};

export default Blog;
