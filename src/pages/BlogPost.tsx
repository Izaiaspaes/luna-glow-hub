import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";
import { RelatedArticles } from "@/components/RelatedArticles";
import { getBlogPostBySlug, getRelatedPosts } from "@/data/blogPosts";
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react";
import { toast } from "sonner";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Layout } from "@/components/Layout";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const post = slug ? getBlogPostBySlug(slug) : undefined;

  useEffect(() => {
    if (!post) {
      navigate("/blog");
      return;
    }

    // SEO: Update page title and meta description
    document.title = `${post.title} | Luna Blog`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", post.metaDescription);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = post.metaDescription;
      document.head.appendChild(meta);
    }

    // SEO: Add keywords meta tag
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", post.keywords.join(", "));
    } else {
      const meta = document.createElement("meta");
      meta.name = "keywords";
      meta.content = post.keywords.join(", ");
      document.head.appendChild(meta);
    }

    // Scroll to top when post loads
    window.scrollTo(0, 0);
  }, [post, navigate]);

  if (!post) {
    return null;
  }

  const relatedPosts = getRelatedPosts(post.id, post.category);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  return (
    <Layout>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/blog")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Blog
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4">{post.category}</Badge>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Title - H1 for SEO */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8 pb-8 border-b">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="text-sm">{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{post.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{post.readTime} de leitura</span>
          </div>
        </div>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl leading-relaxed text-muted-foreground">
            {post.content.introduction}
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-12">
          {post.content.sections.map((section, index) => (
            <section key={index} className="space-y-6">
              {/* H2 for main sections - SEO */}
              <h2 className="text-3xl font-bold mb-4">{section.heading}</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {section.content}
              </p>

              {/* Subsections if any */}
              {section.subsections && (
                <div className="space-y-6 mt-6">
                  {section.subsections.map((subsection, subIndex) => (
                    <div key={subIndex} className="pl-6 border-l-4 border-primary/30">
                      {/* H3 for subsections - SEO */}
                      <h3 className="text-2xl font-semibold mb-3">
                        {subsection.subheading}
                      </h3>
                      <p className="text-base leading-relaxed text-muted-foreground">
                        {subsection.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Conclusion */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-3xl font-bold mb-4">Conclusão</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {post.content.conclusion}
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl text-center">
          <h3 className="text-2xl font-bold mb-4">
            Pronta para cuidar melhor de você?
          </h3>
          <p className="text-muted-foreground mb-6">
            Comece a rastrear seu ciclo e receba recomendações personalizadas
            com o Luna.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-primary to-primary-glow"
          >
            Começar agora gratuitamente
          </Button>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && <RelatedArticles posts={relatedPosts} />}

      <Footer />
      
      <WhatsAppButton />
    </div>
    </Layout>
  );
};

export default BlogPost;
