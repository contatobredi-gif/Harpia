import React from 'react';
import { X, CheckCheck, Bell, AlertCircle, Info, Sparkles } from 'lucide-react';
import { NotificationItem, Municipality } from '../types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectMunicipalityById: (id: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectMunicipalityById,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.lida).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#050B1E]/60 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-[#0A1329] border-l border-[#16264C] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#16264C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#00DDF2]" />
            <h2 className="text-sm font-semibold text-white">Notificações & Sinais</h2>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono-numbers bg-[#00DDF2] text-[#050B1E] font-bold rounded">
                {unreadCount} nova{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-[11px] text-[#00DDF2] hover:underline flex items-center gap-1 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Marcar todas
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#0F1C3C]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              Nenhuma notificação no momento.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.municipioId) {
                    onSelectMunicipalityById(item.municipioId);
                    onClose();
                  }
                }}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  !item.lida
                    ? 'bg-[#0F1C3C]/80 border-[#00DDF2]/30 shadow-[0_0_12px_rgba(0,221,242,0.06)]'
                    : 'bg-[#070F26] border-[#16264C]/60 hover:border-[#16264C]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    {item.tipo === 'alerta' ? (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : item.tipo === 'oportunidade' ? (
                      <Sparkles className="w-3.5 h-3.5 text-[#00DDF2] shrink-0" />
                    ) : (
                      <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                    <h3 className={`text-xs font-semibold ${!item.lida ? 'text-white' : 'text-slate-300'}`}>
                      {item.titulo}
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{item.data}</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed pl-5">
                  {item.mensagem}
                </p>

                {item.municipioId && (
                  <div className="mt-2 pl-5">
                    <span className="text-[10px] text-[#00DDF2] font-medium hover:underline">
                      Ver Ficha Municipal →
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#16264C] bg-[#070F26] text-[11px] text-slate-400 text-center">
          Monitoramento de Diários Oficiais e PNCP ativo 24/7.
        </div>
      </div>
    </div>
  );
};
