
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Download, Filter, ChevronDown } from "lucide-react";
import React from "react";

interface AuditLogFiltersProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedAction: string | null;
  setSelectedAction: (value: string | null) => void;
  selectedResource: string | null;
  setSelectedResource: (value: string | null) => void;
  resources: string[];
  downloadCsv: () => void;
  filteredLogs: any[];
}

const AuditLogFilters = ({
  timeRange,
  setTimeRange,
  searchQuery,
  setSearchQuery,
  selectedAction,
  setSelectedAction,
  selectedResource,
  setSelectedResource,
  resources,
  downloadCsv,
  filteredLogs,
}: AuditLogFiltersProps) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search logs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Time Range Filter */}
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
          </SelectContent>
        </Select>

        {/* Action Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {selectedAction || "All Actions"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => setSelectedAction(null)}>
              All Actions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedAction("CREATE")}>
              Create
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedAction("UPDATE")}>
              Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedAction("DELETE")}>
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedAction("LOGIN")}>
              Login
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedAction("LOGOUT")}>
              Logout
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedAction("SETTINGS")}>
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Resource Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {selectedResource || "All Resources"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] max-h-[300px] overflow-auto">
            <DropdownMenuItem onClick={() => setSelectedResource(null)}>
              All Resources
            </DropdownMenuItem>
            {resources.map((resource) => (
              <DropdownMenuItem
                key={resource}
                onClick={() => setSelectedResource(resource)}
              >
                {resource}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Download Button */}
        <Button
          variant="outline"
          onClick={downloadCsv}
          disabled={filteredLogs.length === 0}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
      
      {/* Active Filters Display */}
      {(selectedAction || selectedResource) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedAction && (
            <div className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md flex items-center">
              Action: {selectedAction}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => setSelectedAction(null)}
              >
                &times;
              </Button>
            </div>
          )}
          {selectedResource && (
            <div className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md flex items-center">
              Resource: {selectedResource}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => setSelectedResource(null)}
              >
                &times;
              </Button>
            </div>
          )}
          <Button
            variant="link"
            size="sm"
            className="text-xs h-6"
            onClick={() => {
              setSelectedAction(null);
              setSelectedResource(null);
              setSearchQuery("");
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default AuditLogFilters;
