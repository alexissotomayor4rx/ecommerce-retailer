import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: any) => Promise<void>;
  product?: any | null; // Si existe, es edición. Si es nulo, es creación.
};

export default function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    description: '',
    original_price: '',
    sale_price: '',
    supply_cost: '',
    weight_lbs: '',
    stock: 0,
    is_under_order: true,
    main_image: '',
    images_gallery: '',
    usa_source_url: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        brand: product.brand || '',
        description: product.description || '',
        original_price: product.original_price || '',
        sale_price: product.sale_price || '',
        supply_cost: product.supply_cost || '',
        weight_lbs: product.weight_lbs || '',
        stock: product.stock || 0,
        is_under_order: product.is_under_order ?? true,
        main_image: product.main_image || '',
        images_gallery: product.images_gallery ? product.images_gallery.join(', ') : '',
        usa_source_url: product.usa_source_url || ''
      });
    } else {
      setFormData({
        title: '',
        brand: '',
        description: '',
        original_price: '',
        sale_price: '',
        supply_cost: '',
        weight_lbs: '',
        stock: 0,
        is_under_order: true,
        main_image: '',
        images_gallery: '',
        usa_source_url: ''
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSave = {
        ...formData,
        original_price: formData.original_price ? parseFloat(formData.original_price as string) : null,
        sale_price: parseFloat(formData.sale_price as string),
        supply_cost: formData.supply_cost ? parseFloat(formData.supply_cost as string) : null,
        weight_lbs: formData.weight_lbs ? parseFloat(formData.weight_lbs as string) : null,
        stock: parseInt(String(formData.stock)) || 0,
        images_gallery: formData.images_gallery 
          ? formData.images_gallery.split(',').map(url => url.trim()).filter(url => url !== '') 
          : [],
      };
      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información Básica */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">Información Básica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título del Producto *</label>
                    <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Marca *</label>
                    <input required type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                  <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 outline-none"></textarea>
                </div>
              </div>

              {/* Precios y Costos */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">Precios (USD)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PVP (Venta) *</label>
                    <input required type="number" min="0" step="0.01" name="sale_price" value={formData.sale_price} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Costo (USA) *</label>
                    <input required type="number" min="0" step="0.01" name="supply_cost" value={formData.supply_cost} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio Original (Tachado)</label>
                    <input type="number" min="0" step="0.01" name="original_price" value={formData.original_price} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                </div>
              </div>

              {/* Logística */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">Logística e Inventario</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Peso (lbs)</label>
                    <input type="number" min="0" step="0.01" name="weight_lbs" value={formData.weight_lbs} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock local</label>
                    <input type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                  <div className="col-span-2 flex items-center space-x-2 mt-4">
                    <input type="checkbox" id="is_under_order" name="is_under_order" checked={formData.is_under_order} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
                    <label htmlFor="is_under_order" className="text-sm font-medium text-gray-700 dark:text-gray-300">Es bajo pedido (No descontar stock al vender)</label>
                  </div>
                </div>
              </div>

              {/* Enlaces y Multimedia */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">Multimedia y Enlaces</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Imagen Principal *</label>
                    <input required type="url" name="main_image" value={formData.main_image} onChange={handleChange} placeholder="https://..." className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Origen (Amazon, eBay, etc)</label>
                    <input type="url" name="usa_source_url" value={formData.usa_source_url} onChange={handleChange} placeholder="https://amazon.com/..." className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imágenes Secundarias (Opcional)</label>
                    <p className="text-xs text-gray-500 mb-2">Separa los links de las imágenes con comas (,)</p>
                    <textarea name="images_gallery" rows={2} value={formData.images_gallery} onChange={handleChange} placeholder="https://imagen1.jpg, https://imagen2.jpg" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-600 outline-none"></textarea>
                  </div>
                </div>
              </div>

            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 flex justify-end space-x-4">
          <button onClick={onClose} type="button" className="px-6 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            Cancelar
          </button>
          <button form="product-form" type="submit" disabled={loading} className="px-6 py-2 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar Producto'}
          </button>
        </div>
      </div>
    </div>
  );
}
