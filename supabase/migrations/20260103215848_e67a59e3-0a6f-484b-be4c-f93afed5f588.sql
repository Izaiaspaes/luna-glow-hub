
-- Policy para permitir que parceiros aceitos vejam os dados de ciclo do owner
CREATE POLICY "Partners can view owner cycle data"
ON public.cycle_tracking
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.partner_relationships pr
    WHERE pr.owner_user_id = cycle_tracking.user_id
      AND pr.partner_user_id = auth.uid()
      AND pr.status = 'accepted'
      AND (pr.sharing_settings->>'cycle')::boolean = true
  )
);

-- Policy para permitir que parceiros aceitos vejam o perfil do owner
CREATE POLICY "Partners can view owner profile"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.partner_relationships pr
    WHERE pr.owner_user_id = profiles.user_id
      AND pr.partner_user_id = auth.uid()
      AND pr.status = 'accepted'
  )
);

-- Policy para permitir que qualquer pessoa veja convites pendentes pelo token (para aceitar/recusar)
CREATE POLICY "Anyone can view pending invites by token"
ON public.partner_relationships
FOR SELECT
USING (
  status = 'pending'
);
