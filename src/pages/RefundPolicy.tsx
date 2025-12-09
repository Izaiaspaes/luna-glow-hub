import { Layout } from "@/components/Layout";
import { Footer } from "@/components/Footer";
import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function RefundPolicy() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-colorful mb-4">
                  <RotateCcw className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {t('refundPolicy.title', 'Política de Reembolso')}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {t('refundPolicy.lastUpdated', 'Última atualização')}: {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div className="prose prose-lg max-w-none space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t('refundPolicy.section1.title', '1. Compromisso com sua Satisfação')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('refundPolicy.section1.content', 'Na Luna, nos empenhamos em oferecer um serviço de qualidade. Entendemos que circunstâncias podem mudar, e por isso criamos esta política de reembolso clara e justa.')}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t('refundPolicy.section2.title', '2. Período de Garantia')}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    {t('refundPolicy.section2.intro', 'Oferecemos um período de garantia de 7 dias corridos a partir da data da primeira compra:')}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>{t('refundPolicy.section2.item1', 'Se você não estiver satisfeita com o serviço nos primeiros 7 dias, pode solicitar reembolso integral')}</li>
                    <li>{t('refundPolicy.section2.item2', 'O período de 7 dias começa no dia da confirmação do pagamento')}</li>
                    <li>{t('refundPolicy.section2.item3', 'Esta garantia aplica-se apenas à primeira assinatura (novos clientes)')}</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t('refundPolicy.section3.title', '3. Como Solicitar Reembolso')}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    {t('refundPolicy.section3.intro', 'Para solicitar seu reembolso dentro do período de garantia:')}
                  </p>
                  <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                    <li>{t('refundPolicy.section3.step1', 'Envie um e-mail para suporte@lunaglow.com.br com o assunto "Solicitação de Reembolso"')}</li>
                    <li>{t('refundPolicy.section3.step2', 'Inclua o e-mail cadastrado na plataforma')}</li>
                    <li>{t('refundPolicy.section3.step3', 'Informe o motivo da solicitação (opcional, mas nos ajuda a melhorar)')}</li>
                    <li>{t('refundPolicy.section3.step4', 'Nossa equipe responderá em até 48 horas úteis')}</li>
                  </ol>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t('refundPolicy.section4.title', '4. Processamento do Reembolso')}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    {t('refundPolicy.section4.intro', 'Após aprovação da solicitação:')}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>{t('refundPolicy.section4.item1', 'O reembolso será processado em até 5 dias úteis')}</li>
                    <li>{t('refundPolicy.section4.item2', 'O valor será devolvido ao mesmo método de pagamento utilizado na compra')}</li>
                    <li>{t('refundPolicy.section4.item3', 'Cartões de crédito podem levar 1-2 ciclos de fatura para refletir o crédito')}</li>
                    <li>{t('refundPolicy.section4.item4', 'Você receberá confirmação por e-mail quando o reembolso for processado')}</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t('refundPolicy.section5.title', '5. Situações Não Elegíveis')}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    {t('refundPolicy.section5.intro', 'Reembolsos NÃO são concedidos nas seguintes situações:')}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>{t('refundPolicy.section5.item1', 'Solicitações após o período de 7 dias de garantia')}</li>
                    <li>{t('refundPolicy.section5.item2', 'Renovações automáticas de assinatura (cancele antes da renovação)')}</li>
                    <li>{t('refundPolicy.section5.item3', 'Uso indevido da plataforma ou violação dos Termos de Uso')}</li>
                    <li>{t('refundPolicy.section5.item4', 'Contas suspensas por motivos de segurança')}</li>
                    <li>{t('refundPolicy.section5.item5', 'Clientes que já utilizaram a garantia anteriormente')}</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t('refundPolicy.section6.title', '6. Cancelamento de Assinatura')}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    {t('refundPolicy.section6.intro', 'Importante distinguir entre reembolso e cancelamento:')}
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>{t('refundPolicy.section6.item1', 'Você pode cancelar sua assinatura a qualquer momento nas configurações do perfil')}</li>
                    <li>{t('refundPolicy.section6.item2', 'O cancelamento impede futuras cobranças, mas não gera reembolso do período atual')}</li>
                    <li>{t('refundPolicy.section6.item3', 'Após o cancelamento, você mantém acesso até o fim do período pago')}</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t('refundPolicy.section7.title', '7. Planos Anuais')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('refundPolicy.section7.content', 'Para assinaturas anuais, a mesma política de 7 dias se aplica. Após esse período, não há reembolso proporcional. Recomendamos experimentar o plano mensal primeiro se estiver incerta sobre o serviço.')}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t('refundPolicy.section8.title', '8. Casos Excepcionais')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('refundPolicy.section8.content', 'Em situações excepcionais (problemas técnicos graves, cobranças duplicadas, etc.), analisaremos cada caso individualmente. Entre em contato conosco explicando a situação.')}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t('refundPolicy.section9.title', '9. Direitos do Consumidor')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('refundPolicy.section9.content', 'Esta política não limita seus direitos garantidos pelo Código de Defesa do Consumidor brasileiro (Lei nº 8.078/90). Em caso de conflito, prevalecerão as disposições legais.')}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">{t('refundPolicy.section10.title', '10. Contato')}</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('refundPolicy.section10.content', 'Para dúvidas sobre esta política ou para solicitar reembolso:')}
                  </p>
                  <ul className="list-none space-y-2 text-muted-foreground mt-3">
                    <li>E-mail: <a href="mailto:suporte@lunaglow.com.br" className="text-primary hover:underline">suporte@lunaglow.com.br</a></li>
                    <li>WhatsApp: <a href="https://wa.me/5511963697488" className="text-primary hover:underline">+55 11 96369-7488</a></li>
                  </ul>
                </section>

                <section className="bg-muted/50 p-6 rounded-lg border">
                  <p className="text-muted-foreground text-center italic">
                    {t('refundPolicy.commitment', 'Na Luna, valorizamos cada cliente. Se você tiver qualquer problema, entre em contato antes de desistir - muitas vezes podemos resolver sua questão rapidamente.')}
                  </p>
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
