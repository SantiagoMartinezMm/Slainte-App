"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, ChevronRight, CreditCard, Heart, HelpCircle, LogOut, MapPin, Settings, User } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

// Mock user data
const user = {
  name: "Martín Rodríguez",
  email: "martin@example.com",
  points: 320,
  pointsToNextLevel: 500,
  level: "Plata",
  nextLevel: "Oro",
  orders: [
    {
      id: "ORD-1234",
      date: "15 Mar, 2025",
      total: 6900,
      items: "Milanesa Napolitana, Empanadas (6)",
      status: "Entregado",
    },
    {
      id: "ORD-1189",
      date: "2 Mar, 2025",
      total: 4500,
      items: "Asado de Tira, Ensalada Completa",
      status: "Entregado",
    },
    {
      id: "ORD-1156",
      date: "20 Feb, 2025",
      total: 3200,
      items: "Sorrentinos de Jamón y Queso",
      status: "Entregado",
    },
  ],
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("orders")
  const router = useRouter()

  const navigateToSection = (section: string) => {
    router.push(`/profile/${section}`)
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 pt-8 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-white">
            <Image
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop"
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">¡Hola, {user.name}!</h1>
            <p className="text-primary-foreground/80">{user.email}</p>
          </div>
        </div>

        {/* Loyalty Progress */}
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <span className="font-medium">Nivel {user.level}</span>
            </div>
            <span className="text-sm">{user.points} puntos</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full mb-2 overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${(user.points / user.pointsToNextLevel) * 100}%` }}
            />
          </div>
          <p className="text-xs text-primary-foreground/80">
            {user.pointsToNextLevel - user.points} puntos más para alcanzar el nivel {user.nextLevel}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mt-4">
        <button
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === "orders" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Mis Pedidos
        </button>
        <button
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === "account" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("account")}
        >
          Mi Cuenta
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "orders" && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold mb-3">Pedidos Recientes</h2>
            {user.orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{order.id}</h3>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                    <Badge status={order.status} />
                  </div>
                  <p className="text-sm mb-2 line-clamp-1">{order.items}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary">${order.total.toLocaleString()}</span>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Ver Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full">
              Ver Todos los Pedidos
            </Button>
          </div>
        )}

        {activeTab === "account" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-bold mb-3">Preferencias</h2>
              <AccountLink
                icon={User}
                text="Información Personal"
                section="personal-info"
                onClick={navigateToSection}
              />
              <AccountLink icon={MapPin} text="Direcciones Guardadas" section="addresses" onClick={navigateToSection} />
              <AccountLink
                icon={CreditCard}
                text="Métodos de Pago"
                section="payment-methods"
                onClick={navigateToSection}
              />
              <AccountLink icon={Heart} text="Favoritos" section="favorites" onClick={navigateToSection} />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold mb-3">Configuración</h2>
              <AccountLink
                icon={Settings}
                text="Configuración de la App"
                section="settings"
                onClick={navigateToSection}
              />
              <AccountLink icon={HelpCircle} text="Ayuda y Soporte" section="support" onClick={navigateToSection} />
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Badge({ status }: { status: string }) {
  let color = ""

  switch (status) {
    case "Entregado":
      color = "bg-green-100 text-green-800 border-green-200"
      break
    case "En Camino":
      color = "bg-blue-100 text-blue-800 border-blue-200"
      break
    case "Preparando":
      color = "bg-amber-100 text-amber-800 border-amber-200"
      break
    case "Cancelado":
      color = "bg-red-100 text-red-800 border-red-200"
      break
    default:
      color = "bg-gray-100 text-gray-800 border-gray-200"
  }

  return <span className={`text-xs px-2 py-1 rounded-full border ${color}`}>{status}</span>
}

function AccountLink({
  icon: Icon,
  text,
  section,
  onClick,
}: {
  icon: any
  text: string
  section: string
  onClick: (section: string) => void
}) {
  return (
    <Button variant="ghost" className="w-full justify-start" onClick={() => onClick(section)}>
      <Icon className="h-5 w-5 mr-3" />
      {text}
      <ChevronRight className="h-5 w-5 ml-auto" />
    </Button>
  )
}

