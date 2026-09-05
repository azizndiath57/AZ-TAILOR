"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { OrderWithFinancials } from "@/lib/data-access/types";

export default function InvoiceClient({ order, settings }: { order: OrderWithFinancials, settings: any }) {
  const router = useRouter();
  const [isSavedDialogOpen, setIsSavedDialogOpen] = useState(false);

  const handlePrint = () => {
    window.print();
    setIsSavedDialogOpen(false);
  };

  const handleSave = () => {
    // In a real app, you might trigger an API call here to mark as saved or send email
    setIsSavedDialogOpen(true);
  };

  const invoiceDate = new Intl.DateTimeFormat('fr-FR', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date());

  const deliveryDate = new Intl.DateTimeFormat('fr-FR', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date(order.expectedDeliveryDate));

  const whatsappText = `Bonjour ${order.client.firstName}, voici le récapitulatif de votre commande (${order.reference}). Le reste à payer est de ${new Intl.NumberFormat('fr-FR').format(order.balanceDue)} FCFA. Merci pour votre confiance ! - ${settings.workshopName || "AZ-TAILOR"}`;
  const whatsappUrl = `https://wa.me/${order.client.phone.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 print:pb-0 print:m-0 print:space-y-0 relative">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
        }
      `}} />
      
      {/* Action Bar (Hidden when printing) */}
      <div className="flex justify-between items-center print:hidden">
        <Link href="/orders" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <span aria-hidden="true" className="material-symbols-outlined text-[20px]">arrow_back</span>
          Retour aux commandes
        </Link>
        <div className="flex gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors shadow-sm"
          >
            <span className="font-bold">WhatsApp</span>
          </a>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-midnight text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">save</span>
            Enregistrer
          </button>
        </div>
      </div>

      {/* Save Success Dialog */}
      {isSavedDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm print:hidden animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 shadow-sm w-full max-w-md p-8 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-5 border border-green-100">
                <span aria-hidden="true" className="material-symbols-outlined text-green-600 text-3xl">check</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Facture Enregistrée</h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                La facture pour {order.client.firstName} {order.client.lastName} a été générée avec succès. Que souhaitez-vous faire ensuite ?
              </p>
              
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={handlePrint}
                  className="w-full py-3 px-4 bg-brand hover:bg-[#a07c4c] text-white font-medium transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">download</span>
                  Télécharger
                </button>
                <button
                  onClick={() => setIsSavedDialogOpen(false)}
                  className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium border border-gray-200 transition-colors text-sm"
                >
                  Retour à la facture
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Document - A4 Container */}
      <div className="bg-white border-0 sm:border sm:border-gray-100 sm:rounded-xl sm:shadow-sm overflow-x-auto print:border-none print:shadow-none print:bg-transparent print:overflow-visible">
        <div className="w-full min-w-[320px] max-w-[210mm] mx-auto p-8 sm:p-12 md:p-14 bg-white print:w-[210mm] print:mx-auto print:p-12 shrink-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-100 pb-8 mb-8">
          <div className="flex items-start gap-5">
            {settings.logoUrl && (
              <img src={settings.logoUrl} alt="Logo" className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded shrink-0 border border-gray-50" />
            )}
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-none">{settings.workshopName || "AZ-TAILOR"}</h1>
              <p className="text-gray-500 mt-2 text-xs sm:text-sm font-medium tracking-wide uppercase">{settings.slogan || "Atelier de Couture Sur-Mesure"}</p>
              <div className="flex flex-col text-gray-400 text-xs sm:text-sm mt-3 space-y-0.5">
                <p>{settings.address || "Dakar, Sénégal"}</p>
                <p>{settings.phone || "+221 77 123 45 67"}</p>
              </div>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <h2 className="text-2xl sm:text-3xl font-light text-gray-300 uppercase tracking-widest mb-3 leading-none">Facture</h2>
            <div className="bg-gray-50 px-4 py-2.5 rounded mt-1 inline-flex flex-col items-end border border-gray-100 text-right">
              <p className="text-xs sm:text-sm font-bold text-gray-900 tracking-wide">{order.reference}</p>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-1 font-medium">{invoiceDate}</p>
            </div>
          </div>
        </div>

        {/* Client & Order Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 mb-10">
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
            <h3 className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Facturé à</h3>
            <p className="text-base sm:text-lg font-bold text-gray-900 leading-tight">{order.client.firstName} {order.client.lastName}</p>
            <div className="mt-3 space-y-1">
              <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2"><span aria-hidden="true" className="material-symbols-outlined text-[16px] text-gray-400">call</span> {order.client.phone}</p>
              {order.client.address && (
                <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2"><span aria-hidden="true" className="material-symbols-outlined text-[16px] text-gray-400">location_on</span> {order.client.address}</p>
              )}
            </div>
          </div>
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
            <h3 className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Détails de la commande</h3>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <p className="flex justify-between items-center"><span className="text-gray-500">Modèle</span> <span className="font-semibold text-gray-900">{order.garmentType}</span></p>
              <p className="flex justify-between items-center"><span className="text-gray-500">Statut</span> <span className="font-semibold text-gray-900">{order.status.replace('_', ' ')}</span></p>
              <p className="flex justify-between items-center"><span className="text-gray-500">Livraison</span> <span className="font-semibold text-gray-900">{deliveryDate}</span></p>
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="mb-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100 text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">
                <th className="py-4 font-semibold">Description</th>
                <th className="py-4 text-right font-semibold">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="group hover:bg-gray-50 transition-colors">
                <td className="py-5 text-sm sm:text-base text-gray-900 font-medium">Confection - {order.garmentType}</td>
                <td className="py-5 text-sm sm:text-base text-gray-900 text-right font-bold">{new Intl.NumberFormat('fr-FR').format(order.totalPrice)} FCFA</td>
              </tr>
              {(order.fabricText || order.fabricPhotoUrl) && (
                <tr className="group hover:bg-gray-50 transition-colors">
                  <td className="py-5 text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                      {order.fabricPhotoUrl && (
                        <img src={order.fabricPhotoUrl} alt="Tissu" className="w-10 h-10 rounded object-cover border border-gray-200 shrink-0" />
                      )}
                      {order.fabricText && <span>Tissu: {order.fabricText}</span>}
                    </div>
                  </td>
                  <td className="py-5 text-sm text-gray-400 text-right">-</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-16">
          <div className="w-full sm:w-72 bg-gray-50 p-5 rounded-lg border border-gray-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-gray-900">{new Intl.NumberFormat('fr-FR').format(order.totalPrice)} FCFA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Avance payée</span>
              <span className="font-bold text-green-600">{new Intl.NumberFormat('fr-FR').format(order.totalPaid)} FCFA</span>
            </div>
            <div className="flex justify-between text-base sm:text-lg border-t border-gray-200 pt-3 mt-1">
              <span className="font-extrabold text-gray-900 uppercase text-sm self-center">Reste à payer</span>
              <span className="font-extrabold text-red-600">{new Intl.NumberFormat('fr-FR').format(order.balanceDue)} FCFA</span>
            </div>
          </div>
        </div>

        {/* Signature */}
        {order.clientSignature && (
          <div className="flex justify-start mb-16 mt-[-40px]">
            <div className="flex flex-col items-start bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Signature du client</span>
              <img src={order.clientSignature} alt="Signature" className="h-20 object-contain" />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-100 pt-8 text-center flex flex-col gap-3">
          <div className="w-12 h-1 bg-gray-200 mx-auto rounded-full mb-2"></div>
          <p className="text-xs text-gray-400 font-medium max-w-lg mx-auto leading-relaxed">
            Merci pour votre confiance. Toute commande non récupérée après 3 mois sera considérée comme abandonnée.
          </p>
        </div>

        </div>
      </div>
    </div>
  );
}
