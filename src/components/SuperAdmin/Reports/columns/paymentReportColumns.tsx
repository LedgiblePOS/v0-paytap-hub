
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";

type PaymentTransaction = {
  id: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  merchantName: string;
  subscriptionTier: string;
};

export const columns: ColumnDef<PaymentTransaction>[] = [
  {
    accessorKey: "merchantName",
    header: "Merchant",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.paymentMethod}</Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === "COMPLETED"
              ? "success"
              : status === "FAILED"
              ? "destructive"
              : "outline"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: "subscriptionTier",
    header: "Subscription",
    cell: ({ row }) => <Badge variant="secondary">{row.original.subscriptionTier}</Badge>,
  },
];
