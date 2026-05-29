import Link from 'next/link';

export default function ProductCard({ product }: { product: any }) {
  const hasDiscount = product.sale_price && product.sale_price < product.original_price;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-800 flex flex-col h-full group">
      <Link href={`/product/${product.id}`} className="block relative">
        <div className="aspect-w-1 aspect-h-1 bg-gray-100 dark:bg-slate-800 relative h-64 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.main_image} alt={product.title} referrerPolicy="no-referrer" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
          {hasDiscount && (
             <span className="absolute top-3 left-3 bg-[#FF6B4A] text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
               OFERTA
             </span>
          )}
        </div>
        
        {/* Thumbnails */}
        {product.images_gallery && product.images_gallery.length > 0 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {product.images_gallery.map((thumb: string, idx: number) => (
              <div key={idx} className="w-10 h-10 rounded-md overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/product/${product.id}`} className="block mb-4 flex-grow">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">{product.title}</h3>
          {product.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">{product.description}</p>
          )}
          <div className="flex items-center space-x-2 mt-2">
            {hasDiscount ? (
              <>
                <span className="text-xl font-black text-gray-900 dark:text-white">${product.sale_price}</span>
                <span className="text-sm text-gray-400 dark:text-gray-500 line-through font-medium">${product.original_price}</span>
              </>
            ) : (
              <span className="text-xl font-black text-gray-900 dark:text-white">${product.sale_price || product.original_price}</span>
            )}
          </div>
        </Link>

        <button className="w-full bg-[#FF6B4A] hover:bg-[#e85a3c] text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-md mt-auto">
          Comprar Ahora (Paga 50%)
        </button>
      </div>
    </div>
  );
}
