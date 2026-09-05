-- 1. Ajouter la colonne 'role' à la table profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'tailor' NOT NULL;

-- 2. Ajouter une politique RLS pour permettre à un admin de tout voir
-- Remarque: Puisque nous utilisons le SERVICE_ROLE_KEY dans le backend pour
-- récupérer toutes les données, nous n'avons pas strictement besoin d'une
-- politique 'admin can read all' pour les requêtes frontend. 
-- Mais c'est une bonne pratique de l'avoir au cas où.

DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p2 
            WHERE p2.id = auth.uid() AND p2.role = 'admin'
        )
    );
