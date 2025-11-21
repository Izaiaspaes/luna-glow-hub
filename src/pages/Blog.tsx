import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/Footer";
import blogCycleImage from "@/assets/blog-cycle-understanding.jpg";
import blogNutritionImage from "@/assets/blog-nutrition-hormonal.jpg";
import blogSleepImage from "@/assets/blog-sleep-quality.jpg";
import blogMentalHealthImage from "@/assets/blog-mental-health.jpg";

const blogPosts = [
  {
    id: 1,
    title: "Entendendo seu Ciclo Menstrual: Um Guia Completo",
    excerpt:
      "Descubra as 4 fases do ciclo menstrual e como cada uma afeta seu corpo, humor e energia. Aprenda a identificar padrões e otimizar sua rotina de acordo com cada fase.",
    category: "Ciclo Menstrual",
    image: blogCycleImage,
    date: "15 Nov 2024",
    readTime: "8 min",
  },
  {
    id: 2,
    title: "Nutrição e Equilíbrio Hormonal: O Que Comer em Cada Fase",
    excerpt:
      "Alimentos específicos podem ajudar a equilibrar seus hormônios naturalmente. Conheça o que incluir na sua dieta durante cada fase do ciclo para se sentir melhor.",
    category: "Nutrição",
    image: blogNutritionImage,
    date: "12 Nov 2024",
    readTime: "6 min",
  },
  {
    id: 3,
    title: "Qualidade do Sono e Saúde Hormonal: A Conexão Essencial",
    excerpt:
      "O sono afeta diretamente seus hormônios e bem-estar. Descubra como melhorar sua qualidade de sono e criar uma rotina noturna que realmente funciona.",
    category: "Sono",
    image: blogSleepImage,
    date: "10 Nov 2024",
    readTime: "7 min",
  },
  {
    id: 4,
    title: "Saúde Mental no Ciclo: Gerenciando Humor e Ansiedade",
    excerpt:
      "As flutuações hormonais podem afetar seu humor e bem-estar emocional. Aprenda estratégias práticas para cuidar da sua saúde mental durante todo o ciclo.",
    category: "Saúde Mental",
    image: blogMentalHealthImage,
    date: "8 Nov 2024",
    readTime: "9 min",
  },
];

const categories = [
  "Todos",
  "Ciclo Menstrual",
  "Nutrição",
  "Sono",
  "Saúde Mental",
];

const Blog = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "Todos" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Luna Blog</span>
          </div>
          <Button onClick={() => navigate("/")} variant="ghost">
            Voltar ao início
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
            Conteúdo Educativo sobre Saúde Feminina
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Aprenda mais sobre seu corpo, ciclo menstrual, bem-estar e saúde
            hormonal com conteúdo baseado em ciência e experiências reais.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar artigos..."
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
                  onClick={() => {
                    // Future: navigate to individual blog post
                    console.log("Navigate to post:", post.id);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                Nenhum artigo encontrado. Tente outra busca ou categoria.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
