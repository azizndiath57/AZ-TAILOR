"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import CustomSelect from "@/app/components/CustomSelect";
import PhoneInput from "@/app/components/PhoneInput";
import { getSettingsAction, updateSettingsAction, getRecoveryCodeAction } from "@/app/actions/settings";
import { getSubscriptionStatus } from "@/app/actions/subscription";
import { createCheckoutSession, createCustomerPortalSession } from "@/app/actions/stripe";
import { createPayTechCheckoutSession } from "@/app/actions/paytech";
import { createClient } from "@/utils/supabase/client";
import ConfirmDialog from "@/app/components/ConfirmDialog";
import { useTranslations } from "next-intl";

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
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);

  const [subscription, setSubscription] = useState<import('@/app/actions/subscription').SubscriptionStatus>({ plan: 'free', isActive: false, isTrialExpired: false, trialDaysLeft: 0, endDate: null });
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  const [isMobileMoneyLoading, setIsMobileMoneyLoading] = useState(false);

  const [isPayTechConfirmOpen, setIsPayTechConfirmOpen] = useState(false);
  const [payTechError, setPayTechError] = useState<string | null>(null);

  const t = useTranslations("Settings");
  const tProfile = useTranslations("Settings.Profile");
  const tSub = useTranslations("Settings.Subscription");
  const tPref = useTranslations("Settings.Preferences");
  const tSec = useTranslations("Settings.Security");
  const tModals = useTranslations("Settings.Modals");

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
    getRecoveryCodeAction().then(code => {
      if (code) setRecoveryCode(code);
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

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    setPasswordUpdateStatus("loading");

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      console.error("Erreur de mise à jour du mot de passe:", error.message);
      alert("Erreur: " + error.message);
      setPasswordUpdateStatus("idle");
      return;
    }

    setPasswordUpdateStatus("success");
    setCurrentPassword("");
    setNewPassword("");

    // Clear success message after 3 seconds
    setTimeout(() => setPasswordUpdateStatus("idle"), 3000);
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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-800">{t("title")}</h2>
          <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

        {/* Sidebar Nav (Settings specific) */}
        <div className="md:col-span-4 lg:col-span-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          <nav className="flex flex-row md:flex-col gap-2 min-w-max md:min-w-0">
            <button
              onClick={() => setActiveTab("profil")}
              className={`flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 font-medium rounded-lg transition-colors text-left ${activeTab === "profil"
                  ? "text-brand bg-brand-light/50 md:bg-brand-light md:border-l-4 md:border-transparent md:!border-brand"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 md:border-l-4 md:border-transparent"
                }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">storefront</span>
              {t("tabs.profile")}
            </button>
            <button
              onClick={() => setActiveTab("abonnement")}
              className={`flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 font-medium rounded-lg transition-colors text-left ${activeTab === "abonnement"
                  ? "text-brand bg-brand-light/50 md:bg-brand-light md:border-l-4 md:border-transparent md:!border-brand"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 md:border-l-4 md:border-transparent"
                }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">workspace_premium</span>
              {t("tabs.subscription")}
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 font-medium rounded-lg transition-colors text-left ${activeTab === "preferences"
                  ? "text-brand bg-brand-light/50 md:bg-brand-light md:border-l-4 md:border-transparent md:!border-brand"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 md:border-l-4 md:border-transparent"
                }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">tune</span>
              {t("tabs.preferences")}
            </button>
            <button
              onClick={() => setActiveTab("securite")}
              className={`flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 font-medium rounded-lg transition-colors text-left ${activeTab === "securite"
                  ? "text-brand bg-brand-light/50 md:bg-brand-light md:border-l-4 md:border-transparent md:!border-brand"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 md:border-l-4 md:border-transparent"
                }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">security</span>
              {t("tabs.security")}
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="md:col-span-8 lg:col-span-7 flex flex-col gap-6">

          {activeTab === "profil" && (
            <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">{tProfile("title")}</h3>

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
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
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
                        {tProfile("changeLogo")}
                      </button>
                      {logoUrl && (
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="px-4 py-2 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors shadow-sm"
                        >
                          {tProfile("removeLogo")}
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{tProfile("logoHint")}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{tProfile("workshopName")}</label>
                    <input
                      type="text"
                      name="workshopName"
                      defaultValue={settings.workshopName}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{tProfile("slogan")}</label>
                    <input
                      type="text"
                      name="slogan"
                      placeholder={tProfile("sloganPlaceholder")}
                      defaultValue={settings.slogan || ""}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{tProfile("address")}</label>
                    <input
                      type="text"
                      name="address"
                      defaultValue={settings.address}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{tProfile("phone")}</label>
                    <PhoneInput defaultValue={settings.phone} name="phone" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{tProfile("currency")}</label>
                    <CustomSelect
                      defaultValue="XOF"
                      options={[
                        { value: "XOF", label: tProfile("currencies.xof"), icon: "payments" },
                        { value: "EUR", label: tProfile("currencies.eur"), icon: "euro" },
                        { value: "USD", label: tProfile("currencies.usd"), icon: "attach_money" }
                      ]}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
                  {profileUpdateStatus === "success" && (
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1 animate-in fade-in">
                      <span aria-hidden="true" className="material-symbols-outlined text-lg">check_circle</span>
                      {tProfile("updated")}
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={profileUpdateStatus === "loading"}
                    className="flex items-center gap-2 px-6 py-2.5 bg-midnight text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {profileUpdateStatus === "loading" && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
                    {tProfile("save")}
                  </button>
                </div>
              </form>
            </section>
          )}

          {activeTab === "abonnement" && (
            <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">{tSub("title")}</h3>

              <div className="space-y-6">
                <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-white border border-gray-200 text-gray-700 font-medium text-xs rounded-full uppercase tracking-wider mb-2">
                        {subscription.plan === 'pro' ? tSub("planPro") : tSub("planFree")}
                      </span>
                      <h4 className="text-xl font-bold text-gray-900">
                        {subscription.plan === 'pro' ? tSub("titlePro") : tSub("titleFree")}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {subscription.plan === 'pro'
                          ? tSub("descPro")
                          : tSub("descFree")}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {subscription.plan === 'pro' ? '4 000' : '0'} <span className="text-sm text-gray-500 font-normal">{tSub("perMonth")}</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                      {subscription.plan === 'pro' ? tSub("features.unlimited") : tSub("features.limited")}
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                      {tSub("features.logo")}
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                      {tSub("features.stats")}
                    </li>
                    {subscription.plan !== 'pro' && (
                      <li className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="material-symbols-outlined text-gray-300 text-lg">cancel</span>
                        {tSub("features.darkMode")}
                      </li>
                    )}
                  </ul>

                  {subscription.plan === 'pro' ? (
                    <button
                      onClick={async () => {
                        setIsStripeLoading(true);
                        try {
                          const res = await createCustomerPortalSession();
                          if (res?.error) {
                            setPayTechError(res.error);
                            setIsStripeLoading(false);
                          } else if (res?.url) {
                            window.location.href = res.url;
                          }
                        } catch (err: any) {
                          setPayTechError(err.message);
                          setIsStripeLoading(false);
                        }
                      }}
                      disabled={isStripeLoading}
                      className="w-full py-2.5 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isStripeLoading && <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></span>}
                      {tSub("manage")}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 font-medium mb-1">{tSub("choosePayment")}</p>

                      <button
                        type="button"
                        onClick={() => setIsPayTechConfirmOpen(true)}
                        disabled={isMobileMoneyLoading || isStripeLoading}
                        className="w-full py-2.5 px-4 bg-[#00a650] text-white font-medium rounded-lg hover:bg-[#00a650]/90 transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
                      >
                        {isMobileMoneyLoading && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
                        {tSub("payTech")}
                      </button>

                      <button
                        onClick={async () => {
                          setIsStripeLoading(true);
                          try {
                            const res = await createCheckoutSession();
                            if (res?.error) {
                              setPayTechError(res.error);
                              setIsStripeLoading(false);
                            } else if (res?.url) {
                              window.location.href = res.url;
                            }
                          } catch (err: any) {
                            setPayTechError(err.message);
                            setIsStripeLoading(false);
                          }
                        }}
                        disabled={isStripeLoading || isMobileMoneyLoading}
                        className="w-full py-2.5 px-4 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
                      >
                        {isStripeLoading && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
                        {tSub("stripe")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {activeTab === "preferences" && (
            <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">{tPref("title")}</h3>

              <form onSubmit={handleUpdatePreferences} className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">{tPref("notifications")}</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand" />
                      <span className="text-sm text-gray-700">{tPref("alertDelivery")}</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand" />
                      <span className="text-sm text-gray-700">{tPref("alertFitting")}</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">{tPref("theme")}</h4>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="theme" value="light" defaultChecked className="w-4 h-4 text-brand bg-gray-100 border-gray-300 focus:ring-brand" />
                      <span className="text-sm text-gray-700">{tPref("light")}</span>
                    </label>
                    <div className="flex items-center gap-2 cursor-not-allowed group">
                      <input type="radio" name="theme" value="dark" disabled className="w-4 h-4 text-brand bg-gray-100 border-gray-300 focus:ring-brand opacity-50 cursor-not-allowed" />
                      <span className="text-sm text-gray-500">{tPref("dark")}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider border border-amber-200" title={tPref("premiumTitle")}>
                        {tPref("premium")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
                  {preferencesUpdateStatus === "success" && (
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1 animate-in fade-in">
                      <span aria-hidden="true" className="material-symbols-outlined text-lg">check_circle</span>
                      {tPref("saved")}
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={preferencesUpdateStatus === "loading"}
                    className="flex items-center gap-2 px-6 py-2.5 bg-midnight text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {preferencesUpdateStatus === "loading" && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
                    {tPref("save")}
                  </button>
                </div>
              </form>
            </section>
          )}

          {activeTab === "securite" && (
            <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-2">{tSec("title")}</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">{tSec("changePassword")}</h4>
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{tSec("currentPassword")}</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">{tSec("newPassword")}</label>
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
                        className="px-6 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand/90 transition-colors shadow-sm disabled:opacity-50"
                      >
                        {passwordUpdateStatus === "loading" ? tSec("saving") : tSec("updatePassword")}
                      </button>
                      {passwordUpdateStatus === "success" && (
                        <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span>
                          {tSec("successMessage")}
                        </span>
                      )}
                    </div>
                  </form>
                </div>

                {/* Code de récupération */}
                <div className="pt-6 mt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Code de récupération</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Ce code vous permet de réinitialiser votre mot de passe en cas d'oubli. Conservez-le précieusement.
                  </p>
                  <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg">
                    <span className="material-symbols-outlined text-gray-400">key</span>
                    <span className="font-mono text-xl font-bold tracking-widest text-gray-800">
                      {recoveryCode || "------"}
                    </span>
                  </div>
                </div>


                <div className="pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-red-600 mb-3">{tSec("dangerZone")}</h4>
                  <p className="text-sm text-gray-500 mb-4">{tSec("dangerDesc")}</p>
                  <button
                    type="button"
                    onClick={() => setIsDeleteAccountModalOpen(true)}
                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                  >
                    {tSec("deleteAccount")}
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tModals("deleteTitle")}</h3>
              <p className="text-sm text-gray-500 mb-6">
                {tModals("deleteDesc")}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsDeleteAccountModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {tModals("cancel")}
                </button>
                <button
                  onClick={() => {
                    setIsDeleteAccountModalOpen(false);
                    alert("Compte supprimé (simulation) !");
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  {tModals("confirmDelete")}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* PayTech Confirmation Modal */}
      {mounted && createPortal(
        <>
          <ConfirmDialog
            isOpen={isPayTechConfirmOpen}
            title={tModals("payTechTitle")}
            message={tModals("payTechDesc")}
            confirmText={tModals("payTechConfirm")}
            cancelText={tModals("payTechCancel")}
            onConfirm={async () => {
              setIsPayTechConfirmOpen(false);
              setIsMobileMoneyLoading(true);
              try {
                const res = await createPayTechCheckoutSession();
                if (res?.error) {
                  setPayTechError(res.error);
                  setIsMobileMoneyLoading(false);
                } else if (res?.url) {
                  window.location.href = res.url;
                }
              } catch (error: any) {
                setPayTechError(error.message);
                setIsMobileMoneyLoading(false);
              }
            }}
            onCancel={() => setIsPayTechConfirmOpen(false)}
          />

          <ConfirmDialog
            isOpen={!!payTechError}
            title={tModals("errorTitle")}
            message={payTechError || ""}
            confirmText="OK"
            cancelText={tModals("close")}
            type="danger"
            onConfirm={() => setPayTechError(null)}
            onCancel={() => setPayTechError(null)}
          />
        </>,
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
