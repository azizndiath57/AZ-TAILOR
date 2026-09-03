"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { deleteClientAction } from "./actions";

export default function ClientActionsDropdown({ clientId }: { clientId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    await deleteClientAction(clientId);
    setIsDeleting(false);
    setShowConfirm(false);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <span className="material-symbols-outlined text-xl">more_vert</span>
      </button>

      {isOpen && (
        <>
          {/* Desktop Dropdown */}
          <div className="hidden lg:block absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-1" onClick={(e) => e.preventDefault()}>
            <Link
              href={`/clients/${clientId}`}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="material-symbols-outlined text-[18px]">straighten</span>
              Voir / Mesures
            </Link>
            <Link
              href={`/clients/${clientId}/edit`}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Modifier
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
                setShowConfirm(true);
              }}
              disabled={isDeleting}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              {isDeleting ? "Suppression..." : "Supprimer"}
            </button>
          </div>

          {/* Mobile Bottom Sheet Portal */}
          {typeof document !== 'undefined' && createPortal(
            <div className="lg:hidden fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)}>
              <div className="bg-white w-full rounded-t-2xl p-4 pb-safe animate-slide-up shadow-2xl border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-5" />
                <h3 className="font-semibold text-gray-900 px-4 mb-3 text-lg">Actions Client</h3>
                <div className="flex flex-col gap-1">
                  <Link
                    href={`/clients/${clientId}`}
                    className="flex items-center gap-3 px-4 py-3.5 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="material-symbols-outlined text-[22px]">straighten</span>
                    Voir / Mesures
                  </Link>
                  <Link
                    href={`/clients/${clientId}/edit`}
                    className="flex items-center gap-3 px-4 py-3.5 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="material-symbols-outlined text-[22px]">edit</span>
                    Modifier
                  </Link>
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
                    <span className="material-symbols-outlined text-[22px]">delete</span>
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
              <h3 className="text-lg font-semibold text-gray-900">Supprimer le client</h3>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible et toutes les données associées seront perdues.
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
