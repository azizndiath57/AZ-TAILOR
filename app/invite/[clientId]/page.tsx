import { ClientsRepository } from "@/lib/data-access";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ clientId: string }> }): Promise<Metadata> {
  const { clientId } = await params;
  const data = await ClientsRepository.getPublicClientAndSettings(clientId);
  
  if (!data) return { title: "Invitation introuvable" };
  return {
    title: `Invitation - ${data.settings.workshopName}`,
    description: `${data.client.firstName} vous invite à découvrir ${data.settings.workshopName}`,
  };
}

export default async function InvitePage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const data = await ClientsRepository.getPublicClientAndSettings(clientId);
  
  if (!data) {
    notFound();
  }

  const { client, settings } = data;
  
  // Format WhatsApp message
  const prefilledMessage = encodeURIComponent(
    `Bonjour, je viens de la part de ${client.firstName}. Je souhaiterais discuter d'une création sur-mesure !`
  );
  
  const whatsappUrl = settings.phone 
    ? `https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}?text=${prefilledMessage}`
    : "#";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col font-sans relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <main className="flex-1 w-full max-w-md mx-auto p-6 flex flex-col justify-center items-center relative z-10 min-h-[100dvh]">
        
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full border border-white/50 text-center relative">
          
          {/* Badge Sponsor */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg border-2 border-white flex items-center gap-2 whitespace-nowrap">
            <span className="material-symbols-outlined text-lg">celebration</span>
            Invité(e) par {client.firstName}
          </div>

          {/* Workshop Details */}
          <div className="mt-8 mb-6">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.workshopName} className="w-24 h-24 object-contain rounded-2xl mx-auto shadow-sm border border-gray-100" />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-blue-50 rounded-2xl flex items-center justify-center text-indigo-500 mx-auto shadow-sm border border-gray-100">
                <span className="material-symbols-outlined text-4xl">storefront</span>
              </div>
            )}
            
            <h1 className="text-3xl font-extrabold text-gray-900 mt-6 tracking-tight">
              {settings.workshopName}
            </h1>
            
            {settings.slogan && (
              <p className="text-gray-500 font-medium mt-2">
                {settings.slogan}
              </p>
            )}
          </div>

          {/* Value Proposition */}
          <div className="bg-blue-50/50 rounded-2xl p-5 mb-8 border border-blue-100/50">
            <h2 className="text-gray-800 font-semibold mb-2">Créez votre tenue de rêve</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Votre ami(e) {client.firstName} vous recommande chaudement notre atelier. Cliquez ci-dessous pour discuter de votre futur projet sur-mesure !
            </p>
          </div>

          {/* CTA */}
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center gap-3 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-500/30 transition-all active:scale-95 ${settings.phone ? 'bg-[#25D366] hover:bg-[#1ebd5c]' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Contacter sur WhatsApp
          </a>

        </div>

        {/* Footer */}
        <p className="mt-8 text-indigo-900/40 text-sm font-medium">
          Propulsé par <span className="font-bold">AZ-TAILOR</span>
        </p>
      </main>
    </div>
  );
}
