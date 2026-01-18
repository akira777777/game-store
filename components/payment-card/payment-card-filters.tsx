"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface PaymentCardFiltersProps {
  cardTypes: string[];
  regions: string[];
  currentCardType?: string;
  currentRegion?: string;
}

function PaymentCardFiltersContent({
  cardTypes,
  regions,
  currentCardType,
  currentRegion,
}: PaymentCardFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset to first page when filtering
    router.push(`/payment-cards?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-medium mb-2 block">Тип карты</label>
        <Select
          value={currentCardType || ""}
          onValueChange={(value) => updateFilter("cardType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Все типы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Все типы</SelectItem>
            {cardTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-medium mb-2 block">Регион</label>
        <Select
          value={currentRegion || ""}
          onValueChange={(value) => updateFilter("region", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Все регионы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Все регионы</SelectItem>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(currentCardType || currentRegion) && (
        <Button variant="outline" onClick={() => router.push("/payment-cards")}>
          Сбросить фильтры
        </Button>
      )}
    </div>
  );
}

export function PaymentCardFilters(props: PaymentCardFiltersProps) {
  return (
    <Suspense
      fallback={<div className="h-10 bg-muted rounded animate-pulse" />}
    >
      <PaymentCardFiltersContent {...props} />
    </Suspense>
  );
}
