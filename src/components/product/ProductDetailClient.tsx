'use client';
import { useState } from 'react';

export default function ProductDetailClient({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>(product.main_image);
  
  const hasDiscount = product.sale_price && product.sale_price < product.original_price;

  // Manejador del botón de reserva
  const handleReserve = () => {
    if (!selectedSize) return;
    
    // Aquí puedes cambiar el número de WhatsApp de la tienda (Ecuador: +593)
    const phoneNumber = "593999999999"; 
    const priceToPay = product.sale_price || product.original_price;
    const deposit = (priceToPay / 2).toFixed(2);
    
    const message = `Hola! 👋 Quisiera reservar el producto: *${product.title}*.\n\n` +
                    `*Talla seleccionada:* ${selectedSize}\n` +
                    `*Precio Total:* $${priceToPay}\n` +
                    `*Abono inicial (50%):* $${deposit}\n\n` +
                    `¿Me ayudas con los datos para el pago?`;
                    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Parsear la galería de imágenes de forma segura por si viene como string desde Supabase
  let gallery: string[] = [];
  if (Array.isArray(product.images_gallery)) {
    gallery = product.images_gallery;
  } else if (typeof product.images_gallery === 'string') {
    try {
      gallery = JSON.parse(product.images_gallery);
    } catch (e) {
      // Si no es JSON válido, intentar separarlo por comas (formato crudo o postgres array)
      gallery = product.images_gallery
        .replace(/^{|}$/g, '') // Quitar llaves de postgres array si existen
        .split(',')
        .map((s: string) => s.trim().replace(/^"|"$/g, '')); // Quitar comillas
    }
  }

  // Juntar la imagen principal con la galería, y filtrar solo los que sean URLs válidas
  const allImages = [product.main_image, ...gallery].filter(
    (img) => typeof img === 'string' && img.trim().startsWith('http')
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
      {/* Galería de Imágenes */}
      <div className="flex flex-col space-y-4">
        <div className="bg-gray-100 dark:bg-slate-800 rounded-3xl h-[400px] md:h-[500px] w-full overflow-hidden shadow-sm dark:shadow-slate-900 border border-gray-100 dark:border-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={activeImage} 
            alt={product.title} 
            className="object-cover w-full h-full transition-all duration-300"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1e293b/ffffff?text=Imagen+No+Disponible';
            }}
          />
        </div>
        
        {/* Miniaturas */}
        {allImages.length > 1 && (
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {allImages.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === img ? 'border-[#FF6B4A] shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={img} 
                  alt={`Thumbnail ${idx}`} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info y Tallas */}
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{product.title}</h1>
        <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
        
        <div className="flex items-center space-x-3 mb-6">
          {hasDiscount ? (
            <>
              <span className="text-3xl font-black text-gray-900 dark:text-white">${product.sale_price}</span>
              <span className="text-lg text-gray-400 dark:text-gray-500 line-through font-medium">${product.original_price}</span>
            </>
          ) : (
            <span className="text-3xl font-black text-gray-900 dark:text-white">${product.sale_price || product.original_price}</span>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-10 leading-relaxed text-lg">{product.description || 'Importado directamente desde USA. Producto garantizado bajo pedido.'}</p>

        {/* Size Selector */}
        {product.size_chart && Object.keys(product.size_chart).length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Selecciona tu Talla</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(product.size_chart).map(([size, cm]) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center justify-center ${
                    selectedSize === size 
                      ? 'border-[#FF6B4A] bg-[#FF6B4A]/10 text-[#FF6B4A] shadow-sm' 
                      : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-[#FF6B4A]/50 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="block font-bold text-base">{size}</span>
                  <span className="block text-xs mt-1 font-medium text-gray-500 dark:text-gray-400">{cm as string}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <button 
          onClick={handleReserve}
          disabled={product.size_chart && Object.keys(product.size_chart).length > 0 && !selectedSize}
          className="w-full bg-[#FF6B4A] hover:bg-[#e85a3c] text-white py-4 rounded-xl font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-auto"
        >
          {product.size_chart && Object.keys(product.size_chart).length > 0 && !selectedSize ? 'Selecciona una talla para continuar' : 'Reservar Pedido (WhatsApp)'}
        </button>
      </div>
    </div>
  );
}
