"use client";

import React from "react";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
            activeCategory === category
              ? "bg-primary text-secondary font-bold"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
