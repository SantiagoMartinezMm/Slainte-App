import Card, { CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function Menu({ onSelectProduct }) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const productsData = await fetch('/api/products').then(res => res.json())
      console.log(productsData)
      setProducts(productsData)
    }
    fetchProducts()
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Menú</h1>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="bg-zinc-800" onClick={() => onSelectProduct(product)}>
            <CardContent className="p-4">
              <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-md mb-2" />
              <h2 className="font-semibold">{product.name}</h2>
              <p className="text-sm text-zinc-400">${product.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

