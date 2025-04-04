"use client";

import React from "react";

interface DrinkCardProps {
  name: string;
  description: string;
  price: number;
  image: string;
  alcohol: string;
}

export default function DrinkCard({
  name,
  description,
  price,
  image,
  alcohol,
}: DrinkCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="relative h-48">
        <img src={image} alt={name} className="w-full h-full object-cover" />

        <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-full text-xs text-white">
          {alcohol}%
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
        <p className="text-gray-300 text-sm mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-primary text-xl font-bold">${price}</span>
          <button className="bg-primary text-secondary px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Ordenar
          </button>
        </div>
      </div>
    </div>
  );
}
