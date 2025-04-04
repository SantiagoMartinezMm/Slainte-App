import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Category } from '@/lib/services/categoryService';

interface ProductFiltersProps {
  categories: Category[];
  filters: {
    categoryId: string;
    search: string;
    minPrice?: number;
    maxPrice?: number;
    onlyAvailable?: boolean;
  };
  onFilterChange: (filters: any) => void;
}

export default function ProductFilters({
  categories,
  filters,
  onFilterChange
}: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Actualizar filtros locales cuando cambian los props
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Manejar cambios en los filtros
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en el rango de precios
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
    setLocalFilters(prev => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1]
    }));
  };

  // Manejar cambios en el switch de disponibilidad
  const handleAvailabilityChange = (checked: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      onlyAvailable: checked
    }));
  };

  // Aplicar filtros
  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  // Limpiar filtros
  const clearFilters = () => {
    const resetFilters = {
      categoryId: '',
      search: '',
      minPrice: undefined,
      maxPrice: undefined,
      onlyAvailable: false
    };
    setLocalFilters(resetFilters);
    setPriceRange([0, 1000]);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Buscar
          </label>
          <input
            type="text"
            id="search"
            name="search"
            value={localFilters.search}
            onChange={handleFilterChange}
            placeholder="Buscar por nombre..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Categoría
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={localFilters.categoryId}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end space-x-2">
          <Button onClick={applyFilters} className="flex-1">
            Aplicar Filtros
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Limpiar
          </Button>
        </div>
      </div>

      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros avanzados</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
              {isAdvancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="price-range" className="block text-sm font-medium mb-2">Rango de precio</Label>
                <div className="px-2">
                  <Slider
                    id="price-range"
                    min={0}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
                    className="my-6"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="only-available"
                  checked={localFilters.onlyAvailable}
                  onCheckedChange={handleAvailabilityChange}
                />
                <Label htmlFor="only-available">Mostrar solo productos disponibles</Label>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
