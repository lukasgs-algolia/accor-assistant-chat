import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";

type HotelCardProps = {
  hotel: {
    objectID?: string;
    brandLabel?: string;
    name?: string;
    mediaCatalog?: {
      "1024x768"?: string;
    };
    factsheetUrl?: string;
    city?: string;
    country?: string;
    stars?: number;
    reviewScore?: number;
  };
};

export function HotelCard({ hotel }: HotelCardProps) {
  const imageUrl = hotel.mediaCatalog?.["1024x768"] || "/placeholder-image.png";
  const factSheetUrl = hotel.factsheetUrl;
  const hotelBrand = hotel.brandLabel || "Accor";
  const hotelName = hotel.name;
  const location = hotel.city;
  const stars = hotel.stars || 0;
  return (
    <a
      href={factSheetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
      title={hotelName}
    >
      <Card className="overflow-hidden border-0 bg-card shadow-sm transition-shadow duration-200 hover:shadow-md cursor-pointer">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={imageUrl}
            alt={hotelName}
            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
          />
          {stars > 0 && (
            <div className="absolute top-1.5 right-1.5 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] font-semibold">{stars}</span>
            </div>
          )}
        </div>
        <CardContent className="p-2">
          <h3 className="font-semibold text-[10px] line-clamp-1 mb-0.5">{hotelName}</h3>
          {location && (
            <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <MapPin className="w-2.5 h-2.5" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </a>
  );
}