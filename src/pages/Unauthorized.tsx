
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldOff, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Log for debugging
  console.log("[Unauthorized] Rendering with user:", {
    exists: !!user,
    role: user?.role,
    timestamp: new Date().toISOString()
  });
  
  // Auto-redirect after a short delay if user is logged in
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        goHome();
      }, 5000); // Wait 5 seconds before auto-redirecting
      
      return () => clearTimeout(timer);
    }
  }, [user]);
  
  const goBack = () => {
    navigate(-1);
  };
  
  const goHome = () => {
    if (user?.role === UserRole.SUPER_ADMIN) {
      navigate("/super-admin");
    } else if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };
  
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-red-50">
          <div className="flex items-center space-x-2">
            <ShieldOff className="h-6 w-6 text-red-500" />
            <CardTitle className="text-red-700">Access Denied</CardTitle>
          </div>
          <CardDescription>
            You don't have permission to access this resource
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <AlertTriangle className="h-16 w-16 text-amber-500" />
            <p className="text-gray-700">
              {user ? (
                <>Your current role <span className="font-medium">{user.role}</span> doesn't have the necessary permissions.</>
              ) : (
                <>You need to be logged in with the appropriate permissions.</>
              )}
            </p>
            <p className="text-sm text-gray-500">
              If you believe this is an error, please contact your administrator.
            </p>
            {user && (
              <p className="text-sm text-blue-600">
                Redirecting to home page in a few seconds...
              </p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={goBack} className="flex items-center gap-2">
            Go Back
          </Button>
          <Button onClick={goHome} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Unauthorized;
