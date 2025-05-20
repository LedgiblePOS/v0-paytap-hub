// Import the correct types
import { MerchantEntity, SimplifiedMerchantEntity } from '@/types/merchant';
import { useDebounce } from '@/hooks/useDebounce'; // Fix import path
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Define the data structure for the table
interface MerchantData {
  id: string;
  businessName: string;
  businessEmail?: string;
  createdAt: string;
}

// Fix the Pagination props interface if needed
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

// Update the Pagination component to accept totalItems as totalPages * pageSize
const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  pageSize, 
  onPageChange 
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="join">
      {pageNumbers.map(page => (
        <button 
          key={page}
          className={`join-item btn ${currentPage === page ? 'btn-active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

const MerchantsList = () => {
  const [merchants, setMerchants] = useState<MerchantData[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  // Mock function to fetch merchants (replace with your actual API call)
  const fetchMerchants = useCallback(async () => {
    // Simulate API call
    const mockMerchants: MerchantData[] = Array.from({ length: 50 }, (_, i) => ({
      id: `merchant-${i + 1}`,
      businessName: `Merchant ${i + 1}`,
      businessEmail: `merchant${i + 1}@example.com`,
      createdAt: new Date().toLocaleDateString(),
    }));

    setMerchants(mockMerchants.slice((currentPage - 1) * pageSize, currentPage * pageSize));
    setTotalPages(Math.ceil(50 / pageSize));
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Component render section
  return (
    <div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search merchants..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <ScrollArea>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Business Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {merchants.map((merchant) => (
              <TableRow key={merchant.id}>
                <TableCell className="font-medium">{merchant.id}</TableCell>
                <TableCell>{merchant.businessName}</TableCell>
                <TableCell>{merchant.businessEmail}</TableCell>
                <TableCell>{merchant.createdAt}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    
      {/* Update the Pagination component props */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default MerchantsList;
