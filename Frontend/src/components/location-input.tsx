import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldError } from "react-hook-form";
import { Textarea } from "@/components/ui";
import { useToast } from "@/hooks/use-toast";

export function LocationInput({ 
  name, 
  placeholder,
  register,
  setValue,
  watch,
  error,
  onLocationDetected
}: { 
  name: string; 
  placeholder?: string;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  error?: any;
  onLocationDetected?: (lat: number, lon: number) => void;
}) {
  const value = watch(name) as string;
  const { toast } = useToast();

  const [suggestions, setSuggestions] = useState<Array<{ place_id: number; display_name: string; lat: string; lon: string }>>([]);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (!value || value.length < 5 || !showSuggestions) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=in&addressdetails=1&limit=5`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [value, showSuggestions]);

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation not supported", description: "Your browser does not support location features.", variant: "destructive" });
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (response.ok) {
            const data = await response.json();
            setValue(name, data.display_name, { shouldValidate: true });
            if (onLocationDetected) {
              onLocationDetected(latitude, longitude);
            }
            setShowSuggestions(false);
            toast({ title: "Location found", description: "Your address has been updated successfully." });
          }
        } catch (error) {
          toast({ title: "Error finding address", description: "Could not retrieve address from coordinates.", variant: "destructive" });
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (error) => {
        setIsFetchingLocation(false);
        toast({ title: "Permission denied", description: "Please allow location access to use this feature.", variant: "destructive" });
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <Textarea
          placeholder={placeholder}
          className="pr-12"
          {...register(name)}
          onChange={(e) => {
            register(name).onChange(e);
            setShowSuggestions(true);
          }}
        />
        <button
          type="button"
          onClick={handleFetchLocation}
          disabled={isFetchingLocation}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
          title="Fetch live location"
        >
          {isFetchingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full z-10 mt-2 w-full overflow-hidden rounded-xl border border-line bg-panel shadow-lg">
          <ul className="max-h-[240px] overflow-auto py-2">
            {suggestions.map((suggestion) => (
              <li key={suggestion.place_id}>
                <button
                  type="button"
                  className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-background/80"
                  onClick={() => {
                    setValue(name, suggestion.display_name, { shouldValidate: true });
                    if (onLocationDetected && suggestion.lat && suggestion.lon) {
                      onLocationDetected(parseFloat(suggestion.lat), parseFloat(suggestion.lon));
                    }
                    setShowSuggestions(false);
                  }}
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-ink">{suggestion.display_name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {error ? <p className="mt-2 text-sm text-red-700">{error.message as string}</p> : null}
    </div>
  );
}
