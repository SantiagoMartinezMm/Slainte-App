"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, CreditCard, Minus, Plus, Trash2, Wallet } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Mock cart data
const initialCartItems = [
  {
    id: "milanesa",
    name: "Milanesa Napolitana",
    options: "Papas Fritas, Huevo Frito",
    notes: "Sin cebolla",
    price: 3800,
    extras: 300,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "empanadas",
    name: "Empanadas (6 unidades)",
    options: "2 Carne, 2 Pollo, 2 Jamón y Queso",
    notes: "",
    price: 2800,
    extras: 0,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1604467715878-83e57e8bc129?q=80&w=2068&auto=format&fit=crop",
  },
]

const paymentMethods = [
  {
    id: "mercadopago",
    name: "MercadoPago",
    icon: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop",
  },
  { id: "credit", name: "Tarjeta de Crédito", icon: CreditCard },
  { id: "debit", name: "Tarjeta de Débito", icon: CreditCard },
  { id: "cash", name: "Efectivo", icon: Wallet },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [selectedPayment, setSelectedPayment] = useState("mercadopago")

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price + item.extras) * item.quantity, 0)
  }

  const calculateDelivery = () => {
    return 500 // Fixed delivery fee
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDelivery()
  }

  return (
    <div className="flex flex-col pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background pt-4 pb-2 px-4 border-b">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/menu">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Tu Pedido</h1>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center h-[50vh]">
          <div className="bg-muted rounded-full p-6 mb-4">
            <Wallet className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-6">Agregá productos del menú para comenzar tu pedido</p>
          <Link href="/menu">
            <Button>Ver Menú</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="p-4 space-y-3">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.options}</p>
                      {item.notes && <p className="text-xs italic text-muted-foreground mt-1">"{item.notes}"</p>}
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-medium text-primary">
                          ${((item.price + item.extras) * item.quantity).toLocaleString()}
                        </span>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2 font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Method */}
          <div className="p-4">
            <h2 className="text-lg font-bold mb-3">Método de Pago</h2>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPayment === method.id ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => setSelectedPayment(method.id)}
                >
                  <div className="flex items-center gap-3">
                    {typeof method.icon === "string" ? (
                      <div className="relative h-6 w-6">
                        <Image
                          src={method.icon || "/placeholder.svg"}
                          alt={method.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <method.icon className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span>{method.name}</span>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                      selectedPayment === method.id ? "border-primary bg-primary text-white" : "border-muted-foreground"
                    }`}
                  >
                    {selectedPayment === method.id && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 max-w-md mx-auto">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${calculateSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span>${calculateDelivery().toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${calculateTotal().toLocaleString()}</span>
              </div>
            </div>
            <Button className="w-full" size="lg">
              Confirmar Pedido
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

