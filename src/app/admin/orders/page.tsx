'use client';
import { useState, useEffect } from 'react';
import { ChatBubbleOvalLeftEllipsisIcon, PlusIcon } from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';
import OrderModal from '@/components/admin/OrderModal';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  const fetchOrders = async () => {
    setLoading(true);
    // Fetch orders with their first order_item to get the product details
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          product_id,
          selected_size,
          products ( title )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateField = async (orderId: string, field: string, value: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ [field]: value })
      .eq('id', orderId);
    
    if (error) {
      console.error('Error updating order:', error);
      alert('Error al guardar el cambio');
    }
  };

  // Generador de enlace de WhatsApp
  const openWhatsApp = (phone: string, isCollection: boolean = false) => {
    const formattedPhone = phone.startsWith('0') ? '593' + phone.substring(1) : phone;
    let message = 'Hola! Te escribimos de ImportStore.';
    if (isCollection) {
      message = '¡Buenas noticias! Tu pedido ya llegó a nuestra bodega en Ecuador. Por favor, ayúdanos cancelando el saldo pendiente para proceder con el despacho por Servientrega.';
    }
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const statusColors: any = {
    pending_validation: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    purchased_in_usa: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    in_ecuador_warehouse: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    dispatched: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  };

  const statusLabels: any = {
    pending_validation: 'Pendiente de Validación',
    purchased_in_usa: 'Comprado en USA',
    in_ecuador_warehouse: 'En Bodega Ecuador',
    dispatched: 'Despachado',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Órdenes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Control de pagos, logística y notificaciones al cliente.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Registrar Orden Manual</span>
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Cargando órdenes...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No hay órdenes registradas.</div>
        ) : orders.map(order => {
          const item = order.order_items?.[0];
          const productTitle = item?.products?.title || 'Producto Eliminado';
          const size = item?.selected_size ? `(Talla ${item.selected_size})` : '';
          const displayItem = `${productTitle} ${size}`;

          return (
          <div key={order.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row gap-6">
            
            {/* Detalle Cliente */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-gray-900 dark:text-white">{order.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
              </div>
              <p className="font-medium text-gray-800 dark:text-gray-200">{order.customer_name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{displayItem}</p>
              <div className="text-sm text-gray-500 flex flex-col mt-2">
                <span>📍 {order.customer_city} - {order.customer_address}</span>
                <button onClick={() => openWhatsApp(order.customer_phone)} className="text-green-600 hover:underline flex items-center mt-1 w-fit">
                  <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4 mr-1"/> WhatsApp: {order.customer_phone}
                </button>
              </div>
            </div>

            {/* Finanzas */}
            <div className="w-full md:w-48 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Finanzas</h4>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Total:</span>
                <span className="font-semibold text-gray-900 dark:text-white">${order.total_amount}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-600">Abono:</span>
                <span className="font-semibold text-green-600">${order.deposit_paid}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-slate-700 mt-2">
                <span className="text-red-500 font-bold">Saldo:</span>
                <span className="font-bold text-red-500">${order.balance_due}</span>
              </div>
            </div>

            {/* Controles de Estado y Tracking */}
            <div className="flex-1 flex flex-col space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Cambiar Estado</label>
                <select 
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
                  defaultValue={order.status}
                  onChange={(e) => handleUpdateField(order.id, 'status', e.target.value)}
                >
                  <option value="pending_validation">Pendiente de Validación</option>
                  <option value="purchased_in_usa">Comprado en USA</option>
                  <option value="in_ecuador_warehouse">En Bodega Ecuador</option>
                  <option value="dispatched">Despachado</option>
                </select>
              </div>

              {order.status === 'in_ecuador_warehouse' && (
                <button 
                  onClick={() => openWhatsApp(order.customer_phone, true)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2 rounded-lg shadow transition-colors"
                >
                  Cobrar Saldo por WhatsApp
                </button>
              )}

              <div className="grid grid-cols-2 gap-2 mt-auto">
                <input 
                  type="text" 
                  placeholder="USA Tracking (Larbox)" 
                  defaultValue={order.usa_tracking_number || ''}
                  onBlur={(e) => handleUpdateField(order.id, 'usa_tracking_number', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white"
                />
                <input 
                  type="text" 
                  placeholder="EC Tracking (Servientrega)" 
                  defaultValue={order.ecuador_tracking_number || ''}
                  onBlur={(e) => handleUpdateField(order.id, 'ecuador_tracking_number', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )})}
      </div>
      
      <OrderModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => {
          setIsModalOpen(false);
          fetchOrders();
        }}
      />
    </div>
  );
}
