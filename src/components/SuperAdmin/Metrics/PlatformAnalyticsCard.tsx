
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PlatformAnalyticsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const PlatformAnalyticsCard: React.FC<PlatformAnalyticsCardProps> = ({
  title,
  description,
  children,
  className = "",
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default PlatformAnalyticsCard;
