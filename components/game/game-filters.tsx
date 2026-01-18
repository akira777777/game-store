"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RangeSlider } from "@/components/ui/slider";
import { Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// String arrays for SQLite compatibility (enums stored as strings)
const GENRES = [
  "ACTION",
  "ADVENTURE",
  "RPG",
  "STRATEGY",
  "SPORTS",
  "RACING",
  "SHOOTER",
  "SIMULATION",
  "INDIE",
  "PUZZLE",
] as const;
const PLATFORMS = [
  "PC",
  "PLAYSTATION",
  "XBOX",
  "NINTENDO_SWITCH",
  "MOBILE",
] as const;

type Genre = (typeof GENRES)[number];
type Platform = (typeof PLATFORMS)[number];

interface GameFiltersProps {
  genres?: string[];
  platforms?: string[];
}

export interface FilterState {
  search?: string;
  genre?: string | "all";
  platform?: string | "all";
  sortBy?: "price_asc" | "price_desc" | "newest" | "oldest";
  minPrice?: number;
  maxPrice?: number;
}

function GameFiltersContent({ genres = [], platforms = [] }: GameFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const getSortByValue = (): FilterState["sortBy"] => {
    const sortBy = searchParams.get("sortBy") || searchParams.get("sort");
    if (
      sortBy === "price_asc" ||
      sortBy === "price_desc" ||
      sortBy === "newest" ||
      sortBy === "oldest"
    ) {
      return sortBy;
    }
    return "newest";
  };

  const [filters, setFilters] = useState<FilterState>({
    genre: searchParams.get("genre") || "all",
    platform: searchParams.get("platform") || "all",
    sortBy: getSortByValue(),
    search: searchParams.get("search") || undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
  });
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const [isInitialMount, setIsInitialMount] = useState(true);

  useEffect(() => {
    setIsInitialMount(false);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput || undefined }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    // Skip on initial mount to prevent redirect on page load
    if (isInitialMount) return;

    const params = new URLSearchParams();

    if (filters.genre && filters.genre !== "all") {
      params.set("genre", filters.genre);
    }

    if (filters.platform && filters.platform !== "all") {
      params.set("platform", filters.platform);
    }

    if (filters.search) {
      params.set("search", filters.search);
    }

    if (filters.sortBy && filters.sortBy !== "newest") {
      params.set("sort", filters.sortBy);
    }

    if (filters.minPrice) {
      params.set("minPrice", filters.minPrice.toString());
    }

    if (filters.maxPrice) {
      params.set("maxPrice", filters.maxPrice.toString());
    }

    const newUrl = `/games?${params.toString()}`;
    const currentUrl = `/games?${searchParams.toString()}`;

    // Only push if URL actually changed
    if (newUrl !== currentUrl) {
      router.push(newUrl);
    }
  }, [filters, router, searchParams, isInitialMount]);

  const updateFilter = (
    key: keyof FilterState,
    value: string | number | undefined,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      genre: "all",
      platform: "all",
      sortBy: "newest",
      search: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
    router.push("/games");
    setIsInitialMount(false);
  };

  const hasActiveFilters =
    filters.genre !== "all" ||
    filters.platform !== "all" ||
    filters.search ||
    filters.minPrice ||
    filters.maxPrice;

  return (
    <div className="space-y-6 p-6 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" aria-hidden="true" />
          Фильтры
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2"
            aria-label="Сбросить все фильтры"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Сбросить
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Поиск</Label>
          <Input
            id="search"
            placeholder="Название игры..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="genre">Жанр</Label>
            <Select
              value={filters.genre || "all"}
              onValueChange={(value) => updateFilter("genre", value)}
            >
              <SelectTrigger id="genre">
                <SelectValue placeholder="Все жанры" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все жанры</SelectItem>
                {GENRES.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform">Платформа</Label>
            <Select
              value={filters.platform || "all"}
              onValueChange={(value) => updateFilter("platform", value)}
            >
              <SelectTrigger id="platform">
                <SelectValue placeholder="Все платформы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все платформы</SelectItem>
                {PLATFORMS.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort">Сортировка</Label>
          <Select
            value={filters.sortBy || "newest"}
            onValueChange={(value) =>
              updateFilter("sortBy", value as FilterState["sortBy"])
            }
          >
            <SelectTrigger id="sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Новинки</SelectItem>
              <SelectItem value="oldest">Старые</SelectItem>
              <SelectItem value="price_asc">Цена: по возрастанию</SelectItem>
              <SelectItem value="price_desc">Цена: по убыванию</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Диапазон цен</Label>
            <div className="px-2">
              <RangeSlider
                min={0}
                max={1000}
                step={1}
                value={[filters.minPrice || 0, filters.maxPrice || 1000]}
                onValueChange={([min, max]) => {
                  setFilters((prev) => ({
                    ...prev,
                    minPrice: min > 0 ? min : undefined,
                    maxPrice: max < 1000 ? max : undefined,
                  }));
                }}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${filters.minPrice || 0}</span>
              <span>${filters.maxPrice || 1000}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minPrice">Мин. цена ($)</Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="0"
                min="0"
                value={filters.minPrice || ""}
                onChange={(e) =>
                  updateFilter(
                    "minPrice",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPrice">Макс. цена ($)</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="1000"
                min="0"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  updateFilter(
                    "maxPrice",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {filters.genre !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Жанр: {filters.genre?.replace(/_/g, " ")}
              <button
                onClick={() => updateFilter("genre", "all")}
                className="ml-1 hover:text-destructive"
                aria-label={`Убрать фильтр по жанру: ${filters.genre}`}
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </Badge>
          )}
          {filters.platform !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Платформа: {filters.platform?.replace(/_/g, " ")}
              <button
                onClick={() => updateFilter("platform", "all")}
                className="ml-1 hover:text-destructive"
                aria-label={`Убрать фильтр по платформе: ${filters.platform}`}
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </Badge>
          )}
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Поиск: {filters.search}
              <button
                onClick={() => updateFilter("search", undefined)}
                className="ml-1 hover:text-destructive"
                aria-label={`Убрать поисковый запрос: ${filters.search}`}
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </Badge>
          )}
          {filters.minPrice && (
            <Badge variant="secondary" className="gap-1">
              От: ${filters.minPrice}
              <button
                onClick={() => updateFilter("minPrice", undefined)}
                className="ml-1 hover:text-destructive"
                aria-label={`Убрать фильтр минимальной цены: ${filters.minPrice}`}
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </Badge>
          )}
          {filters.maxPrice && (
            <Badge variant="secondary" className="gap-1">
              До: ${filters.maxPrice}
              <button
                onClick={() => updateFilter("maxPrice", undefined)}
                className="ml-1 hover:text-destructive"
                aria-label={`Убрать фильтр максимальной цены: ${filters.maxPrice}`}
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

export function GameFilters(props: GameFiltersProps) {
  return (
    <Suspense
      fallback={<div className="h-64 bg-muted rounded animate-pulse" />}
    >
      <GameFiltersContent {...props} />
    </Suspense>
  );
}
