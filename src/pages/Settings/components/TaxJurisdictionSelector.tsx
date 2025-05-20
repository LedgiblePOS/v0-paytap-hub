
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { TaxJurisdiction, taxJurisdictions } from "@/services/tax/taxJurisdictions";

interface TaxJurisdictionSelectorProps {
  value: string;
  onSelect: (jurisdiction: TaxJurisdiction) => void;
}

const TaxJurisdictionSelector: React.FC<TaxJurisdictionSelectorProps> = ({ 
  value, 
  onSelect 
}) => {
  const [selectedId, setSelectedId] = useState<string>(value || "custom");
  
  // Filter out any invalid jurisdictions before use
  const validJurisdictions = taxJurisdictions.filter(j => 
    j && j.id && typeof j.id === 'string' && j.id.trim() !== ""
  );
  
  const handleSelect = (id: string) => {
    if (!id) return; // Guard against empty values
    setSelectedId(id);
    const selectedJurisdiction = validJurisdictions.find(j => j.id === id);
    if (selectedJurisdiction) {
      onSelect(selectedJurisdiction);
    }
  };

  // Group jurisdictions by country
  const jurisdictionsByCountry: Record<string, TaxJurisdiction[]> = validJurisdictions
    .reduce((acc, jurisdiction) => {
      const { country } = jurisdiction;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(jurisdiction);
      return acc;
    }, {} as Record<string, TaxJurisdiction[]>);

  useEffect(() => {
    if (value) {
      setSelectedId(value);
    }
  }, [value]);

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedId} onValueChange={handleSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select tax jurisdiction" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(jurisdictionsByCountry).map((country) => (
            <SelectGroup key={country}>
              <SelectLabel>{country}</SelectLabel>
              {jurisdictionsByCountry[country].map((jurisdiction) => (
                // Only render SelectItem for valid jurisdiction IDs
                jurisdiction.id && jurisdiction.id.trim() !== "" ? (
                  <SelectItem key={jurisdiction.id} value={jurisdiction.id}>
                    {jurisdiction.name} ({jurisdiction.salesTaxRate}%)
                  </SelectItem>
                ) : null
              ))}
            </SelectGroup>
          ))}
          <SelectGroup>
            <SelectLabel>Other</SelectLabel>
            <SelectItem value="custom">Custom rates</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>Select a region to automatically apply common tax rates, or choose Custom to enter your own rates.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default TaxJurisdictionSelector;
