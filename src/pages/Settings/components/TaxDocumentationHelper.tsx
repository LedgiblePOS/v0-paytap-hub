
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Link as LinkIcon, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const TaxDocumentationHelper: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <span>Tax Documentation & Resources</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="understanding-taxes">
            <AccordionTrigger>Understanding Tax Rates</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-sm">
                <p>
                  <strong>Sales Tax Rate:</strong> This is the combined total tax rate applied
                  to taxable sales. It's usually the sum of state and local tax rates.
                </p>
                <p>
                  <strong>State Tax Rate:</strong> The portion of sales tax collected
                  for the state government.
                </p>
                <p>
                  <strong>Local Tax Rate:</strong> Additional taxes imposed by city,
                  county, or other local jurisdictions.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <LinkIcon className="h-4 w-4" />
                  <Link 
                    to="/tax-reporting" 
                    className="text-primary hover:underline"
                  >
                    View your tax reports
                  </Link>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="jurisdiction-info">
            <AccordionTrigger>Tax Jurisdictions</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-sm">
                <p>
                  Tax jurisdictions determine where you need to collect and remit sales tax.
                  Your business may have nexus (tax obligations) in multiple jurisdictions.
                </p>
                <p>
                  <strong>Economic Nexus:</strong> Many states now require you to collect
                  sales tax if you exceed certain sales thresholds, even without physical presence.
                </p>
                <p>
                  <strong>Physical Nexus:</strong> Having a physical presence (office, employees,
                  inventory) in a state typically creates a tax obligation.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <HelpCircle className="h-4 w-4" />
                  <span className="text-muted-foreground">
                    We recommend consulting with a tax professional for your specific situation.
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tax-reporting">
            <AccordionTrigger>Tax Reporting Requirements</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-sm">
                <p>
                  Most jurisdictions require regular tax filings, typically:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Monthly (for high-volume sellers)</li>
                  <li>Quarterly (most common)</li>
                  <li>Annually (for low-volume sellers)</li>
                </ul>
                <p>
                  Our tax reporting module automatically tracks your collected taxes
                  and helps you prepare your filings.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <LinkIcon className="h-4 w-4" />
                  <Link 
                    to="/settings/tax-reporting" 
                    className="text-primary hover:underline"
                  >
                    Configure tax reporting settings
                  </Link>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default TaxDocumentationHelper;
