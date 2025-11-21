import blogCycleImage from "@/assets/blog-cycle-understanding.jpg";
import blogNutritionImage from "@/assets/blog-nutrition-hormonal.jpg";
import blogSleepImage from "@/assets/blog-sleep-quality.jpg";
import blogMentalHealthImage from "@/assets/blog-mental-health.jpg";

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  author: string;
  content: {
    introduction: string;
    sections: Array<{
      heading: string;
      content: string;
      subsections?: Array<{
        subheading: string;
        content: string;
      }>;
    }>;
    conclusion: string;
  };
  metaDescription: string;
  keywords: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "entendendo-ciclo-menstrual-guia-completo",
    title: "Entendendo seu Ciclo Menstrual: Um Guia Completo",
    excerpt:
      "Descubra as 4 fases do ciclo menstrual e como cada uma afeta seu corpo, humor e energia. Aprenda a identificar padrões e otimizar sua rotina de acordo com cada fase.",
    category: "Ciclo Menstrual",
    image: blogCycleImage,
    date: "15 Nov 2024",
    readTime: "8 min",
    author: "Dra. Carolina Mendes",
    metaDescription:
      "Guia completo sobre o ciclo menstrual feminino. Entenda as 4 fases, hormônios envolvidos e como otimizar sua rotina em cada fase do ciclo.",
    keywords: [
      "ciclo menstrual",
      "fases do ciclo",
      "hormônios femininos",
      "saúde da mulher",
      "menstruação",
    ],
    content: {
      introduction:
        "O ciclo menstrual é muito mais do que apenas a menstruação. É um processo complexo e fascinante que afeta todo o seu corpo, humor, energia e até mesmo suas preferências alimentares. Compreender seu ciclo é fundamental para tomar melhores decisões sobre sua saúde e bem-estar.",
      sections: [
        {
          heading: "As 4 Fases do Ciclo Menstrual",
          content:
            "O ciclo menstrual é dividido em quatro fases distintas, cada uma com características hormonais e físicas únicas. Conhecer essas fases permite que você adapte sua rotina, alimentação e atividades para aproveitar ao máximo cada momento do seu ciclo.",
          subsections: [
            {
              subheading: "Fase Menstrual (Dias 1-5)",
              content:
                "A fase menstrual marca o início do ciclo, quando os níveis hormonais estão baixos e o útero libera seu revestimento. É normal sentir mais cansaço, cólicas e necessidade de descanso. Dica: priorize atividades leves, alimentos anti-inflamatórios e muito autocuidado.",
            },
            {
              subheading: "Fase Folicular (Dias 6-14)",
              content:
                "Após a menstruação, os níveis de estrogênio começam a subir, trazendo mais energia, motivação e criatividade. É o momento ideal para começar novos projetos, fazer exercícios mais intensos e socializar. Seu corpo está se preparando para a ovulação.",
            },
            {
              subheading: "Fase Ovulatória (Dias 14-16)",
              content:
                "O pico de estrogênio e o aumento de testosterona tornam esta fase a mais energética do ciclo. Você pode se sentir mais confiante, comunicativa e com libido elevada. Aproveite para atividades importantes e exercícios de alta intensidade.",
            },
            {
              subheading: "Fase Lútea (Dias 17-28)",
              content:
                "Com o aumento da progesterona, você pode notar sintomas de TPM como irritabilidade, inchaço e vontade de comer doces. É hora de desacelerar, praticar autocuidado e focar em atividades mais tranquilas. A alimentação rica em magnésio pode ajudar.",
            },
          ],
        },
        {
          heading: "Hormônios e Suas Funções",
          content:
            "Quatro hormônios principais regulam seu ciclo menstrual: estrogênio, progesterona, hormônio folículo-estimulante (FSH) e hormônio luteinizante (LH). O estrogênio aumenta sua energia e humor, enquanto a progesterona promove relaxamento e sono. Entender essas flutuações hormonais ajuda a explicar as mudanças que você sente ao longo do mês.",
        },
        {
          heading: "Como Rastrear Seu Ciclo",
          content:
            "O rastreamento do ciclo pode ser feito de várias formas: aplicativos, calendário ou simplesmente anotações. Registre a data de início da menstruação, sintomas físicos (cólicas, dores de cabeça), humor e energia. Com o tempo, você identificará padrões únicos do seu corpo e poderá antecipar mudanças.",
        },
        {
          heading: "Otimizando Sua Rotina em Cada Fase",
          content:
            "Adapte suas atividades ao seu ciclo: planeje projetos importantes na fase folicular e ovulatória, quando sua energia está alta. Reserve a fase lútea para tarefas administrativas e reflexão. Durante a menstruação, priorize o descanso. Essa sincronização aumenta sua produtividade e bem-estar.",
        },
      ],
      conclusion:
        "Compreender seu ciclo menstrual é um ato de empoderamento. Ao reconhecer os padrões do seu corpo, você pode fazer escolhas mais conscientes sobre alimentação, exercícios, trabalho e vida social. Lembre-se: cada mulher é única, e seu ciclo pode variar. Use essas informações como guia e sempre consulte profissionais de saúde para orientações personalizadas.",
    },
  },
  {
    id: 2,
    slug: "nutricao-equilibrio-hormonal-alimentacao",
    title: "Nutrição e Equilíbrio Hormonal: O Que Comer em Cada Fase",
    excerpt:
      "Alimentos específicos podem ajudar a equilibrar seus hormônios naturalmente. Conheça o que incluir na sua dieta durante cada fase do ciclo para se sentir melhor.",
    category: "Nutrição",
    image: blogNutritionImage,
    date: "12 Nov 2024",
    readTime: "6 min",
    author: "Nutricionista Ana Paula Costa",
    metaDescription:
      "Descubra como a nutrição pode equilibrar seus hormônios naturalmente. Guia de alimentação para cada fase do ciclo menstrual.",
    keywords: [
      "nutrição feminina",
      "equilíbrio hormonal",
      "alimentação saudável",
      "dieta para TPM",
      "saúde hormonal",
    ],
    content: {
      introduction:
        "A alimentação desempenha um papel crucial no equilíbrio hormonal. Escolher os alimentos certos em cada fase do ciclo menstrual pode reduzir sintomas desconfortáveis, aumentar sua energia e promover bem-estar geral.",
      sections: [
        {
          heading: "Nutrição na Fase Menstrual",
          content:
            "Durante a menstruação, seu corpo perde ferro e outros nutrientes importantes. Priorize alimentos ricos em ferro como carnes magras, feijão, lentilha e vegetais verde-escuros. Adicione vitamina C para melhorar a absorção de ferro.",
          subsections: [
            {
              subheading: "Alimentos Recomendados",
              content:
                "Carnes vermelhas magras, frango, peixes, lentilhas, espinafre, couve, beterraba, laranja, morango. Chás de gengibre e canela ajudam com cólicas.",
            },
            {
              subheading: "O Que Evitar",
              content:
                "Reduza cafeína, sal em excesso e alimentos processados que podem intensificar cólicas e retenção de líquidos.",
            },
          ],
        },
        {
          heading: "Nutrição na Fase Folicular",
          content:
            "Com o aumento do estrogênio, seu metabolismo acelera. É hora de incluir carboidratos complexos, proteínas magras e gorduras saudáveis. Frutas frescas, grãos integrais e legumes devem estar em abundância no prato.",
          subsections: [
            {
              subheading: "Alimentos Energéticos",
              content:
                "Aveia, quinoa, arroz integral, ovos, abacate, nozes, sementes de chia, frutas cítricas e vegetais crucíferos como brócolis.",
            },
          ],
        },
        {
          heading: "Nutrição na Fase Ovulatória",
          content:
            "No pico hormonal, seu corpo precisa de antioxidantes e fibras. Frutas vermelhas, vegetais coloridos e alimentos ricos em ômega-3 apoiam a saúde cardiovascular e hormonal durante esta fase.",
        },
        {
          heading: "Nutrição na Fase Lútea",
          content:
            "A progesterona aumenta e com ela pode vir a TPM. Magnésio, vitamina B6 e cálcio são seus aliados. Chocolate amargo (70% cacau ou mais), banana, batata-doce e folhas verdes ajudam a controlar os sintomas.",
          subsections: [
            {
              subheading: "Combatendo a TPM com Alimentação",
              content:
                "Magnésio reduz cólicas e irritabilidade: encontrado em amêndoas, cacau, banana. Vitamina B6 melhora o humor: presente em grão-de-bico, salmão, frango. Cálcio reduz sintomas emocionais: laticínios, sardinha, brócolis.",
            },
          ],
        },
        {
          heading: "Suplementação: Quando Considerar",
          content:
            "Embora uma dieta equilibrada seja ideal, algumas mulheres podem precisar de suplementação, especialmente de ferro, vitamina D, ômega-3 e complexo B. Consulte sempre um nutricionista ou médico antes de iniciar suplementos.",
        },
      ],
      conclusion:
        "A nutrição personalizada para cada fase do ciclo não é apenas sobre aliviar sintomas, mas sobre nutrir seu corpo de forma inteligente. Ao fazer escolhas alimentares conscientes, você apoia seu equilíbrio hormonal natural e promove saúde duradoura.",
    },
  },
  {
    id: 3,
    slug: "qualidade-sono-saude-hormonal-conexao",
    title: "Qualidade do Sono e Saúde Hormonal: A Conexão Essencial",
    excerpt:
      "O sono afeta diretamente seus hormônios e bem-estar. Descubra como melhorar sua qualidade de sono e criar uma rotina noturna que realmente funciona.",
    category: "Sono",
    image: blogSleepImage,
    date: "10 Nov 2024",
    readTime: "7 min",
    author: "Dra. Mariana Silva",
    metaDescription:
      "Entenda a conexão entre sono e hormônios femininos. Dicas práticas para melhorar a qualidade do sono e o equilíbrio hormonal.",
    keywords: [
      "qualidade do sono",
      "sono e hormônios",
      "insônia feminina",
      "rotina noturna",
      "higiene do sono",
    ],
    content: {
      introduction:
        "O sono é fundamental para a saúde hormonal. Durante o sono, seu corpo produz e regula hormônios essenciais, incluindo aqueles que controlam o ciclo menstrual, o estresse e o metabolismo. A privação de sono pode desregular todo o sistema hormonal.",
      sections: [
        {
          heading: "Como o Sono Afeta os Hormônios",
          content:
            "Durante o sono profundo, seu corpo produz hormônio do crescimento, regula a insulina e equilibra os hormônios do estresse (cortisol). A falta de sono aumenta o cortisol, desregula o estrogênio e a progesterona, e pode intensificar sintomas de TPM.",
        },
        {
          heading: "Sono e o Ciclo Menstrual",
          content:
            "Diferentes fases do ciclo afetam a qualidade do sono. Durante a fase lútea, a progesterona elevada pode causar sonolência, mas também pode fragmentar o sono. Na menstruação, cólicas e desconforto podem atrapalhar o descanso.",
          subsections: [
            {
              subheading: "Estratégias para Cada Fase",
              content:
                "Fase menstrual: use travesseiro térmico, evite cafeína à tarde. Fase folicular: aproveite a energia, mas mantenha horários regulares. Fase lútea: crie rotina relaxante, considere chá de camomila antes de dormir.",
            },
          ],
        },
        {
          heading: "Criando uma Rotina Noturna Eficaz",
          content:
            "Uma rotina noturna consistente sinaliza ao corpo que é hora de descansar. Comece a desacelerar 1-2 horas antes de dormir: desligue telas, diminua as luzes, faça atividades relaxantes como leitura ou meditação.",
          subsections: [
            {
              subheading: "Passo a Passo da Rotina Ideal",
              content:
                "1. Jantar leve 2-3 horas antes de dormir. 2. Desligue eletrônicos 1 hora antes. 3. Tome banho morno. 4. Pratique respiração profunda ou meditação. 5. Leia algo relaxante. 6. Mantenha o quarto escuro, fresco e silencioso.",
            },
          ],
        },
        {
          heading: "Higiene do Sono: Princípios Fundamentais",
          content:
            "Mantenha horários regulares de sono e despertar, mesmo nos finais de semana. Evite cafeína após 14h, álcool antes de dormir e refeições pesadas à noite. Seu quarto deve ser santuário do sono: escuro, silencioso e com temperatura confortável (18-21°C).",
        },
        {
          heading: "Suplementos Naturais para o Sono",
          content:
            "Magnésio relaxa músculos e acalma o sistema nervoso. Melatonina regula o ciclo sono-vigília (use com orientação médica). Chás de camomila, valeriana e passiflora têm propriedades calmantes. Sempre consulte um profissional antes de iniciar suplementação.",
        },
        {
          heading: "Quando Buscar Ajuda Profissional",
          content:
            "Se você tem insônia crônica (mais de 3 vezes por semana por 3 meses), ronca intensamente, sente sonolência excessiva durante o dia ou suspeita de apneia do sono, procure um médico especialista em sono.",
        },
      ],
      conclusion:
        "O sono de qualidade é um pilar da saúde hormonal e do bem-estar geral. Ao priorizar o descanso e criar uma rotina noturna sólida, você está investindo em sua saúde presente e futura. Lembre-se: dormir bem não é luxo, é necessidade.",
    },
  },
  {
    id: 4,
    slug: "saude-mental-ciclo-gerenciando-humor-ansiedade",
    title: "Saúde Mental no Ciclo: Gerenciando Humor e Ansiedade",
    excerpt:
      "As flutuações hormonais podem afetar seu humor e bem-estar emocional. Aprenda estratégias práticas para cuidar da sua saúde mental durante todo o ciclo.",
    category: "Saúde Mental",
    image: blogMentalHealthImage,
    date: "8 Nov 2024",
    readTime: "9 min",
    author: "Psicóloga Juliana Tavares",
    metaDescription:
      "Guia completo sobre saúde mental e ciclo menstrual. Estratégias para gerenciar humor, ansiedade e sintomas emocionais da TPM.",
    keywords: [
      "saúde mental feminina",
      "TPM emocional",
      "ansiedade hormonal",
      "humor e ciclo menstrual",
      "bem-estar emocional",
    ],
    content: {
      introduction:
        "As mudanças hormonais ao longo do ciclo menstrual não afetam apenas seu corpo físico, mas também seu estado emocional e mental. Compreender essa conexão e desenvolver estratégias de autocuidado emocional é essencial para o bem-estar integral.",
      sections: [
        {
          heading: "A Conexão Entre Hormônios e Saúde Mental",
          content:
            "Estrogênio e progesterona influenciam diretamente neurotransmissores como serotonina e dopamina, que regulam humor, motivação e bem-estar. Quando esses hormônios flutuam, é natural que seu estado emocional também mude.",
        },
        {
          heading: "Sintomas Emocionais em Cada Fase",
          content:
            "Cada fase do ciclo traz diferentes desafios emocionais. Reconhecer esses padrões permite que você seja mais compassiva consigo mesma e planeje estratégias de autocuidado.",
          subsections: [
            {
              subheading: "Fase Menstrual",
              content:
                "Você pode se sentir mais introspectiva, cansada emocionalmente e sensível. É normal querer ficar em casa e descansar. Permita-se essa pausa sem culpa.",
            },
            {
              subheading: "Fase Folicular",
              content:
                "Com o aumento do estrogênio, seu humor melhora, você se sente mais otimista e motivada. Aproveite essa fase para atividades sociais e novos desafios.",
            },
            {
              subheading: "Fase Ovulatória",
              content:
                "Pico de energia e confiança. Você pode se sentir mais extrovertida e comunicativa. É o momento ideal para conversas importantes e networking.",
            },
            {
              subheading: "Fase Lútea",
              content:
                "A TPM pode trazer irritabilidade, ansiedade, tristeza e sensação de sobrecarga. Pratique autocompaixão e estabeleça limites claros nas suas atividades.",
            },
          ],
        },
        {
          heading: "Estratégias para Gerenciar a Ansiedade Cíclica",
          content:
            "Respiração profunda ativa o sistema nervoso parassimpático, reduzindo ansiedade. Pratique 4-7-8: inspire por 4 segundos, segure por 7, expire por 8. Repita 4 vezes. Outras técnicas incluem meditação, journaling e caminhadas na natureza.",
        },
        {
          heading: "TPM Emocional: Validação e Manejo",
          content:
            "A TPM emocional é real e não está 'na sua cabeça'. Sintomas como irritabilidade, choro fácil e sensação de sobrecarga têm causa hormonal. Valide seus sentimentos, comunique suas necessidades e pratique autocuidado intensificado nesta fase.",
          subsections: [
            {
              subheading: "Ferramentas Práticas",
              content:
                "1. Journaling emocional: escreva seus sentimentos sem julgamento. 2. Movimento: exercícios leves liberam endorfina. 3. Conexão: converse com pessoas de confiança. 4. Limite telas e redes sociais que intensificam ansiedade.",
            },
          ],
        },
        {
          heading: "Mindfulness e Autocuidado Emocional",
          content:
            "Mindfulness significa estar presente no momento sem julgamento. Práticas simples como observar a respiração, fazer refeições conscientes ou simplesmente parar e observar seus pensamentos podem reduzir significativamente o estresse e a ansiedade.",
        },
        {
          heading: "Quando Procurar Ajuda Profissional",
          content:
            "Se sintomas emocionais interferem significativamente na sua vida (trabalho, relacionamentos, rotina), se você sente tristeza profunda na maioria dos dias, ou se tem pensamentos de autoagressão, procure um psicólogo ou psiquiatra. Transtorno disfórico pré-menstrual (TDPM) é uma condição séria que requer tratamento especializado.",
        },
      ],
      conclusion:
        "Cuidar da saúde mental ao longo do ciclo menstrual é um ato de amor-próprio. Ao reconhecer os padrões emocionais do seu corpo e implementar estratégias de autocuidado, você cultiva resiliência emocional e bem-estar duradouro. Lembre-se: pedir ajuda é sinal de força, não fraqueza.",
    },
  },
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find((post) => post.slug === slug);
};

export const getRelatedPosts = (
  currentPostId: number,
  category: string,
  limit: number = 3
): BlogPost[] => {
  return blogPosts
    .filter((post) => post.id !== currentPostId && post.category === category)
    .slice(0, limit);
};
