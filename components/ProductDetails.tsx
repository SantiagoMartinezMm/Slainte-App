import Button from "@/components/ui/button"

export default function ProductDetails({ product, onAddToCart, onAddToFavorites }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-md" />
      <p className="text-lg font-semibold">${product.price}</p>
      <Button onClick={() => onAddToCart(product)} className="w-full">Agregar al carrito</Button>
      <Button onClick={() => onAddToFavorites(product)} className="w-full text-green-500">Agregar a favoritos</Button>
    </div>
  )
}

