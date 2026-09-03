"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import CustomSelect from "@/app/components/CustomSelect";
import PhoneInput from "@/app/components/PhoneInput";
import { getSettingsAction, updateSettingsAction } from "@/app/actions/settings";
import { getSubscriptionStatus } from "@/app/actions/subscription";
import { createCheckoutSession, createCustomerPortalSession } from "@/app/actions/stripe";
import { createFedaPayCheckoutSession } from "@/app/actions/fedapay";

type Tab = "profil" | "abonnement" | "preferences" | "securite";

function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) || "profil";
  
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordUpdateStatus, setPasswordUpdateStatus] = useState<"idle" | "loading" | "success">("idle");
  
  const [preferencesUpdateStatus, setPreferencesUpdateStatus] = useState<"idle" | "loading" | "success">("idle");
  const [profileUpdateStatus, setProfileUpdateStatus] = useState<"idle" | "loading" | "success">("idle");
  const [settings, setSettings] = useState<any>({ workshopName: "AZ-TAILOR", address: "Dakar, Sénégal", phone: "+221 77 123 45 67" });
  
  const [subscription, setSubscription] = useState<{plan: string, isActive: boolean, endDate?: string}>({ plan: 'free', isActive: false });
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  const [isMobileMoneyLoading, setIsMobileMoneyLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    getSettingsAction().then(data => {
      if (data) {
        setSettings(data);
        if (data.logoUrl) setLogoUrl(data.logoUrl);
      }
    });
    getSubscriptionStatus().then(data => {
      setSubscription(data);
    });
  }, []);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    
    setPasswordUpdateStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      setPasswordUpdateStatus("success");
      setCurrentPassword("");
      setNewPassword("");
      
      // Clear success message after 3 seconds
      setTimeout(() => setPasswordUpdateStatus("idle"), 3000);
    }, 1000);
  };

  const handleUpdatePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setPreferencesUpdateStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      setPreferencesUpdateStatus("success");
      setTimeout(() => setPreferencesUpdateStatus("idle"), 3000);
    }, 1000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileUpdateStatus("loading");
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      workshopName: formData.get("workshopName"),
      slogan: formData.get("slogan"),
      address: formData.get("address"),
      phone: formData.get("phone"),
      logoUrl: logoUrl,
    };
    
    await updateSettingsAction(data);
    
    setProfileUpdateStatus("success");
    setTimeout(() => setProfileUpdateStatus("idle"), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-800">Paramètres</h2>
          <p className="text-sm text-gray-500 mt-1">Gérez les informations et préférences de votre atelier</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Sidebar Nav (Settings specific) */}
        <div className="md:col-span-4">
          <nav className="flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab("profil")}
              className={`flex items-center gap-3 px-4 py-3 font-medium rounded-r-lg transition-colors text-left ${
                activeTab === "profil" 
                  ? "text-brand bg-brand-light border-l-4 border-brand" 
                  : "text-gray-600 border-l-4 border-transparent hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">storefront</span>
              Profil de l'Atelier
            </button>
            <button 
              onClick={() => setActiveTab("abonnement")}
              className={`flex items-center gap-3 px-4 py-3 font-medium rounded-r-lg transition-colors text-left ${
                activeTab === "abonnement" 
                  ? "text-brand bg-brand-light border-l-4 border-brand" 
                  : "text-gray-600 border-l-4 border-transparent hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">workspace_premium</span>
              Abonnement
            </button>
            <button 
              onClick={() => setActiveTab("preferences")}
              className={`flex items-center gap-3 px-4 py-3 font-medium rounded-r-lg transition-colors text-left ${
                activeTab === "preferences" 
                  ? "text-brand bg-brand-light border-l-4 border-brand" 
                  : "text-gray-600 border-l-4 border-transparent hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">tune</span>
              Préférences
            </button>
            <button 
              onClick={() => setActiveTab("securite")}
              className={`flex items-center gap-3 px-4 py-3 font-medium rounded-r-lg transition-colors text-left ${
                activeTab === "securite" 
                  ? "text-brand bg-brand-light border-l-4 border-brand" 
                  : "text-gray-600 border-l-4 border-transparent hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">security</span>
              Sécurité
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="md:col-span-8 flex flex-col gap-6">
          
          {activeTab === "profil" && (
            <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">Informations de l'Atelier</h3>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Logo / Image */}
                <div className="flex items-center gap-6">
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/gif" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                  <div 
                    onClick={handleLogoClick}
                    className="w-24 h-24 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 cursor-pointer overflow-hidden hover:bg-gray-200 transition-colors relative group"
                  >
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo de l'atelier" className="w-full h-full object-cover" />
                    ) : (
                      <span aria-hidden="true" className="material-symbols-outlined text-3xl">add_a_photo</span>
                    )}
                    {logoUrl && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span aria-hidden="true" className="material-symbols-outlined text-white">edit</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <button 
                        type="button" 
                        onClick={handleLogoClick}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        Changer le logo
                      </button>
                      {logoUrl && (
                        <button 
                          type="button" 
                          onClick={handleRemoveLogo}
                          className="px-4 py-2 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors shadow-sm"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">JPG, PNG ou GIF. 1MB max.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'atelier</label>
                    <input 
                      type="text" 
                      name="workshopName"
                      defaultValue={settings.workshopName}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" 
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
                    <input 
                      type="text" 
                      name="slogan"
                      placeholder="Ex: L'élégance sur-mesure"
                      defaultValue={settings.slogan || ""}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" 
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input 
                      type="text" 
                      name="address"
                      defaultValue={settings.address}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone Principal</label>
                    <PhoneInput defaultValue={settings.phone} name="phone" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Devise par défaut</label>
                    <CustomSelect 
                      defaultValue="XOF"
                      options={[
                        { value: "XOF", label: "Franc CFA (XOF)", icon: "payments" },
                        { value: "EUR", label: "Euro (€)", icon: "euro" },
                        { value: "USD", label: "Dollar ($)", icon: "attach_money" }
                      ]}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
                  {profileUpdateStatus === "success" && (
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1 animate-in fade-in">
                      <span aria-hidden="true" className="material-symbols-outlined text-lg">check_circle</span>
                      Profil mis à jour !
                    </span>
                  )}
                  <button 
                    type="submit" 
                    disabled={profileUpdateStatus === "loading"}
                    className="flex items-center gap-2 px-6 py-2.5 bg-midnight text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {profileUpdateStatus === "loading" && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </section>
          )}

          {activeTab === "abonnement" && (
            <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">Mon Abonnement</h3>
              
              <div className="space-y-6">
                <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-white border border-gray-200 text-gray-700 font-medium text-xs rounded-full uppercase tracking-wider mb-2">
                        {subscription.plan === 'pro' ? 'Plan Pro' : 'Plan Gratuit'}
                      </span>
                      <h4 className="text-xl font-bold text-gray-900">
                        {subscription.plan === 'pro' ? 'AZ-TAILOR Pro' : 'AZ-TAILOR Débutant'}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {subscription.plan === 'pro' 
                          ? 'Vous profitez de toutes les fonctionnalités.' 
                          : 'Vous êtes limité à 20 clients.'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {subscription.plan === 'pro' ? '5 000' : '0'} <span className="text-sm text-gray-500 font-normal">FCFA / mois</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                      {subscription.plan === 'pro' ? 'Clients illimités' : 'Jusqu\'à 20 clients'}
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                      Logo sur vos factures
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                      Statistiques de base
                    </li>
                    {subscription.plan !== 'pro' && (
                      <li className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="material-symbols-outlined text-gray-300 text-lg">cancel</span>
                        Mode sombre (Premium)
                      </li>
                    )}
                  </ul>

                  {subscription.plan === 'pro' ? (
                    <button 
                      onClick={async () => {
                        setIsStripeLoading(true);
                        await createCustomerPortalSession();
                      }}
                      disabled={isStripeLoading}
                      className="w-full py-2.5 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isStripeLoading && <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></span>}
                      Gérer mon abonnement
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 font-medium mb-1">Choisissez votre moyen de paiement :</p>
                      
                      {/* Bouton FedaPay Mobile Money */}
                      <button 
                        onClick={async () => {
                          setIsMobileMoneyLoading(true);
                          await createFedaPayCheckoutSession();
                        }}
                        disabled={isMobileMoneyLoading || isStripeLoading}
                        className="w-full py-2.5 px-4 bg-[#1b4bff] text-white font-medium rounded-lg hover:bg-[#1b4bff]/90 transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
                      >
                        {isMobileMoneyLoading && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
                        S'abonner par Mobile Money
                      </button>

                      {/* Bouton Stripe (Carte Bancaire) */}
                      <button 
                        onClick={async () => {
                          setIsStripeLoading(true);
                          await createCheckoutSession();
                        }}
                        disabled={isStripeLoading || isMobileMoneyLoading}
                        className="w-full py-2.5 px-4 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
                      >
                        {isStripeLoading && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
                        S'abonner par Carte Bancaire
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {activeTab === "preferences" && (
            <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">Préférences</h3>
              
              <form onSubmit={handleUpdatePreferences} className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Notifications</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand" />
                      <span className="text-sm text-gray-700">M'alerter 2 jours avant une livraison</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand" />
                      <span className="text-sm text-gray-700">M'alerter pour les essayages (fittings)</span>
                    </label>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Thème</h4>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="theme" value="light" defaultChecked className="w-4 h-4 text-brand bg-gray-100 border-gray-300 focus:ring-brand" />
                      <span className="text-sm text-gray-700">Clair</span>
                    </label>
                    <div className="flex items-center gap-2 cursor-not-allowed group">
                      <input type="radio" name="theme" value="dark" disabled className="w-4 h-4 text-brand bg-gray-100 border-gray-300 focus:ring-brand opacity-50 cursor-not-allowed" />
                      <span className="text-sm text-gray-500">Sombre</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider border border-amber-200" title="Cette fonctionnalité nécessite un abonnement">
                        Payant
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
                  {preferencesUpdateStatus === "success" && (
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1 animate-in fade-in">
                      <span aria-hidden="true" className="material-symbols-outlined text-lg">check_circle</span>
                      Préférences sauvegardées !
                    </span>
                  )}
                  <button 
                    type="submit" 
                    disabled={preferencesUpdateStatus === "loading"}
                    className="flex items-center gap-2 px-6 py-2.5 bg-midnight text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {preferencesUpdateStatus === "loading" && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
                    Sauvegarder
                  </button>
                </div>
              </form>
            </section>
          )}

          {activeTab === "securite" && (
            <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">Sécurité & Compte</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Changer le mot de passe</h4>
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                      <input 
                        type="password" 
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full md:w-2/3 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                      <input 
                        type="password" 
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full md:w-2/3 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" 
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        type="submit" 
                        disabled={passwordUpdateStatus === "loading"}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {passwordUpdateStatus === "loading" && <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></span>}
                        Mettre à jour le mot de passe
                      </button>
                      {passwordUpdateStatus === "success" && (
                        <span className="text-sm text-green-600 font-medium flex items-center gap-1 animate-in fade-in">
                          <span aria-hidden="true" className="material-symbols-outlined text-lg">check_circle</span>
                          Mis à jour !
                        </span>
                      )}
                    </div>
                  </form>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-red-600 mb-3">Zone de danger</h4>
                  <p className="text-sm text-gray-500 mb-4">Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière possible. Soyez certain de votre choix.</p>
                  <button 
                    type="button" 
                    onClick={() => setIsDeleteAccountModalOpen(true)}
                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Supprimer mon compte
                  </button>
                </div>
              </div>
            </section>
          )}

        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {mounted && isDeleteAccountModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Supprimer le compte</h3>
              <p className="text-sm text-gray-500 mb-6">
                Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible et effacera toutes vos données (clients, commandes, paiements).
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsDeleteAccountModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    setIsDeleteAccountModalOpen(false);
                    alert("Compte supprimé (simulation) !");
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  Oui, supprimer mon compte
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Chargement des paramètres...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
