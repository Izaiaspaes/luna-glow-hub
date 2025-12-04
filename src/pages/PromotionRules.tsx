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
            {t("promotionRules.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("promotionRules.subtitle")}
          </p>
        </div>

        {/* Referral Rules */}
        <Card className="border-luna-purple/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-luna-purple/10">
                <Users className="w-5 h-5 text-luna-purple" />
              </div>
              {t("promotionRules.referral.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-luna-green mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>{t("promotionRules.referral.howItWorks")}</strong> {t("promotionRules.referral.howItWorksDesc")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-luna-green mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>{t("promotionRules.referral.benefit")}</strong> {t("promotionRules.referral.benefitDesc")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-luna-green mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>{t("promotionRules.referral.eligibility")}</strong> {t("promotionRules.referral.eligibilityDesc")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-luna-green mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>{t("promotionRules.referral.accumulation")}</strong> {t("promotionRules.referral.accumulationDesc")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-luna-orange mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>{t("promotionRules.referral.important")}</strong> {t("promotionRules.referral.importantDesc")}
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
              {t("promotionRules.coupons.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-luna-green mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>{t("promotionRules.coupons.validity")}</strong> {t("promotionRules.coupons.validityDesc")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-luna-green mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>{t("promotionRules.coupons.singleUse")}</strong> {t("promotionRules.coupons.singleUseDesc")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-luna-green mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>{t("promotionRules.coupons.usageLimit")}</strong> {t("promotionRules.coupons.usageLimitDesc")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-luna-green mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>{t("promotionRules.coupons.discountTypes")}</strong> {t("promotionRules.coupons.discountTypesDesc")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-luna-orange mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  <strong>{t("promotionRules.coupons.nonCumulative")}</strong> {t("promotionRules.coupons.nonCumulativeDesc")}
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
              {t("promotionRules.general.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Percent className="w-5 h-5 text-luna-blue mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  {t("promotionRules.general.rule1")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Percent className="w-5 h-5 text-luna-blue mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  {t("promotionRules.general.rule2")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Percent className="w-5 h-5 text-luna-blue mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  {t("promotionRules.general.rule3")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Percent className="w-5 h-5 text-luna-blue mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  {t("promotionRules.general.rule4")}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Percent className="w-5 h-5 text-luna-blue mt-0.5 shrink-0" />
                <p className="text-foreground/80">
                  {t("promotionRules.general.rule5")}
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
                  {t("promotionRules.agreement.checkbox")}
                </label>
              </div>
              <Button
                onClick={handleAgree}
                disabled={!agreed}
                size="lg"
                className="bg-gradient-to-r from-luna-pink to-luna-purple hover:opacity-90 text-white px-8"
              >
                {t("promotionRules.agreement.button")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromotionRules;
