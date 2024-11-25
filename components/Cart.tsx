import Button from "@/components/ui/button"

export default function Cart({ cart, onCheckout, onRemove }) {
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '').replace('.', '').replace(',', '.')), 0)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Carrito</h1>
      {cart.map((item, index) => (
        <div key={index} className="flex justify-between items-center">
          <span>{item.name}</span>
          <span>${item.price}</span>
          <Button onClick={() => onRemove(item.id)} className="text-red-500">Eliminar</Button>
        </div>
      ))}
      <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
      <Button onClick={onCheckout} className="w-full">Proceder al pago</Button>
    </div>
  )
}

