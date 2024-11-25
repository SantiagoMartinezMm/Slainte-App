import { useEffect } from "react"
import Button from "@/components/ui/button"

declare global {
  interface Window {
    MercadoPago: any;
  }
}

export default function Checkout({ cart }) {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://sdk.mercadopago.com/js/v2"
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      if (cart.length === 0) {
        alert("El carrito está vacío.")
        return
      }

      const mp = new window.MercadoPago('TU_PUBLIC_KEY', {
        locale: 'es-AR'
      })

      mp.checkout({
        preference: {
          id: 'YOUR_PREFERENCE_ID'
        },
        render: {
          container: '.cho-container',
          label: 'Pagar',
        }
      })
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [cart])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Checkout</h1>
      {cart.map((item, index) => (
        <div key={index} className="flex justify-between items-center">
          <span>{item.name}</span>
          <span>${item.price}</span>
        </div>
      ))}
      <div className="cho-container">
        {/* MercadoPago button will be rendered here */}
      </div>
    </div>
  )
}

