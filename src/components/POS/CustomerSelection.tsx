import React from 'react';

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type?: 'individual' | 'business';
}

export interface CustomerSelectionProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer | null) => void;
  selectedCustomer: Customer | null;
  searchQuery?: string; // Added missing property
  onSearchChange?: (query: string) => void;
}

const CustomerSelection: React.FC<CustomerSelectionProps> = ({
  customers,
  onSelectCustomer,
  selectedCustomer,
  searchQuery = '', // Default value
  onSearchChange = () => {} // Default no-op function
}) => {
  const handleCustomerSelect = (customer: Customer | null) => {
    onSelectCustomer(customer);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="customer-search" className="block text-sm font-medium text-gray-700">
          Search Customers:
        </label>
        <input
          type="text"
          id="customer-search"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter customer name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Select Customer:
        </label>
        <ul className="mt-2 divide-y divide-gray-200 border border-gray-300 rounded-md">
          {filteredCustomers.map(customer => (
            <li key={customer.id} className="py-2 px-4">
              <button
                onClick={() => handleCustomerSelect(customer)}
                className={`w-full text-left ${
                  selectedCustomer?.id === customer.id
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-700'
                }`}
              >
                {customer.name} ({customer.email || 'No Email'})
              </button>
            </li>
          ))}
          {filteredCustomers.length === 0 && (
            <li className="py-2 px-4 text-gray-500">No customers found.</li>
          )}
          <li className="py-2 px-4">
            <button
              onClick={() => handleCustomerSelect(null)}
              className="w-full text-left text-gray-500"
            >
              Clear Customer
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CustomerSelection;
