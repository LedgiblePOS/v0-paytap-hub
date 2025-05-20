
import React from 'react';
import { render, screen } from '@testing-library/react';
import TransactionList from '@/components/Payments/TransactionList';
import { Transaction } from '@/components/Payments/TransactionsTab';

describe('TransactionList Component', () => {
  const mockTransactions: Transaction[] = [
    {
      id: 'tx-1234567890',
      created_at: new Date().toISOString(),
      amount: 49.99,
      status: 'COMPLETED',
      payment_method: 'CARD',
      merchant_id: 'merchant-1',
      reference: 'ref-123'
    },
    {
      id: 'tx-0987654321',
      created_at: new Date().toISOString(),
      amount: 29.99,
      status: 'PENDING',
      payment_method: 'TAP_TO_PAY',
      merchant_id: 'merchant-1',
      reference: 'ref-456'
    }
  ];

  test('renders transaction list with correct data', () => {
    render(<TransactionList transactions={mockTransactions} />);
    
    // Check for column headers
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Transaction ID')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Payment Method')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    
    // Check for transaction data
    expect(screen.getByText('$49.99')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    
    // Check for status badges
    const completedBadge = screen.getByText('Completed');
    const pendingBadge = screen.getByText('Pending');
    expect(completedBadge).toBeInTheDocument();
    expect(pendingBadge).toBeInTheDocument();
    
    // Check for payment methods
    expect(screen.getByText('CARD')).toBeInTheDocument();
    expect(screen.getByText('TAP TO PAY')).toBeInTheDocument();
  });

  test('renders empty state when no transactions provided', () => {
    render(<TransactionList transactions={[]} />);
    expect(screen.queryByText('Transaction ID')).toBeInTheDocument();
    // Should still show table headers but no transaction data
    expect(screen.queryByText('$49.99')).not.toBeInTheDocument();
  });
});
