"use client";

import { useState, useEffect, useRef } from "react";
import { AppNotification } from "@/lib/data-access/types";
import { getNotificationsAction, markAsReadAction, markAllAsReadAction, clearAllNotificationsAction } from "@/app/actions/notifications";
import { createPortal } from "react-dom";

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);

  const fetchNotifications = async () => {
    const data = await getNotificationsAction();
    setNotifications(data);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30s
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        setDropdownStyle({
          top: rect.bottom + 8,
          right: 16,
          left: 16,
          maxHeight: 'calc(100vh - 100px)'
        });
      } else {
        const dropdownWidth = 320;
        // Si le menu dépasse de l'écran (ex: dans le header à droite), on l'ouvre vers le bas à gauche
        if (rect.right + 12 + dropdownWidth > window.innerWidth) {
          setDropdownStyle({
            top: rect.bottom + 8,
            right: window.innerWidth - rect.right,
            width: dropdownWidth,
            maxHeight: 'calc(100vh - 100px)'
          });
        } else {
          // Sinon on l'ouvre sur le côté droit (ex: dans la sidebar à gauche)
          // Comme le bouton est en bas de l'écran, on aligne le bas du menu avec le bas du bouton
          setDropdownStyle({
            bottom: window.innerHeight - rect.bottom,
            left: rect.right + 12,
            width: dropdownWidth,
            maxHeight: 'calc(100vh - 40px)'
          });
        }
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen && 
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);



  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsReadAction(id);
    await fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsReadAction();
    await fetchNotifications();
  };

  const handleClearAll = async () => {
    await clearAllNotificationsAction();
    await fetchNotifications();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "info": return <span className="material-symbols-outlined text-blue-500">info</span>;
      case "warning": return <span className="material-symbols-outlined text-amber-500">warning</span>;
      case "success": return <span className="material-symbols-outlined text-green-500">check_circle</span>;
      default: return <span className="material-symbols-outlined text-gray-500">notifications</span>;
    }
  };

  const dropdownContent = isOpen ? (
    <div 
      ref={dropdownRef}
      style={dropdownStyle}
      className="fixed z-[100] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-left-2 md:slide-in-from-left-4 duration-200"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button onClick={handleMarkAllAsRead} className="text-xs font-medium text-brand hover:underline" title="Tout marquer comme lu">
              <span className="material-symbols-outlined text-[16px]">done_all</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={handleClearAll} className="text-xs font-medium text-red-500 hover:underline" title="Tout effacer">
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
            </button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: 'inherit' }}>
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-4xl opacity-20">notifications_off</span>
            <p className="text-sm">Aucune notification</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`p-4 hover:bg-gray-50 transition-colors flex gap-3 relative ${!notif.isRead ? 'bg-brand/5' : ''}`}
              >
                <div className="shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <p className={`text-sm font-medium truncate ${notif.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                    {notif.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5 break-words">
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(notif.createdAt))}
                  </p>
                </div>
                {!notif.isRead && (
                  <button 
                    onClick={(e) => handleMarkAsRead(notif.id, e)}
                    className="absolute right-4 top-4 text-brand p-1 hover:bg-brand/10 rounded-full transition-colors"
                    title="Marquer comme lu"
                  >
                    <span className="w-2 h-2 rounded-full bg-brand block"></span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button 
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
      >
        <span aria-hidden="true" className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white pointer-events-none"></span>
        )}
      </button>

      {mounted && createPortal(dropdownContent, document.body)}
    </>
  );
}
