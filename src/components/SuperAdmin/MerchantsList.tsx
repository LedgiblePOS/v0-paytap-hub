import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { MerchantModel } from '@/types/merchant';

interface MerchantsListProps {
  merchants: MerchantModel[];
  onDelete: (id: string) => void;
  onEdit: (merchant: MerchantModel) => void;
}

const MerchantsList: React.FC<MerchantsListProps> = ({ 
  merchants,
  onDelete,
  onEdit
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');

  const columns: ColumnDef<MerchantModel>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'businessName',
      header: 'Business Name',
    },
    {
      accessorKey: 'businessEmail',
      header: 'Business Email',
    },
    {
      accessorKey: 'country',
      header: 'Country',
    },
    {
      accessorKey: 'subscriptionTier',
      header: 'Subscription Tier',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const merchant = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigate(`/superadmin/merchants/${merchant.id}`);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteMerchant(merchant)}
                className="text-red-500"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: merchants.filter((merchant) =>
      merchant.businessName.toLowerCase().includes(search.toLowerCase())
    ),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDeleteMerchant = (merchant: MerchantModel) => {
    // Safely handle cases where merchant might be just a string ID
    const merchantId = typeof merchant === 'string' ? merchant : merchant.id;
    
    if (!merchantId) {
      toast({
        title: 'Error',
        description: 'Merchant ID is missing.',
        variant: 'destructive',
      });
      return;
    }

    onDelete(merchantId);
    toast({
      title: 'Success',
      description: 'Merchant deleted successfully.',
    });
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          type="text"
          placeholder="Search by business name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MerchantsList;
