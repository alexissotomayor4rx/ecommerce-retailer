import ProductCard from '@/components/product/ProductCard';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  
  const { data: promotedProducts, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Error fetching products:', error);
  }
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920')" }}
        >
          <div className="absolute inset-0 bg-gray-900/80 mix-blend-multiply"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-md">
            Encuentra lo que no hay en Ecuador
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
            Traemos tus productos favoritos bajo pedido. Paga el 50% hoy, asegura tu talla, y recibe en Servientrega.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors shadow-lg w-full sm:w-auto">
              Explorar Catálogo
            </button>
            <button className="px-8 py-3 bg-transparent border border-white hover:bg-white/10 text-white rounded-lg font-semibold transition-colors w-full sm:w-auto">
              Hacer un Pedido Especial
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotedProducts && promotedProducts.length > 0 ? (
            promotedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              Aún no hay productos disponibles en la tienda.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
