import { Layout } from "@/components/Layout";
import { Footer } from "@/components/Footer";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Terms() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-colorful mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Termos de Uso
                </h1>
                <p className="text-lg text-muted-foreground">
                  Última atualização: {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div className="prose prose-lg max-w-none space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Ao acessar e usar a plataforma Luna, você concorda com estes Termos de Uso. Se não concordar com qualquer parte destes termos, não utilize nossos serviços.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    A Luna é uma plataforma de bem-estar feminino que oferece rastreamento de ciclo menstrual, recomendações personalizadas de saúde, assistente de IA e recursos de comunidade. Os serviços são oferecidos em planos gratuitos e pagos.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">3. Cadastro e Conta</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Para usar a Luna, você deve:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Ter no mínimo 13 anos de idade (menores de 18 precisam de autorização dos responsáveis)</li>
                    <li>Fornecer informações precisas e atualizadas</li>
                    <li>Manter a segurança de sua senha</li>
                    <li>Notificar-nos imediatamente sobre uso não autorizado de sua conta</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">4. Uso Aceitável</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Você concorda em NÃO:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Usar a plataforma para fins ilegais ou não autorizados</li>
                    <li>Violar direitos de propriedade intelectual</li>
                    <li>Transmitir vírus ou códigos maliciosos</li>
                    <li>Fazer engenharia reversa ou tentar acessar o código-fonte</li>
                    <li>Coletar dados de outros usuários sem consentimento</li>
                    <li>Usar bots ou automação não autorizada</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">5. Conteúdo e Propriedade Intelectual</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Todo o conteúdo da plataforma Luna (textos, gráficos, logos, ícones, imagens, código) é propriedade da Luna ou de seus licenciadores e protegido por leis de propriedade intelectual. Seus dados pessoais permanecem de sua propriedade.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">6. Planos Pagos e Assinaturas</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Para planos Premium e Premium Plus:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Pagamentos são processados através de serviços terceiros seguros (Stripe)</li>
                    <li>Assinaturas são renovadas automaticamente</li>
                    <li>Você pode cancelar a qualquer momento através das configurações</li>
                    <li>Não oferecemos reembolsos para períodos já pagos, exceto quando exigido por lei</li>
                    <li>Preços podem ser alterados com aviso prévio de 30 dias</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">7. Avisos Médicos e de Saúde</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>IMPORTANTE:</strong> A Luna oferece informações gerais sobre bem-estar e não substitui aconselhamento médico profissional. Sempre consulte um profissional de saúde para diagnóstico e tratamento de condições médicas. As recomendações da IA são apenas sugestões educacionais.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">8. Privacidade e Proteção de Dados</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    O uso de seus dados pessoais é regido por nossa <a href="/privacy-policy" className="text-primary hover:underline">Política de Privacidade</a>, que está em conformidade com a LGPD.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">9. Limitação de Responsabilidade</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    A Luna não se responsabiliza por danos indiretos, incidentais ou consequenciais resultantes do uso ou impossibilidade de uso da plataforma. Fornecemos os serviços "como estão" sem garantias de qualquer tipo.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">10. Suspensão e Encerramento</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Reservamo-nos o direito de suspender ou encerrar sua conta se você violar estes termos ou se o uso ameaçar a segurança ou funcionamento da plataforma.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">11. Modificações dos Termos</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Podemos atualizar estes termos periodicamente. Mudanças significativas serão notificadas através da plataforma. O uso continuado após as alterações constitui aceitação dos novos termos.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">12. Lei Aplicável</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida nos tribunais competentes do Brasil.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">13. Contato</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Para dúvidas sobre estes termos, entre em contato:
                  </p>
                  <ul className="list-none space-y-2 text-muted-foreground mt-3">
                    <li>E-mail: <a href="mailto:contato@lunaglow.com.br" className="text-primary hover:underline">contato@lunaglow.com.br</a></li>
                    <li>Suporte: <a href="mailto:suporte@lunaglow.com.br" className="text-primary hover:underline">suporte@lunaglow.com.br</a></li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </Layout>
  );
}
