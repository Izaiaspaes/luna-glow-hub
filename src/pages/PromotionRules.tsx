import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { Gift, Ticket, CheckCircle, AlertCircle, Users, Calendar, Percent } from "lucide-react";

const PromotionRules = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [agreed, setAgreed] = useState(false);

  const handleAgree = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-luna-pink to-luna-purple text-white mb-4">
            <Gift className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Regras de Promoções e Indicações
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Conheça todas as regras do nosso programa de indicações e cupons promocionais para aproveitar ao máximo os benefícios da Luna.
          </p>
        </div>

        {/* Referral Rules */}
        <Card className="border-luna-purple/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-luna-purple/10">
                <Users className="w-5 h-5 text-luna-purple" />
              </div>
              Programa Indique e Ganhe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-luna-green mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>Como funciona:</strong> Compartilhe seu link de indicação exclusivo com amigas e conhecidas. Quando elas se cadastrarem e assinarem um plano pago, você ganha benefícios!
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-luna-green mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>Benefício para quem indica:</strong> Você recebe 10% de desconto na sua próxima renovação de assinatura quando sua indicada permanecer assinante por 30 dias consecutivos.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-luna-green mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>Período de elegibilidade:</strong> A indicada deve manter a assinatura ativa por no mínimo 30 dias para que o desconto seja aplicado à sua conta.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-luna-green mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>Acúmulo de descontos:</strong> Você pode acumular múltiplas indicações válidas. Os descontos são aplicados automaticamente na sua próxima cobrança.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-luna-orange mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>Importante:</strong> Indicações fraudulentas, autocadastramentos ou uso indevido do programa resultarão na perda dos benefícios e possível suspensão da conta.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coupon Rules */}
        <Card className="border-luna-pink/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-luna-pink/10">
                <Ticket className="w-5 h-5 text-luna-pink" />
              </div>
              Cupons Promocionais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-luna-green mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>Validade:</strong> Cada cupom possui uma data de validade específica. Cupons expirados não podem ser utilizados ou reativados.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-luna-green mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>Uso único:</strong> Salvo indicação contrária, cada cupom pode ser utilizado apenas uma vez por usuária.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-luna-green mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>Limite de uso:</strong> Alguns cupons possuem limite máximo de utilizações. Quando esgotado, o cupom se torna inválido.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-luna-green mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>Tipos de desconto:</strong> Os cupons podem oferecer desconto percentual (ex: 20% off) ou valor fixo (ex: R$ 10 off), conforme especificado.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-luna-orange mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>Não cumulativo:</strong> Cupons não podem ser combinados com outras promoções, descontos de indicação ou ofertas especiais, salvo indicação expressa.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Rules */}
        <Card className="border-luna-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-luna-blue/10">
                <Calendar className="w-5 h-5 text-luna-blue" />
              </div>
              Regras Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Percent className="w-5 h-5 text-luna-blue mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  A Luna reserva-se o direito de alterar, suspender ou encerrar programas promocionais a qualquer momento, mediante aviso prévio.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Percent className="w-5 h-5 text-luna-blue mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  Benefícios e descontos são pessoais e intransferíveis, vinculados exclusivamente à conta da usuária beneficiária.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Percent className="w-5 h-5 text-luna-blue mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  Em caso de cancelamento da assinatura, os benefícios acumulados são perdidos e não podem ser recuperados posteriormente.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Percent className="w-5 h-5 text-luna-blue mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  A Luna pode solicitar verificação de identidade para liberação de benefícios em casos de suspeita de fraude.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Percent className="w-5 h-5 text-luna-blue mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  Dúvidas sobre promoções podem ser enviadas para suporte@lunaglow.com.br
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agreement Section */}
        <Card className="border-2 border-dashed border-muted-foreground/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-3">
                <Checkbox 
                  id="agree" 
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked === true)}
                />
                <label 
                  htmlFor="agree" 
                  className="text-foreground cursor-pointer select-none"
                >
                  Li e compreendi todas as regras de promoções e indicações da Luna
                </label>
              </div>
              <Button
                onClick={handleAgree}
                disabled={!agreed}
                size="lg"
                className="bg-gradient-to-r from-luna-pink to-luna-purple hover:opacity-90 text-white px-8"
              >
                Li e Concordo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromotionRules;
