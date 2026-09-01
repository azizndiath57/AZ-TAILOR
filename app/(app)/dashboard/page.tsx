import Link from "next/link";
import { DashboardRepository, OrdersRepository, SettingsRepository } from "@/lib/data-access";
import GlobalSearch from "@/app/components/GlobalSearch";
import NotificationsDropdown from "@/app/components/NotificationsDropdown";
import { updateOrderStatusAction } from "@/app/(app)/orders/actions";
import DashboardDateFilter from "@/app/components/DashboardDateFilter";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { from, to } = await searchParams;
  
  const stats = await DashboardRepository.getStats(from, to);
  const allOrders = await OrdersRepository.getOrders();
  const settings = await SettingsRepository.getSettings();
  
  const tasks = allOrders
    .filter(o => o.status === 'en_attente' || o.status === 'en_cours')
    .sort((a, b) => a.expectedDeliveryDate.getTime() - b.expectedDeliveryDate.getTime())
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-800">Tableau de bord</h2>
            <p className="text-sm text-gray-500 mt-1">{settings.slogan || "Digitalisez votre atelier, simplifiez votre quotidien."}</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <GlobalSearch />
            <NotificationsDropdown />
          </div>
        </div>
        
        {/* Date Filter */}
        <DashboardDateFilter />
      </div>

      <div className="flex flex-col gap-8">
        {/* État des Commandes */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">État des Commandes</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {/* Total */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between aspect-auto md:aspect-square h-32 md:h-auto">
              <span aria-hidden="true" className="material-symbols-outlined text-2xl text-gray-400">inventory_2</span>
              <div>
                <span className="text-3xl font-bold text-gray-900 block">{stats.totalOrders}</span>
                <span className="font-medium text-xs text-gray-500 uppercase tracking-wide">Total</span>
              </div>
            </div>

            {/* En attente */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between aspect-auto md:aspect-square h-32 md:h-auto">
              <span aria-hidden="true" className="material-symbols-outlined text-2xl text-gray-400">pending</span>
              <div>
                <span className="text-3xl font-bold text-gray-900 block">{stats.waitingOrders}</span>
                <span className="font-medium text-xs text-gray-500 uppercase tracking-wide">En attente</span>
              </div>
            </div>

            {/* En cours */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between aspect-auto md:aspect-square h-32 md:h-auto">
              <span aria-hidden="true" className="material-symbols-outlined text-2xl text-yellow-500">content_cut</span>
              <div>
                <span className="text-3xl font-bold text-gray-900 block">{stats.inProgressOrders}</span>
                <span className="font-medium text-xs text-gray-500 uppercase tracking-wide">En cours</span>
              </div>
            </div>

            {/* Prêtes */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between aspect-auto md:aspect-square h-32 md:h-auto">
              <span aria-hidden="true" className="material-symbols-outlined text-2xl text-blue-500">checkroom</span>
              <div>
                <span className="text-3xl font-bold text-gray-900 block">{stats.readyOrders}</span>
                <span className="font-medium text-xs text-gray-500 uppercase tracking-wide">Prêtes</span>
              </div>
            </div>

            {/* Livrées */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between aspect-auto md:aspect-square h-32 md:h-auto">
              <span aria-hidden="true" className="material-symbols-outlined text-2xl text-green-500">local_shipping</span>
              <div>
                <span className="text-3xl font-bold text-gray-900 block">{stats.deliveredOrders}</span>
                <span className="font-medium text-xs text-gray-500 uppercase tracking-wide">Livrées</span>
              </div>
            </div>
          </div>
        </section>

        {/* Secondary Layout: Finance & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Financial Section */}
          <section className="lg:col-span-4 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Finances (Ce mois)</h3>
            
            <div className="flex flex-col gap-4">
              {/* CA du mois */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-brand">
                  <span aria-hidden="true" className="material-symbols-outlined bg-brand-light p-2 rounded-lg">payments</span>
                  <span className="font-semibold text-sm">CA du mois</span>
                </div>
                <span className="text-3xl font-bold text-gray-900">{new Intl.NumberFormat('fr-FR').format(stats.monthlyRevenue)} FCFA</span>
              </div>

              {/* Reste à encaisser */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <span aria-hidden="true" className="material-symbols-outlined bg-gray-50 p-2 rounded-lg">account_balance_wallet</span>
                  <span className="font-semibold text-sm">Reste à encaisser</span>
                </div>
                <span className="text-3xl font-bold text-gray-900">{new Intl.NumberFormat('fr-FR').format(stats.totalBalanceDue)} FCFA</span>
              </div>
            </div>
          </section>

          {/* Tasks List */}
          <section className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">À faire aujourd&apos;hui</h3>
              <Link href="/orders" className="text-sm font-medium text-brand hover:text-brand-light flex items-center gap-1 transition-colors">
                Voir tout <span aria-hidden="true" className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            
            <div className="flex flex-col gap-3 mt-4">
              {tasks.length === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-white border border-gray-100 rounded-lg shadow-sm">
                  Aucune tâche urgente pour le moment.
                </div>
              ) : (
                tasks.map((task) => {
                  const now = Date.now();
                  const daysRemaining = (task.expectedDeliveryDate.getTime() - now) / (1000 * 60 * 60 * 24);
                  
                  let urgencyStatus = 'normal'; // green
                  if (daysRemaining <= 3) urgencyStatus = 'urgent'; // red
                  else if (daysRemaining <= 7) urgencyStatus = 'warning'; // yellow

                  const startTask = updateOrderStatusAction.bind(null, task.id, 'en_cours');
                  const finishTask = updateOrderStatusAction.bind(null, task.id, 'pret');
                  
                  // Color mappings
                  const iconBg = urgencyStatus === 'urgent' ? 'bg-red-50/50 text-red-500' : urgencyStatus === 'warning' ? 'bg-yellow-50/50 text-yellow-600' : 'bg-green-50/50 text-green-600';
                  const badgeClasses = urgencyStatus === 'urgent' 
                    ? 'bg-red-100 text-red-700' 
                    : urgencyStatus === 'warning' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-700';
                  const badgeText = urgencyStatus === 'urgent' ? 'Urgent' : urgencyStatus === 'warning' ? 'Moins urgent' : 'Pas urgent';
                  const dateColor = urgencyStatus === 'urgent' ? 'text-red-600' : urgencyStatus === 'warning' ? 'text-yellow-600' : 'text-green-600';
                  
                  return (
                    <div key={task.id} className="p-4 sm:p-5 bg-white border border-gray-100 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${iconBg}`}>
                          <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                            {task.status === 'en_cours' ? 'content_cut' : 'straighten'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2 truncate">
                              {task.garmentType} 
                              {task.fabricPhotoUrl && (
                                <img src={task.fabricPhotoUrl} alt="Tissu" className="w-5 h-5 rounded object-cover border border-gray-200 shrink-0" />
                              )}
                              {task.fabricText ? <span className="text-gray-500 font-normal">- {task.fabricText}</span> : ''}
                            </h4>
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${badgeClasses}`}>
                              {badgeText}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            Client: <span className="font-medium text-gray-700">{task.client?.firstName} {task.client?.lastName}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                        <div className={`flex items-center text-xs font-semibold gap-1 shrink-0 ${dateColor}`}>
                          <span aria-hidden="true" className="material-symbols-outlined text-[14px]">schedule</span>
                          <span>Prévu le {new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(task.expectedDeliveryDate)}</span>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          {task.status === 'en_attente' && (
                            <form action={startTask} className="w-full sm:w-auto">
                              <button type="submit" className="w-full px-4 py-2 sm:py-1.5 bg-midnight text-white text-xs font-semibold rounded-md hover:bg-gray-800 transition-colors sm:w-auto flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                                Démarrer
                              </button>
                            </form>
                          )}
                          {task.status === 'en_cours' && (
                            <form action={finishTask} className="w-full sm:w-auto">
                              <button type="submit" className="w-full px-4 py-2 sm:py-1.5 bg-green-600 text-white text-xs font-semibold rounded-md hover:bg-green-700 transition-colors sm:w-auto flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">check</span>
                                Terminer
                              </button>
                            </form>
                          )}
                          <Link href={`/orders/${task.id}/edit`} className="px-4 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-md hover:bg-gray-50 transition-colors w-full sm:w-auto text-center flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                            Voir
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
