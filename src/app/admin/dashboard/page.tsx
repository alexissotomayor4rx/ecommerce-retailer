import { CurrencyDollarIcon, PresentationChartLineIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  // MOCK DATA: Simulación de datos que vendrían de la BD Supabase
  const currentMonthStats = {
    totalSales: 2450.00,
    netProfit: 785.50,
    totalOrders: 14,
    pendingOrders: 3
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Panel de Control</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Resumen financiero y operativo del mes actual.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ventas Totales</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${currentMonthStats.totalSales.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <PresentationChartLineIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ganancia Neta Real</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${currentMonthStats.netProfit.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <ShoppingBagIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Órdenes Completadas</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{currentMonthStats.totalOrders}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Note for Mom */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800/30 mt-8">
        <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300 mb-2">Calculadora de Margen de Ganancia</h3>
        <p className="text-indigo-700 dark:text-indigo-400 text-sm leading-relaxed">
          La <strong>Ganancia Neta Real</strong> que ves arriba se calcula automáticamente en base a las órdenes entregadas. <br/>
          La fórmula utilizada es: <br/>
          <code className="bg-indigo-100 dark:bg-indigo-800/50 px-2 py-1 rounded text-indigo-900 dark:text-indigo-200 mt-2 inline-block">
            Precio de Venta - Costo de Compra (USA) - Flete (Larbox) - Comisión de Tarjeta = Ganancia Neta
          </code>
        </p>
      </div>
    </div>
  );
}
