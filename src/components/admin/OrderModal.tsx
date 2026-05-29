import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';

type OrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
};

export default function OrderModal({ isOpen, onClose, onSave }: OrderModalProps) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_city: '',
    customer_address: '',
    product_id: '',
    selected_size: '',
    total_amount: '',
    deposit_paid: '',
    balance_due: '',
  });

  useEffect(() => {
    if (isOpen) {
      // Cargar productos para el dropdown
      const fetchProducts = async () => {
        const { data } = await supabase.from('products').select('id, title, sale_price, original_price');
        if (data) setProducts(data);
      };
      fetchProducts();
    }
  }, [isOpen]);

  useEffect(() => {
    // Calcular balance_due automáticamente
    const total = parseFloat(formData.total_amount) || 0;
    const deposit = parseFloat(formData.deposit_paid) || 0;
    setFormData(prev => ({ ...prev, balance_due: (total - deposit).toFixed(2) }));
  }, [formData.total_amount, formData.deposit_paid]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Insert Order
      const orderData = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_city: formData.customer_city,
        customer_address: formData.customer_address,
        total_amount: parseFloat(formData.total_amount),
        deposit_paid: parseFloat(formData.deposit_paid),
        balance_due: parseFloat(formData.balance_due),
        status: 'pending_validation'
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert Order Item
      if (formData.product_id) {
        const selectedProduct = products.find(p => p.id === formData.product_id);
        const itemData = {
          order_id: order.id,
          product_id: formData.product_id,
          quantity: 1,
          unit_price: selectedProduct?.sale_price || selectedProduct?.original_price || parseFloat(formData.total_amount),
          selected_size: formData.selected_size
        };

        const { error: itemError } = await supabase.from('order_items').insert([itemData]);
        if (itemError) throw itemError;
      }

      onSave(); // Recarga las ordenes y cierra
    } catch (error) {
      console.error('Error al crear orden:', error);
      alert('Error al crear la orden');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Si cambia el producto, auto-llenar el total
    if (name === 'product_id') {
      const selectedProduct = products.find(p => p.id === value);
      if (selectedProduct) {
        const price = selectedProduct.sale_price || selectedProduct.original_price;
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          total_amount: price.toString(),
          deposit_paid: (price / 2).toString()
        }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Registrar Nueva Orden (Manual)</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          <form id="order-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Datos del Cliente */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white border-b pb-2 mb-4">Datos del Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Nombre Completo *</label>
                  <input required type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-transparent" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Teléfono (WhatsApp) *</label>
                  <input required type="text" name="customer_phone" value={formData.customer_phone} onChange={handleChange} placeholder="099..." className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-transparent" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Ciudad *</label>
                  <input required type="text" name="customer_city" value={formData.customer_city} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-transparent" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Dirección / Agencia Servientrega *</label>
                  <input required type="text" name="customer_address" value={formData.customer_address} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-transparent" />
                </div>
              </div>
            </div>

            {/* Producto */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white border-b pb-2 mb-4">Detalle del Producto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Producto Reservado *</label>
                  <select required name="product_id" value={formData.product_id} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <option value="">Selecciona un producto</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Talla</label>
                  <input type="text" name="selected_size" value={formData.selected_size} onChange={handleChange} placeholder="Ej: 42 EUR" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-transparent" />
                </div>
              </div>
            </div>

            {/* Finanzas */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white border-b pb-2 mb-4">Finanzas</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">Precio Total *</label>
                  <input required type="number" min="0" step="0.01" name="total_amount" value={formData.total_amount} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-transparent" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-green-600 font-semibold">Abono Recibido *</label>
                  <input required type="number" min="0" step="0.01" name="deposit_paid" value={formData.deposit_paid} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-transparent" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-red-500 font-semibold">Saldo Pendiente</label>
                  <input readOnly type="number" min="0" step="0.01" name="balance_due" value={formData.balance_due} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-500 font-bold" />
                </div>
              </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-slate-800 flex justify-end space-x-4">
          <button onClick={onClose} type="button" className="px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Cancelar
          </button>
          <button form="order-form" type="submit" disabled={loading} className="px-6 py-2 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50">
            {loading ? 'Guardando...' : 'Crear Orden'}
          </button>
        </div>
      </div>
    </div>
  );
}
