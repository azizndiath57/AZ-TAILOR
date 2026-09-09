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
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-500">event</span>
            <div>
              <p className="text-sm text-blue-900 font-medium">Date de livraison prévue</p>
              <p className="text-base text-blue-800 font-bold mt-0.5">{deliveryDate}</p>
            </div>
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
