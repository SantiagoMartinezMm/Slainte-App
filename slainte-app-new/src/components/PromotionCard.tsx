import React from "react";

interface PromotionCardProps {
  title: string;
  discount: string;
  image: string;
}

export default function PromotionCard({
  title,
  discount,
  image,
}: PromotionCardProps) {
  return (
    <div className="relative rounded-xl overflow-hidden">
      <img src={image} alt={title} className="w-full h-32 object-cover" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
        <h3 className="text-white font-bold">{title}</h3>
        <p className="text-primary text-xl font-bold">{discount}% OFF</p>
      </div>
    </div>
  );
}
