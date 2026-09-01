"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { OrderWithFinancials } from "@/lib/data-access/types";
import { PaymentMethod, PAYMENT_METHODS } from "@/lib/constants/payment-methods";
import SignaturePad from "@/app/components/SignaturePad";

export default function PaymentClient({ order }: { order: OrderWithFinancials }) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("cash");
  const [amount, setAmount] = useState<string>("");
  const [signature, setSignature] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureKey, setSignatureKey] = useState(0);

  const hasInput = amount.trim() !== "" || signature !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulating API call to process payment
    setTimeout(() => {
      // Logic to actually add payment would go here, maybe a server action
      console.log("Processing payment...", {
        orderId: order.id,
        amount: Number(amount),
        method: selectedMethod,
        signature
      });
      setIsSubmitting(false);
      // Redirect to invoice after successful payment
      router.push(`/orders/${order.id}/invoice`);
    }, 800);
  };

  const handleCancel = () => {
    setAmount("");
    setSignature(null);
    setSelectedMethod("cash");
    setSignatureKey(prev => prev + 1);
  };

  const getMethodIcon = (method: string) => {
    switch(method) {
      case "cash": return "payments";
      case "wave": return "waves";
      case "orange_money": return "phone_iphone";
      case "virement": return "account_balance";
      default: return "credit_card";
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/orders" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <span aria-hidden="true" className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-800">Paiement</h2>
          <p className="text-sm text-gray-500 mt-1">
            Commande {order.reference} • Client : {order.client.firstName} {order.client.lastName}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 space-y-8">
        {/* Financial Summary */}
        <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-8">
          <div className="space-y-1">
            <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">Total Commande</span>
            <div className="text-xl font-semibold text-gray-900">{new Intl.NumberFormat('fr-FR').format(order.totalPrice)} FCFA</div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">Avance Payée</span>
            <div className="text-xl font-semibold text-green-600">{new Intl.NumberFormat('fr-FR').format(order.totalPaid)} FCFA</div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">Reste à Payer</span>
            <div className="text-xl font-semibold text-red-600">{new Intl.NumberFormat('fr-FR').format(order.balanceDue)} FCFA</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Method Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Moyen de paiement</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-brand bg-orange-50 text-brand shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <span aria-hidden="true" className={`material-symbols-outlined text-3xl mb-2 ${isSelected ? "text-brand" : "text-gray-400"}`}>
                      {getMethodIcon(method.id)}
                    </span>
                    <span className="text-sm font-semibold">{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount to pay */}
          <div className="space-y-2 max-w-sm">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Montant à encaisser (FCFA)</label>
            <div className="relative">
              <input
                id="amount"
                type="number"
                required
                min="1"
                max={order.balanceDue > 0 ? order.balanceDue : undefined}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={order.balanceDue.toString()}
                className="w-full px-4 py-3 bg-white border border-gray-900 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand transition-all font-semibold text-lg placeholder:text-gray-300"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">FCFA</span>
            </div>
            {Number(amount) > order.balanceDue && (
              <p className="text-sm text-amber-600 flex items-center gap-1 mt-1">
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">warning</span>
                Le montant dépasse le reste à payer.
              </p>
            )}
          </div>

          {/* Signature Zone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Signature du client (Optionnelle)</label>
            <SignaturePad key={signatureKey} onSignatureChange={setSignature} />
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={!hasInput || isSubmitting}
              className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !hasInput || Number(amount) <= 0}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-midnight rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">check_circle</span>
              )}
              Valider l'encaissement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
