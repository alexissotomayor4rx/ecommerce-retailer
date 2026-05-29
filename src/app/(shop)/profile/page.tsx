'use client';
import { TruckIcon, CheckCircleIcon, MapPinIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

const MOCK_USER_ORDERS = [
  {
    id: 'ORD-002',
    date: '2026-05-15',
    item: 'Gafas Ray-Ban Aviator',
    status: 'in_ecuador_warehouse', // pending_validation, purchased_in_usa, in_ecuador_warehouse, dispatched
    finances: { total: 130, deposit: 65, balance: 65 },
    tracking_ecuador: ''
  },
  {
    id: 'ORD-001',
    date: '2026-04-10',
    item: 'Zapatillas Jordan Retro',
    status: 'dispatched',
    finances: { total: 220, deposit: 220, balance: 0 },
    tracking_ecuador: 'SER-987654321'
  }
];

export default function UserProfile() {
  const [orders] = useState(MOCK_USER_ORDERS);

  const getStepStatus = (currentStatus: string, stepIndex: number) => {
    const statuses = ['pending_validation', 'purchased_in_usa', 'in_ecuador_warehouse', 'dispatched'];
    const currentIndex = statuses.indexOf(currentStatus);
    
    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'current';
    return 'upcoming';
  };

  const steps = [
    { label: 'Validando Pago', icon: CheckCircleIcon },
    { label: 'Comprado (USA)', icon: ShoppingBagIcon },
    { label: 'En Bodega (EC)', icon: MapPinIcon },
    { label: 'Despachado', icon: TruckIcon }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Mi Perfil</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Bienvenido. Aquí puedes rastrear el estado de todas tus reservas.</p>
      </div>

      <div className="space-y-8">
        {orders.map(order => (
          <div key={order.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 border-b border-gray-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pedido {order.id}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Realizado el {order.date}</p>
                <p className="font-semibold text-indigo-600 dark:text-indigo-400 mt-1">{order.item}</p>
              </div>
              <div className="mt-4 md:mt-0 text-left md:text-right bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-300">Total: <span className="font-bold">${order.finances.total}</span></p>
                <p className="text-sm text-green-600">Abonado: <span className="font-bold">${order.finances.deposit}</span></p>
                {order.finances.balance > 0 && (
                  <p className="text-sm text-red-500 font-bold mt-1 pt-1 border-t border-gray-200 dark:border-slate-700">Saldo Pendiente: ${order.finances.balance}</p>
                )}
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="py-4">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-slate-700 rounded-full z-0"></div>
                
                {steps.map((step, idx) => {
                  const status = getStepStatus(order.status, idx);
                  return (
                    <div key={idx} className="relative z-10 flex flex-col items-center group">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 transition-colors ${
                        status === 'completed' ? 'bg-indigo-600 text-white' : 
                        status === 'current' ? 'bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900/30' : 
                        'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500'
                      }`}>
                        <step.icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs mt-2 font-medium absolute -bottom-6 w-24 text-center ${
                        status === 'current' ? 'text-blue-600 dark:text-blue-400 font-bold' : 
                        status === 'completed' ? 'text-indigo-600 dark:text-indigo-400' : 
                        'text-gray-400 dark:text-gray-500'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Guía Nacional */}
            {order.status === 'dispatched' && order.tracking_ecuador && (
              <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-300 font-bold">¡Tu pedido está en camino a casa!</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Rastréalo en la página de Servientrega con este número de guía:</p>
                </div>
                <div className="mt-3 sm:mt-0 flex items-center bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-blue-200 dark:border-blue-700">
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{order.tracking_ecuador}</span>
                </div>
              </div>
            )}
            
            {order.status === 'in_ecuador_warehouse' && order.finances.balance > 0 && (
              <div className="mt-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800/30 text-center">
                <p className="text-sm text-yellow-800 dark:text-yellow-400 font-bold">¡Tu pedido ya está en Ecuador!</p>
                <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1 mb-3">Para poder enviarlo a tu domicilio por Servientrega, por favor cancela el saldo pendiente.</p>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg shadow-sm text-sm transition-colors">
                  Pagar Saldo (${order.finances.balance})
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
