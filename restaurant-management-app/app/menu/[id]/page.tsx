"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Datos de productos
const menuItems = {
  milanesa: {
    id: "milanesa",
    name: "Milanesa Napolitana",
    description: "Milanesa de ternera con salsa de tomate, jamón y queso, acompañada de papas fritas.",
    longDescription:
      "Nuestra milanesa napolitana es un clásico de la cocina argentina. Preparada con carne de ternera de primera calidad, rebozada con pan rallado casero, cubierta con salsa de tomate natural, jamón y queso mozzarella gratinado. Acompañada de papas fritas crocantes.",
    price: 6000,
    images: [
      "https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=1964&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop",
    ],
    rating: 4.9,
    reviews: 156,
    category: "principales",
    dietary: [],
    options: [
      {
        name: "Guarnición",
        required: true,
        choices: [
          { id: "papas", name: "Papas Fritas", price: 0 },
          { id: "pure", name: "Puré de Papas", price: 0 },
          { id: "ensalada", name: "Ensalada Mixta", price: 0 },
          { id: "mixta", name: "Mixta (Papas y Ensalada)", price: 500 },
        ],
      },
      {
        name: "Extras",
        required: false,
        choices: [
          { id: "huevo", name: "Huevo Frito", price: 500 },
          { id: "queso", name: "Queso Extra", price: 600 },
          { id: "salsa", name: "Salsa Especial", price: 400 },
        ],
      },
    ],
  },
  asado: {
    id: "asado",
    name: "Asado de Tira",
    description: "Tierno asado de tira a la parrilla con chimichurri casero.",
    longDescription:
      "Nuestro asado de tira es un corte tradicional argentino, cocinado lentamente a la parrilla para lograr la perfecta combinación de sabor y terneza. Servido con chimichurri casero y acompañamiento a elección.",
    price: 7500,
    images: [
      "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=2031&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?q=80&w=1964&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=1984&auto=format&fit=crop",
    ],
    rating: 4.8,
    reviews: 142,
    category: "parrilla",
    dietary: ["sinGluten"],
    options: [
      {
        name: "Guarnición",
        required: true,
        choices: [
          { id: "papas", name: "Papas Fritas", price: 0 },
          { id: "pure", name: "Puré de Papas", price: 0 },
          { id: "ensalada", name: "Ensalada Mixta", price: 0 },
          { id: "mixta", name: "Mixta (Papas y Ensalada)", price: 500 },
        ],
      },
      {
        name: "Punto de Cocción",
        required: true,
        choices: [
          { id: "jugoso", name: "Jugoso", price: 0 },
          { id: "apunto", name: "A punto", price: 0 },
          { id: "cocido", name: "Bien cocido", price: 0 },
        ],
      },
    ],
  },
  empanadas: {
    id: "empanadas",
    name: "Empanadas (6 unidades)",
    description: "Empanadas de carne cortada a cuchillo, pollo y jamón y queso.",
    longDescription:
      "Nuestras empanadas son preparadas con masa casera y rellenos tradicionales. Cada orden incluye 6 unidades que puedes personalizar eligiendo entre nuestros sabores: carne cortada a cuchillo, pollo, jamón y queso, humita, o verdura.",
    price: 4500,
    images: [
      "https://images.unsplash.com/photo-1604467715878-83e57e8bc129?q=80&w=2068&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1609525313344-a56f10b10bdd?q=80&w=1980&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1676037150408-4b59a542f038?q=80&w=2070&auto=format&fit=crop",
    ],
    rating: 4.7,
    reviews: 98,
    category: "entradas",
    dietary: [],
    options: [
      {
        name: "Sabores",
        required: true,
        choices: [
          { id: "carne", name: "Carne (6)", price: 0 },
          { id: "pollo", name: "Pollo (6)", price: 0 },
          { id: "jyq", name: "Jamón y Queso (6)", price: 0 },
          { id: "mixtas", name: "Mixtas (2 de cada)", price: 0 },
        ],
      },
      {
        name: "Cocción",
        required: true,
        choices: [
          { id: "horno", name: "Al horno", price: 0 },
          { id: "fritas", name: "Fritas", price: 0 },
        ],
      },
    ],
  },
  flan: {
    id: "flan",
    name: "Flan Casero",
    description: "Flan con dulce de leche y crema.",
    longDescription:
      "Nuestro flan casero es un postre tradicional argentino, con una textura suave y cremosa. Servido con abundante dulce de leche y crema batida.",
    price: 2800,
    images: [
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1624454002302-52288312a7ae?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1964&auto=format&fit=crop",
    ],
    rating: 4.9,
    reviews: 78,
    category: "postres",
    dietary: ["vegetariano"],
    options: [
      {
        name: "Topping",
        required: true,
        choices: [
          { id: "ddl", name: "Dulce de Leche", price: 0 },
          { id: "crema", name: "Crema", price: 0 },
          { id: "mixto", name: "Mixto (Dulce de Leche y Crema)", price: 0 },
        ],
      },
    ],
  },
}

export default function MenuItemPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({})
  const [notes, setNotes] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const menuItem = menuItems[params.id as keyof typeof menuItems]

  useEffect(() => {
    // Inicializar las opciones requeridas con la primera opción por defecto
    if (menuItem) {
      const initialOptions: Record<string, string[]> = {}
      menuItem.options.forEach((option) => {
        if (option.required && option.choices.length > 0) {
          initialOptions[option.name] = [option.choices[0].id]
        } else {
          initialOptions[option.name] = []
        }
      })
      setSelectedOptions(initialOptions)
    }
  }, [menuItem])

  if (!menuItem) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-[50vh]">
        <p className="text-muted-foreground">Producto no encontrado</p>
        <Link href="/menu">
          <Button className="mt-4">Ver Menú</Button>
        </Link>
      </div>
    )
  }

  const handleOptionChange = (optionName: string, choiceId: string) => {
    const option = menuItem.options.find((opt) => opt.name === optionName)

    if (option?.required) {
      // For required options, only one choice can be selected
      setSelectedOptions({
        ...selectedOptions,
        [optionName]: [choiceId],
      })
    } else {
      // For non-required options, toggle the choice
      const currentChoices = selectedOptions[optionName] || []
      if (currentChoices.includes(choiceId)) {
        setSelectedOptions({
          ...selectedOptions,
          [optionName]: currentChoices.filter((id) => id !== choiceId),
        })
      } else {
        setSelectedOptions({
          ...selectedOptions,
          [optionName]: [...currentChoices, choiceId],
        })
      }
    }
  }

  const calculateTotalPrice = () => {
    let total = menuItem.price * quantity

    // Add price for selected options
    Object.entries(selectedOptions).forEach(([optionName, choiceIds]) => {
      const option = menuItem.options.find((opt) => opt.name === optionName)
      if (option) {
        choiceIds.forEach((choiceId) => {
          const choice = option.choices.find((c) => c.id === choiceId)
          if (choice) {
            total += choice.price * quantity
          }
        })
      }
    })

    return total
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const addToCart = () => {
    // Aquí iría la lógica para agregar al carrito
    alert(`${menuItem.name} agregado al carrito`)
    router.push("/cart")
  }

  return (
    <div className="flex flex-col pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background flex items-center justify-between p-4">
        <Link href="/menu">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleFavorite}>
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
      </div>

      {/* Image Gallery */}
      <div className="relative h-72 w-full">
        <Image
          src={menuItem.images[currentImageIndex] || "/placeholder.svg"}
          alt={menuItem.name}
          fill
          className="object-cover"
        />

        {/* Image indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          {menuItem.images.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${
                currentImageIndex === index ? "w-6 bg-primary" : "w-2 bg-white/70"
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold">{menuItem.name}</h1>
          <span className="text-xl font-bold text-primary">${menuItem.price.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="font-medium">{menuItem.rating}</span>
          </div>
          <span className="text-muted-foreground">({menuItem.reviews} reseñas)</span>

          {menuItem.dietary.length > 0 && (
            <div className="flex gap-1">
              {menuItem.dietary.map((diet) => (
                <Badge key={diet} variant="outline" className="text-xs">
                  {diet}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <p className="text-muted-foreground mb-6">{menuItem.longDescription}</p>

        {/* Options */}
        {menuItem.options.map((option) => (
          <div key={option.name} className="mb-6">
            <h3 className="font-medium mb-2">
              {option.name} {option.required && <span className="text-red-500">*</span>}
            </h3>
            <div className="space-y-2">
              {option.choices.map((choice) => {
                const isSelected = (selectedOptions[option.name] || []).includes(choice.id)
                return (
                  <div
                    key={choice.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => handleOptionChange(option.name, choice.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-primary bg-primary text-white" : "border-muted-foreground"
                        }`}
                      >
                        {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                      <span>{choice.name}</span>
                    </div>
                    {choice.price > 0 && <span className="text-muted-foreground">+${choice.price}</span>}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Notes */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Notas especiales</h3>
          <Textarea
            placeholder="Ej: Sin cebolla, término medio, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="resize-none"
          />
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Cantidad</h3>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="mx-4 font-medium text-lg">{quantity}</span>
            <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t z-30 max-w-md mx-auto">
        <Button className="w-full" size="lg" onClick={addToCart}>
          <ShoppingCart className="mr-2 h-5 w-5" />
          Agregar - ${calculateTotalPrice().toLocaleString()}
        </Button>
      </div>
    </div>
  )
}

