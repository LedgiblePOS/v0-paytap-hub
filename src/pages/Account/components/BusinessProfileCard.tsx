
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Building, Pencil } from 'lucide-react';

interface BusinessProfileCardProps {
  onEditClick: () => void;
}

const BusinessProfileCard: React.FC<BusinessProfileCardProps> = ({ onEditClick }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>
          Manage your business details and settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="rounded-lg bg-gray-100 aspect-square flex items-center justify-center">
              <Building className="h-16 w-16 text-gray-300" />
            </div>
            <div className="mt-2 text-center">
              <Button variant="outline" size="sm" className="mt-2">
                <Pencil className="h-3 w-3 mr-1" />
                Upload Logo
              </Button>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-semibold">Business Name</h3>
              <p className="text-gray-500">Your Business</p>
            </div>
            <div>
              <h3 className="font-semibold">Contact Email</h3>
              <p className="text-gray-500">business@example.com</p>
            </div>
            <Button onClick={onEditClick}>
              Update Business Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessProfileCard;
