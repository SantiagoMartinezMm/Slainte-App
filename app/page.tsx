"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Image from "next/image"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    { id: 1, name: "SIN ALCOHOL", color: "bg-[#FFB7B7]" },
    { id: 2, name: "CERVEZA ARTESANAL", color: "bg-[#B8FF9F]" },
    { id: 3, name: "TRAGOS CLÁSICOS", color: "bg-zinc-700" },
    { id: 4, name: "DE AUTOR", color: "bg-zinc-800" },
  ]

  const promotions = [
    {
      id: 1,
      name: "NEGRONI CLÁSICO",
      price: "$5.700",
      image: "https://images.unsplash.com/photo-1657301829661-c790a2c3ac1e?w=400&h=400&q=80&auto=format&fit=crop",
      color: "bg-[#E9D5FF]",
      subtitle: "Gin, Campari, Vermut Rosso",
      icon: "🍸"
    },
    {
      id: 2,
      name: "APEROL SPRITZ",
      price: "$5.000",
      image: "https://images.unsplash.com/photo-1560512823-829485b8bf24?w=400&h=400&q=80&auto=format&fit=crop",
      color: "bg-[#E9D5FF]",
      subtitle: "Aperol, Prosecco, Soda",
      icon: "🍹"
    },
    // ... otras promociones
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-0 right-0 w-32 h-32 bg-[#B8FF9F]/20 rounded-full blur-2xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute bottom-0 left-0 w-40 h-40 bg-[#E9D5FF]/20 rounded-full blur-2xl"
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <Image
              src="/Recurso 11.png"
              alt="Slainte"
              width={200}
              height={80}
              className="mx-auto mb-2 invert"
            />
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400">
            <Search className="h-4 w-4" />
          </div>
          <Input
            type="search"
            placeholder="Buscar bebidas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-400 pl-10 rounded-2xl"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="bg-pink-200 rounded-full p-2">
              <span className="text-pink-500">🌸</span>
            </div>
          </div>
        </div>

        <ScrollArea className="w-full">
          <div className="flex space-x-2 pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="secondary"
                className={`px-6 py-3 rounded-full ${category.color} text-black whitespace-nowrap font-medium text-sm`}
              >
                {category.name}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div>
          <h2 className="text-xl font-bold mb-4">PROMOCIONES DEL DÍA</h2>
          <div className="grid grid-cols-2 gap-4">
            {promotions.map((promotion) => (
              <motion.div
                key={promotion.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`${promotion.color} overflow-hidden rounded-3xl border-0`}>
                  <CardContent className="p-4 relative">
                    <div className="absolute top-1 right-1 z-10 bg-white/80 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      {promotion.icon}
                    </div>
                    <div className="aspect-square relative mb-2">
                      <Image
                        src={promotion.image}
                        alt={promotion.name}
                        width={200}
                        height={200}
                        className="object-cover w-full h-full rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-zinc-900 font-bold text-sm leading-tight">{promotion.name}</h3>
                      <p className="text-zinc-600 text-xs">{promotion.subtitle}</p>
                      <p className="text-zinc-900 font-bold text-lg">{promotion.price}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-lg border-t border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <NavButton icon="🏠" label="Inicio" />
            <NavButton icon="🍷" label="Bebidas" />
            <NavButton icon="🛍️" label="Pedidos" />
            <NavButton icon="⚙️" label="Ajustes" />
          </div>
        </div>
      </nav>
    </div>
  )
}

function NavButton({ icon, label }: { icon: string; label: string }) {
  return (
    <Button variant="ghost" size="small" className="text-white">
      <span className="text-xl">{icon}</span>
      <span className="sr-only">{label}</span>
    </Button>
  )
}

