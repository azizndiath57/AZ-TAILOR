-- Photos de tissus (à exécuter une seule fois dans l'éditeur SQL de Supabase)
--
-- Avant : n'importe qui, même sans compte, pouvait lister toutes les photos du bucket.
-- Après : chaque atelier ne peut lister que ses propres photos.
-- Les photos restent visibles par leur lien direct (bucket public), comme sur la page de suivi.

drop policy "Autoriser tout le monde a voir les photos" on storage.objects;

create policy "Chaque atelier liste ses propres photos" on storage.objects
  for select to authenticated
  using (bucket_id = 'fabric_photos' and owner_id = (select auth.uid())::text);
