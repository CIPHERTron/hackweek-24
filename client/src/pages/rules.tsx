"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { Checkbox } from "~/components/ui/checkbox";
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";
import useLocalStorage from "~/hooks/useLocalStorage";

const rules = [
  {
    id: "RunTestsRule",
    name: "Unit Tests",
    description:
      "Ensure that unit tests are executed. This can be identified by the presence of a RunTest step in the CI pipeline.",
  },
  {
    id: "SecurityScanRule",
    name: "Security Scans",
    description:
      "Perform security scans during the CI process to identify and mitigate vulnerabilities in the codebase.",
  },
  {
    id: "DynamicProvisioningRule",
    name: "Dynamic Infrastructure Provisioning",
    description:
      "Provision infrastructure dynamically based on the requirements of the application using tools like Terraform or CloudFormation.",
  },
  {
    id: "ApprovalBeforeProdRule",
    name: "Approval Gates Before Deploying to Prod",
    description:
      "Implement approval gates that require manual or automated approvals before deploying changes to the production environment. This should be a separate stage before the production environment.",
  },
  {
    id: "IncidentManagementRule",
    name: "Incident Management Integration",
    description:
      "Integrate with incident management tools like JIRA or ServiceNow for handling incidents in the production environment.",
  },
  {
    id: "ContinuousVerificationRule",
    name: "Continuous Verification After Deploying to Production",
    description:
      "Perform continuous verification after deploying to the production stage to ensure the application is working as expected and to detect any issues early.",
  },
  {
    id: "ConfigureNotificationRule",
    name: "Pipeline Notifications",
    description:
      "Set up notifications for the pipeline to inform stakeholders of the pipeline status, successes, and failures.",
  },
  {
    id: "RollbackStepRule",
    name: "Rollback Template for Production Stage",
    description:
      "Create and maintain a rollback template for the production stage to quickly revert changes in case of deployment failures or critical issues.",
  },
];

type RulesState = {
  [id: string]: boolean;
};

const initialRulesState = {
  ApprovalBeforeProdRule: false,
  ContinuousVerificationRule: false,
  DynamicProvisioningRule: false,
  IncidentManagementRule: false,
  ConfigureNotificationRule: false,
  RollbackStepRule: false,
  RunTestsRule: false,
  SecurityScanRule: false,
};

export default function Rules() {
  const { toast } = useToast();
  const [rulesLocalStorge, setLocalStorageRules] = useLocalStorage(
    "rulesStateKey",
    initialRulesState
  );
  const [rulesState, setRulesState] = useState<any>(rulesLocalStorge);
  const handleCheckboxChange = (id: string, e: any) => {
    e.stopPropagation();
    const updatedObj = { ...rulesState, [id]: !rulesState[id] };
    setRulesState(updatedObj);
  };

  const handleSaveRules = () => {
    setLocalStorageRules(rulesState);
    toast({
      variant: "outline",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="grid flex-1 items-start gap-4 ml-14 mt-8 p-8 sm:px-6 sm:py-0 md:gap-8">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Rules</CardTitle>
            <CardDescription>Configure Rules</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {rules.map(({ id, name, description }) => {
                return (
                  <AccordionItem value={id} key={id}>
                    <AccordionTrigger className="flex justify-start gap-4">
                      <Checkbox
                        value={id}
                        name={id}
                        id={id}
                        onClick={(e) => handleCheckboxChange(id, e)}
                        checked={rulesState[id]}
                      />
                      <span>{name}</span>
                    </AccordionTrigger>
                    <AccordionContent className="ml-9">
                      {description}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>

          <CardFooter>
            <div className="text-xs text-muted-foreground">
              <Button className="ml-auto" onClick={() => {
                setLocalStorageRules(rulesState);
                toast({
                  variant: "destructive",
                  title: "Rules Configuration Set",
                  description: "Selected rules configured successfully!.",
                  action: <ToastAction altText="GoTo Dashboard"><Link href="/dashboard">View Dashboard</Link></ToastAction>,
                });
              }}>
                Save Rules
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
