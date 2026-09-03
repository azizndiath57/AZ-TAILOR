"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { deleteOrderAction } from "./actions";

export default function OrderActionsDropdown({ orderId }: { orderId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteOrderAction(orderId);
    setShowConfirm(false);
    setIsOpen(false);
    setIsDeleting(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand"
      >
        <span aria-hidden="true" className="material-symbols-outlined text-[20px]">more_vert</span>
      </button>

      {isOpen && (
        <>
          {/* Desktop Dropdown */}
          <div className="hidden lg:block absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1 overflow-hidden">
            <Link 
              href="/orders/new" 
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition-colors"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">add</span>
              Créer
            </Link>
            <Link 
              href={`/orders/${orderId}/edit`} 
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition-colors"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">edit</span>
              Modifier
            </Link>
            <Link 
              href={`/orders/${orderId}/invoice`} 
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition-colors"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">receipt_long</span>
              Facture
            </Link>
            <Link 
              href={`/orders/${orderId}/payment`} 
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition-colors"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">payments</span>
              Paiement
            </Link>
            <div className="h-px bg-gray-100 my-1"></div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
                setShowConfirm(true);
              }}
              disabled={isDeleting}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 text-left"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">delete</span>
              {isDeleting ? "Suppression..." : "Supprimer"}
            </button>
          </div>

          {/* Mobile Bottom Sheet Portal */}
          {typeof document !== 'undefined' && createPortal(
            <div className="lg:hidden fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)}>
              <div className="bg-white w-full rounded-t-2xl p-4 pb-8 animate-slide-up shadow-2xl border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-5" />
                <h3 className="font-semibold text-gray-900 px-4 mb-3 text-lg">Actions Commande</h3>
                <div className="flex flex-col gap-1">
                  <Link 
                    href="/orders/new" 
                    className="flex items-center gap-3 px-4 py-3.5 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[22px]">add</span>
                    Créer
                  </Link>
                  <Link 
                    href={`/orders/${orderId}/edit`} 
                    className="flex items-center gap-3 px-4 py-3.5 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[22px]">edit</span>
                    Modifier
                  </Link>
                  <Link 
                    href={`/orders/${orderId}/invoice`} 
                    className="flex items-center gap-3 px-4 py-3.5 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[22px]">receipt_long</span>
                    Facture
                  </Link>
                  <Link 
                    href={`/orders/${orderId}/payment`} 
                    className="flex items-center gap-3 px-4 py-3.5 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[22px]">payments</span>
                    Paiement
                  </Link>
                  <div className="h-px bg-gray-100 my-2 mx-4"></div>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsOpen(false);
                      setShowConfirm(true);
                    }}
                    disabled={isDeleting}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[22px]">delete</span>
                    {isDeleting ? "Suppression..." : "Supprimer"}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
        </>
      )}

      {showConfirm && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 transform transition-all" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-4 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Supprimer la commande</h3>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible et toutes les données associées seront perdues.
            </p>
            
            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowConfirm(false);
                }}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Annuler
              </button>
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {isDeleting && <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>}
                {isDeleting ? "Suppression..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
