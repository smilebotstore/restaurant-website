import { MapPin, MessageCircle, Navigation } from "lucide-react";
import { restaurant } from "@/data/restaurant";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-maroon-900 py-12 text-cream-50">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-xl font-bold">{restaurant.name}</p>
            <p className="mt-2 max-w-xs text-sm text-cream-50/70">
              Solusi untuk lapar mu — nasi goreng dan mie goreng dengan cita
              rasa autentik.
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <p className="flex items-start gap-2 text-cream-50/80">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold-400" />
              {restaurant.address}
            </p>
            <p className="flex items-center gap-2 text-cream-50/80">
              <MessageCircle size={16} className="shrink-0 text-gold-400" />
              {restaurant.whatsappNumber}
            </p>
            <a
              href={restaurant.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-semibold text-gold-400 hover:text-gold-500"
            >
              <Navigation size={16} />
              Buka Google Maps
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-cream-50/10 pt-6 text-center text-xs text-cream-50/50">
          &copy; {year} {restaurant.name}. Semua hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
