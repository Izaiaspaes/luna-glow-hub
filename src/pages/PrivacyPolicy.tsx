import { Layout } from "@/components/Layout";
import { Footer } from "@/components/Footer";
import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-colorful mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Política de Privacidade
                </h1>
                <p className="text-lg text-muted-foreground">
                  Última atualização: {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div className="prose prose-lg max-w-none space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">1. Compromisso com sua Privacidade</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    A Luna está comprometida em proteger sua privacidade e seus dados pessoais. Esta política descreve como coletamos, usamos, armazenamos e protegemos suas informações de acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">2. Dados que Coletamos</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Coletamos apenas as informações necessárias para oferecer nossos serviços:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Dados de cadastro: nome, e-mail e telefone</li>
                    <li>Dados de saúde: informações sobre ciclo menstrual, sono, humor e energia (com seu consentimento explícito)</li>
                    <li>Dados de uso: como você interage com a plataforma</li>
                    <li>Cookies essenciais: para funcionamento do site</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">3. Como Usamos seus Dados</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Seus dados são utilizados para:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Fornecer os serviços da plataforma Luna</li>
                    <li>Gerar recomendações personalizadas de bem-estar</li>
                    <li>Melhorar sua experiência e nossos serviços</li>
                    <li>Enviar notificações relevantes (se autorizado)</li>
                    <li>Cumprir obrigações legais</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">4. Proteção e Segurança</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Implementamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda, destruição ou alteração. Todos os dados sensíveis são criptografados e armazenados em servidores seguros.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">5. Seus Direitos (LGPD)</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Você tem o direito de:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Acessar seus dados pessoais</li>
                    <li>Corrigir dados incompletos ou desatualizados</li>
                    <li>Solicitar a exclusão de seus dados</li>
                    <li>Revogar consentimento a qualquer momento</li>
                    <li>Exportar seus dados em formato portável</li>
                    <li>Obter informações sobre o compartilhamento de dados</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Para exercer esses direitos, entre em contato através do e-mail: <a href="mailto:suporte@lunaglow.com.br" className="text-primary hover:underline">suporte@lunaglow.com.br</a>
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">6. Compartilhamento de Dados</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Não vendemos seus dados pessoais. Compartilhamos informações apenas quando necessário para prestação dos serviços (ex: processamento de pagamentos) ou quando exigido por lei. Todos os parceiros são cuidadosamente selecionados e obrigados a proteger seus dados.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Utilizamos cookies essenciais para o funcionamento da plataforma. Você pode gerenciar suas preferências de cookies a qualquer momento nas configurações do navegador.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">8. Alterações nesta Política</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas através da plataforma ou por e-mail.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">9. Contato</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Para dúvidas sobre privacidade ou exercer seus direitos, entre em contato:
                  </p>
                  <ul className="list-none space-y-2 text-muted-foreground mt-3">
                    <li>E-mail: <a href="mailto:suporte@lunaglow.com.br" className="text-primary hover:underline">suporte@lunaglow.com.br</a></li>
                    <li>E-mail (contato geral): <a href="mailto:contato@lunaglow.com.br" className="text-primary hover:underline">contato@lunaglow.com.br</a></li>
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
