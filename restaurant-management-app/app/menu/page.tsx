"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Filter, Search, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

const categories = [
  { id: "all", name: "Todos" },
  { id: "entradas", name: "Entradas" },
  { id: "principales", name: "Principales" },
  { id: "parrilla", name: "Parrilla" },
  { id: "pastas", name: "Pastas" },
  { id: "pizzas", name: "Pizzas" },
  { id: "postres", name: "Postres" },
  { id: "bebidas", name: "Bebidas" },
]

const dietaryFilters = [
  { id: "vegetariano", name: "Vegetariano" },
  { id: "vegano", name: "Vegano" },
  { id: "sinGluten", name: "Sin Gluten" },
  { id: "sinLactosa", name: "Sin Lactosa" },
]

const menuItems = [
  {
    id: "milanesa",
    name: "Milanesa Napolitana",
    description: "Milanesa de ternera con salsa de tomate, jamón y queso, acompañada de papas fritas.",
    price: 3800,
    image: "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?q=80&w=2070&auto=format&fit=crop",
    rating: 4.9,
    category: "principales",
    dietary: [],
    limited: false,
  },
  {
    id: "asado",
    name: "Asado de Tira",
    description: "Tierno asado de tira a la parrilla con chimichurri casero.",
    price: 4500,
    image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=2031&auto=format&fit=crop",
    rating: 4.8,
    category: "parrilla",
    dietary: ["sinGluten"],
    limited: true,
    stock: 5,
  },
  {
    id: "empanadas",
    name: "Empanadas (6 unidades)",
    description: "Empanadas de carne cortada a cuchillo, pollo y jamón y queso.",
    price: 2800,
    image: "https://images.unsplash.com/photo-1604467715878-83e57e8bc129?q=80&w=2068&auto=format&fit=crop",
    rating: 4.7,
    category: "entradas",
    dietary: [],
    limited: false,
  },
  {
    id: "provoleta",
    name: "Provoleta",
    description: "Queso provolone a la parrilla con orégano y aceite de oliva.",
    price: 2500,
    image: "https://images.unsplash.com/photo-1625938144755-652e08e359b7?q=80&w=1974&auto=format&fit=crop",
    rating: 4.6,
    category: "entradas",
    dietary: ["vegetariano", "sinGluten"],
    limited: false,
  },
  {
    id: "ensalada",
    name: "Ensalada Completa",
    description: "Lechuga, tomate, cebolla, zanahoria, huevo y aceitunas.",
    price: 2200,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    rating: 4.5,
    category: "entradas",
    dietary: ["vegetariano", "vegano", "sinGluten", "sinLactosa"],
    limited: false,
  },
  {
    id: "sorrentinos",
    name: "Sorrentinos de Jamón y Queso",
    description: "Pasta rellena con jamón y queso, salsa a elección.",
    price: 3200,
    image: "https://images.unsplash.com/photo-1587131782738-de30ea91a542?q=80&w=2070&auto=format&fit=crop",
    rating: 4.7,
    category: "pastas",
    dietary: ["vegetariano"],
    limited: false,
  },
  {
    id: "pizza",
    name: "Pizza Especial",
    description: "Mozzarella, jamón, morrón, aceitunas y huevo.",
    price: 3500,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8,
    category: "pizzas",
    dietary: [],
    limited: false,
  },
  {
    id: "flan",
    name: "Flan Casero",
    description: "Flan con dulce de leche y crema.",
    price: 1800,
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=2070&auto=format&fit=crop",
    rating: 4.9,
    category: "postres",
    dietary: ["vegetariano"],
    limited: false,
  },
]

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      setActiveFilters(activeFilters.filter((id) => id !== filterId))
    } else {
      setActiveFilters([...activeFilters, filterId])
    }
  }

  const filteredItems = menuItems.filter((item) => {
    // Category filter
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory

    // Search filter
    const searchMatch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())

    //  ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Dietary filter
    const dietaryMatch = activeFilters.length === 0 || activeFilters.every((filter) => item.dietary.includes(filter))

    return categoryMatch && searchMatch && dietaryMatch
  })

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-20 bg-background pt-4 pb-2 px-4">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Menú Digital</h1>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar platos..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {showFilters && (
          <div className="bg-muted p-3 rounded-lg mb-4">
            <h3 className="font-medium mb-2">Preferencias dietarias</h3>
            <div className="flex flex-wrap gap-2">
              {dietaryFilters.map((filter) => (
                <Badge
                  key={filter.id}
                  variant={activeFilters.includes(filter.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleFilter(filter.id)}
                >
                  {filter.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className={cn(
                  "category-pill whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium",
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground",
                )}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No se encontraron platos que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <Link href={`/menu/${item.id}`} key={item.id}>
                <Card className="food-card">
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        {item.limited && (
                          <Badge className="absolute top-1 left-1 text-[10px] bg-orange-500">Quedan {item.stock}</Badge>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="font-bold text-primary">${item.price.toLocaleString()}</span>
                          {item.rating && (
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                              <span className="text-xs">{item.rating}</span>
                            </div>
                          )}
                        </div>
                        {item.dietary.length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {item.dietary.includes("vegetariano") && (
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-green-50 text-green-700 border-green-200"
                              >
                                Vegetariano
                              </Badge>
                            )}
                            {item.dietary.includes("vegano") && (
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-green-50 text-green-700 border-green-200"
                              >
                                Vegano
                              </Badge>
                            )}
                            {item.dietary.includes("sinGluten") && (
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-amber-50 text-amber-700 border-amber-200"
                              >
                                Sin Gluten
                              </Badge>
                            )}
                            {item.dietary.includes("sinLactosa") && (
                              <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                                Sin Lactosa
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

