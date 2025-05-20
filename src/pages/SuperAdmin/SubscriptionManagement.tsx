
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, PlusCircle } from "lucide-react";
import { SubscriptionPlanModel } from "@/types";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";

// Import subscription management components
import SubscriptionPlanForm from "./components/subscription-management/SubscriptionPlanForm";
import SubscriptionPlanCard from "./components/subscription-management/SubscriptionPlanCard";
import EmptySubscriptionPlans from "./components/subscription-management/EmptySubscriptionPlans";

const SubscriptionManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  
  const {
    subscriptionPlans,
    isLoading,
    error,
    createPlan,
    updatePlan,
    deletePlan,
    isSubmitting,
    editingPlan,
    startEditingPlan,
    cancelEditing
  } = useSubscriptionPlans(true); // Include inactive plans

  const handleCreateClick = () => {
    cancelEditing();
    setFormMode('create');
    setIsDialogOpen(true);
  };

  const handleEditClick = (plan: SubscriptionPlanModel) => {
    startEditingPlan(plan);
    setFormMode('edit');
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      cancelEditing();
    }, 300); // Wait for dialog animation
  };

  const handleSubmit = async (values: any) => {
    try {
      if (formMode === 'create') {
        await createPlan(values);
      } else if (editingPlan) {
        await updatePlan({ id: editingPlan.id, plan: values });
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!editingPlan) return;
    
    try {
      await deletePlan(editingPlan.id);
      setDeleteDialogOpen(false);
      handleCloseDialog();
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>Manage subscription plans for merchants</CardDescription>
            </div>
            <Button onClick={handleCreateClick} disabled={isLoading}>
              <PlusCircle className="h-4 w-4 mr-1" />
              New Plan
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading subscription plans...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error loading subscription plans. Please try again.
            </div>
          ) : subscriptionPlans.length === 0 ? (
            <EmptySubscriptionPlans onCreateClick={handleCreateClick} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <SubscriptionPlanCard 
                  key={plan.id} 
                  plan={plan} 
                  onEdit={handleEditClick} 
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'edit' ? "Edit Subscription Plan" : "Create Subscription Plan"}
            </DialogTitle>
          </DialogHeader>
          <SubscriptionPlanForm
            initialValues={editingPlan || undefined}
            onSubmit={handleSubmit}
            onDelete={formMode === 'edit' ? handleDeleteClick : undefined}
            onCancel={handleCloseDialog}
            isSubmitting={isSubmitting}
            mode={formMode}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subscription Plan</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this subscription plan? This action cannot be undone.</p>
            {editingPlan && (
              <p className="font-semibold mt-2">Plan: {editingPlan.name}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Plan"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionManagement;
