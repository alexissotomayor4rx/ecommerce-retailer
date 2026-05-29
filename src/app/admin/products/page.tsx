'use client';
import { useState, useEffect } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';
import ProductModal from '@/components/admin/ProductModal';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  
  const supabase = createClient();

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSaveProduct = async (productData: any) => {
    if (editingProduct) {
      // Editar
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);
        
      if (error) throw error;
    } else {
      // Crear
      const { error } = await supabase
        .from('products')
        .insert([productData]);
        
      if (error) throw error;
    }
    await fetchProducts(); // Recargar la tabla
  };

  const handleEditClick = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventario de Productos</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gestiona los detalles completos de precios y origen USA.</p>
        </div>
        <button 
          onClick={handleCreateClick}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 text-sm">
                <th className="p-4 font-semibold">Producto / Marca</th>
                <th className="p-4 font-semibold">Costo USA</th>
                <th className="p-4 font-semibold">PVP (Venta)</th>
                <th className="p-4 font-semibold">Peso (lbs)</th>
                <th className="p-4 font-semibold">Modalidad</th>
                <th className="p-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">Cargando productos...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">No hay productos en el inventario.</td>
                </tr>
              ) : (
                products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{product.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{product.brand}</p>
                  </td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">${product.supply_cost}</td>
                  <td className="p-4">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      ${product.sale_price || product.original_price}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700 dark:text-gray-300">{product.weight_lbs} lbs</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.is_under_order ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {product.is_under_order ? 'Bajo Pedido' : 'En Stock'}
                    </span>
                  </td>
                  <td className="p-4 flex space-x-3">
                    <button 
                      onClick={() => handleEditClick(product)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" title="Editar"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={async () => {
                        if (confirm('¿Estás seguro de eliminar este producto?')) {
                          await supabase.from('products').delete().eq('id', product.id);
                          fetchProducts();
                        }
                      }}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" title="Eliminar"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    <a href={product.usa_source_url} target="_blank" rel="noreferrer" className="text-xs bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded border border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300">
                      Link USA
                    </a>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Crear/Editar Producto */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
}
