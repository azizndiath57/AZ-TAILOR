import { OrdersRepository } from "@/lib/data-access";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await OrdersRepository.getPublicOrderById(id);
  if (!data) return { title: "Commande introuvable" };
  return {
    title: `Suivi Commande - ${data.settings.workshopName}`,
  };
}

export default async function PublicOrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await OrdersRepository.getPublicOrderById(id);
  
  if (!data) {
    notFound();
  }

  const { order, settings } = data;

  const STATUS_STEPS = [
    { id: 'en_attente', label: 'En attente', icon: 'pending_actions' },
    { id: 'en_cours', label: 'En cours', icon: 'cut' },
    { id: 'pret', label: 'Prêt', icon: 'check_circle' },
    { id: 'livre', label: 'Livré', icon: 'local_shipping' }
  ];

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.id === order.status);

  const deliveryDate = new Intl.DateTimeFormat('fr-FR', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  }).format(order.expectedDeliveryDate);

  const formattedBalance = new Intl.NumberFormat('fr-FR').format(order.balanceDue);
  const formattedTotal = new Intl.NumberFormat('fr-FR').format(order.totalPrice);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header Atelier */}
      <header className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.workshopName} className="w-12 h-12 object-contain rounded" />
            ) : (
              <div className="w-12 h-12 bg-midnight/5 rounded flex items-center justify-center text-midnight">
                <span className="material-symbols-outlined">storefront</span>
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">{settings.workshopName}</h1>
              {settings.slogan && <p className="text-sm text-gray-500">{settings.slogan}</p>}
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">Suivi Commande</span>
            <p className="text-sm font-bold text-gray-900">{order.reference}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 py-8 sm:py-12 flex flex-col gap-8">
        {/* Welcome */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Bonjour {order.client.firstName},</h2>
          <p className="text-gray-500 mt-2">Voici l'état d'avancement de votre vêtement ({order.garmentType}).</p>
          
          {order.fabricPhotoUrl && (
            <div className="mt-6 flex justify-center">
              <img 
                src={order.fabricPhotoUrl} 
                alt="Tissu" 
                className="w-24 h-24 object-cover rounded-xl shadow-sm border border-gray-200" 
              />
            </div>
          )}
        </div>

        {/* Progress Tracker */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-8">Statut de la confection</h3>
          
          <div className="relative">
            <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
              {STATUS_STEPS.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step.id} className="flex flex-row sm:flex-col items-center gap-4 sm:gap-3 text-left sm:text-center w-full">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors border-2 ${
                      isCompleted 
                        ? 'bg-green-50 border-green-500 text-green-600' 
                        : 'bg-white border-gray-200 text-gray-300'
                    }`}>
                      <span className="material-symbols-outlined text-[24px]">
                        {step.icon}
                      </span>
                    </div>
                    <div>
                      <p className={`font-medium text-sm sm:text-base ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full mt-1 inline-block">
                          Actuel
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {order.balanceDue === 0 && (
              <div className="mt-6 p-4 bg-green-50 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-green-500">check_circle</span>
                <div>
                  <p className="text-sm text-green-900 font-medium">Commande entièrement payée</p>
                  <p className="text-sm text-green-800 mt-1">Merci pour votre confiance !</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-500">event</span>
            <div>
              <p className="text-sm text-blue-900 font-medium">Date de livraison prévue</p>
              <p className="text-base text-blue-800 font-bold mt-0.5">{deliveryDate}</p>
            </div>
          </div>
        </div>

        {/* Parrainage Banner */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 sm:p-8 shadow-lg text-white text-center relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Offrez votre tailleur à vos amis !</h3>
            <p className="text-indigo-100 mb-6 max-w-md mx-auto">
              Vous aimez notre travail ? Partagez ce lien avec un ami. S'il commande, vous gagnez <span className="font-bold text-white">10% de réduction</span> sur votre prochaine tenue !
            </p>
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(`Hello, mon tailleur est incroyable ! Viens découvrir ses créations et passe commande de ma part : https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || 'az-tailor.com'}/invite/${order.clientId}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Partager sur WhatsApp
            </a>
          </div>
        </div>

        {/* Financials */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Paiement</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between text-gray-600">
              <span>Coût total de la confection</span>
              <span className="font-medium text-gray-900">{formattedTotal} FCFA</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Avance payée</span>
              <span className="font-medium text-green-600">{new Intl.NumberFormat('fr-FR').format(order.totalPaid)} FCFA</span>
            </div>
            <div className="h-px w-full bg-gray-100 my-4"></div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Reste à payer à la livraison</span>
              <span className="text-xl font-bold text-red-600">{formattedBalance} FCFA</span>
            </div>
            
            {order.balanceDue === 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2 text-green-700 text-sm font-medium">
                <span className="material-symbols-outlined">check_circle</span>
                La commande a été entièrement payée.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Viral Footer */}
      <footer className="mt-auto bg-midnight text-white text-center py-10 px-4">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white mb-2">
            <span className="material-symbols-outlined text-2xl">cut</span>
          </div>
          <h4 className="text-xl font-semibold">Géré avec AZ-TAILOR</h4>
          <p className="text-gray-400 text-sm">
            Vous êtes tailleur ? Simplifiez la gestion de votre atelier avec l'outil préféré des professionnels.
          </p>
          <div className="pt-4">
            <Link 
              href="/"
              className="inline-block bg-white text-midnight px-6 py-3 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors shadow-sm"
            >
              Créer mon compte gratuitement
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
