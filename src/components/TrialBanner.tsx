import { useTranslation } from 'react-i18next';
import { useTrial } from '@/hooks/useTrial';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Gift, Clock, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';

export function TrialBanner() {
  const { t } = useTranslation();
  const { isTrialActive, daysRemaining, trialType } = useTrial();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (!isTrialActive || dismissed) return null;

  const isUrgent = daysRemaining <= 2;

  return (
    <div 
      className={`relative py-3 px-4 ${
        isUrgent 
          ? 'bg-gradient-to-r from-orange-500 to-red-500' 
          : 'bg-gradient-to-r from-primary to-purple-600'
      } text-white`}
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isUrgent ? 'bg-white/20' : 'bg-white/10'}`}>
            {isUrgent ? (
              <Clock className="h-5 w-5 animate-pulse" />
            ) : (
              <Gift className="h-5 w-5" />
            )}
          </div>
          <div>
            <p className="font-medium">
              {isUrgent ? (
                <>🚨 Seu trial termina em {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}!</>
              ) : (
                <>🎉 Você está experimentando o Premium! {daysRemaining} dias restantes</>
              )}
            </p>
            <p className="text-sm text-white/80">
              {isUrgent 
                ? 'Não perca acesso às funcionalidades premium - assine agora!'
                : 'Aproveite para explorar todas as funcionalidades premium'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/pricing')}
            className="whitespace-nowrap"
          >
            <span>Assinar Agora</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDismissed(true)}
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
