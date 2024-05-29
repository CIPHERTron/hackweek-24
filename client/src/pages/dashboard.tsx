import Image from "next/image";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import React, { PureComponent, act, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useTheme } from "next-themes";
import PieChartComponent from "~/components/PieChartComponent";
import useLocalStorage from "~/hooks/useLocalStorage";

interface Rule {
  ApprovalBeforeProdRule: boolean;
  ContinuousVerificationRule: boolean;
  DynamicProvisioningRule: boolean;
  IncidentManagementRule: boolean;
  ConfigureNotificationRule: boolean;
  RollbackStepRule: boolean;
  RunTestsRule: boolean;
  SecurityScanRule: boolean;
}

interface Pipeline {
  pipeline: string;
  score: number;
  rules: Rule;
}

interface Project {
  projectScore: number;
  pipelines: Pipeline[];
}

interface Org {
  orgScore: number;
  projects: { [key: string]: Project };
}

interface ProdPipelinesScanData {
  [key: string]: Org | undefined | any;
}

interface EmptyProject {
  org: string;
  project: string;
}

interface NonProdPipelines {
  org: string;
  project: string;
  pipeline: string;
}

interface ResponseData {
  totalPipelines: number;
  totalProjects: number;
  totalOrgs: number;
  totalEmptyProjects: number;
  emptyProjects: EmptyProject[];
  nonProdPipelines: NonProdPipelines[];
  prodPipelinesScanData: ProdPipelinesScanData;
}

export default function Dashboard() {
  const [scannedState, setScannedData] = useState<any>();
  const [emptyProjects, setEmptyProjects] = useState<
    EmptyProject[] | undefined
  >([]);
  const [nonProdData, setNonProdData] = useState<
    NonProdPipelines[] | undefined
  >([]);
  const [prodScanData, setProdScanData] = useState<any>();
  const [barChartData, setBarChartData] = useState<any>([]);
  const [rulesLocalStorage] = useLocalStorage("rulesStateKey", {});
  const rulesToBeSent: any = [];
  Object.keys(rulesLocalStorage).map(r => {
    if(rulesLocalStorage[r]) {
      rulesToBeSent.push(r)
    }
  });

  useEffect(() => {
    const fetchScannedData = () => {
      try {
        fetch("http://localhost:4567/scan-account", {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rulesToBeSent)
        })
          .then((data) => data.json())
          .then((res) => setScannedData(res));
      } catch (error) {
        console.log(error);
      }
    };
    fetchScannedData();
  }, []);

  useEffect(() => {
    setEmptyProjects(scannedState?.emptyProjects);
    setNonProdData(scannedState?.nonProdPipelines);
    setProdScanData(scannedState?.prodPipelinesScanData);
  }, [scannedState]);

  useEffect(() => {
    const orgsArr: { [x: string]: any }[] = [];
    if (prodScanData) {
      Object.keys(prodScanData).forEach((x) => {
        const tmp = {
          name: x,
          orgScore: prodScanData[x].orgScore,
          amt: prodScanData[x].orgScore,
        };
        if (tmp.orgScore >= 50) orgsArr.push(tmp);
      });
    }
    const sortedData = [...orgsArr].sort((a, b) => b.orgScore - a.orgScore);
    setBarChartData([...sortedData]);
  }, [prodScanData]);

  const pieChartEmptyProject = [
    {
      name: "with Pipeline Projects",
      value: scannedState?.totalProjects,
    },
    { name: "0 Pipeline Projects", value: scannedState?.totalEmptyProjects },
  ];

  const pieChartZeroDeployment = [
    { name: "with prod deployment", value: scannedState?.totalProjects },
    { name: "with 0 deployment", value: scannedState?.nonProdPipelines.length },
  ];

  const adoptionStatus = {
    green: "#4EC851",
    red: "#ff5252",
    yellow: "#FAFA33",
  };

  const [activeIndex, setActiveIndex] = useState(0);
  // console.log(activeIndex);

  const handleClick = (data: any, index: number) => {
    setActiveIndex(index);
  };

  const { theme } = useTheme();

  const activeItem = barChartData[activeIndex];

  const status = "red";
  const rulesMap: any = {
    ApprovalBeforeProdRule: "Approval",
    ContinuousVerificationRule: "CV",
    DynamicProvisioningRule: "Provision",
    IncidentManagementRule: "Incident",
    ConfigureNotificationRule: "Notification",
    RollbackStepRule: "Rollback",
    RunTestsRule: "Tests",
    SecurityScanRule: "Scan",
  };
  let rulesArrayCol: any = [];
  if (prodScanData) {
    const orgKey = Object.keys(prodScanData)[0];
    const projectKey = Object.keys(prodScanData[orgKey].projects)[0];
    rulesArrayCol = Object.keys(
      prodScanData[orgKey].projects[projectKey].pipelines[0].rules
    );
  }

  const utility = (projectObj: any, projectId: any) => {
    const pipelines = projectObj.pipelines;
    const pipelinesLen = pipelines.length;
    const globalRules: any = {};
    const dynamicRules = pipelines[0].rules;
    Object.keys(dynamicRules).forEach((r) => (globalRules[r] = 0));
    // console.log(globalRules);

    pipelines.forEach((p: any) => {
      const localRules = p.rules;

      Object.keys(localRules).forEach((r) => {
        if (localRules[r]) {
          globalRules[r] += 10;
        }
      });
    });

    for (let rule in globalRules) {
      globalRules[rule] = Math.round(
        ((globalRules[rule] / pipelinesLen) * 100) / 100
      );
    }

    return { project: projectId, ...globalRules };
  };

  // console.log("finalResult", result);

  if (prodScanData) {
    const result: any = {};

    const orgs = Object.keys(prodScanData);

    orgs.forEach((org) => {
      result[org] = [];
    });

    orgs.forEach((org) => {
      const projectObj = prodScanData[org].projects;

      const projKeys = Object.keys(projectObj);

      projKeys.forEach((projKey) => {
        const proj = projectObj[projKey];
        const ruleScoreAtProject = utility(proj, projKey);

        result[org].push(ruleScoreAtProject);
      });
    });

    let currentOrg = barChartData[activeIndex]?.name;
    // console.log(barChartData);

    return (
      <div className="grid gap-4 grid-flow-row ml-7 p-8 min-h-screen w-content flex-col bg-muted/40">
        <div className="grid grid-cols-4 gap-4 px-7">
          <Card className="col-span-1 px-2 py-2">
            <CardHeader>
              <CardTitle className="flex gap-5 justify-around">
                <div className="text-base">Compliant Rules Enforced</div>
                <div>{rulesArrayCol.length}</div>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="px-2 py-2">
            <CardHeader>
              <CardTitle className="flex gap-5 justify-around">
                <div className="text-base">Total Organisations</div>
                <div>{scannedState.totalOrgs}</div>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className=" px-2 py-2">
            <CardHeader>
              <CardTitle className="flex gap-5 justify-around">
                <div className="text-base">% of compliant Organisation</div>
                <div>
                  {(barChartData.length / scannedState.totalOrgs) * 100}
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card
            className=" px-2 py-2"
            style={{ borderColor: "#FFBF00", backgroundColor: "#FFBF00" }}
          >
            <CardHeader>
              <CardTitle className="flex gap-5 justify-around">
                <div className={`text-base `}>Deployment Maturity</div>
                <div>Yellow</div>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <main className="grid grid-rows-3 grid-flow-col gap-4 sm:px-6 sm:py-0 md:gap-8">
          <Card
            x-chunk="dashboard-06-chunk-0"
            className="row-span-3 col-span-8"
            style={{ height: "fit-content" }}
          >
            <CardHeader>
              <CardTitle>Org Leadership Board (score &gt; 50)</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-20">
              <div style={{ width: "100%" }}>
                <ResponsiveContainer width="90%" height={150}>
                  <BarChart width={110} height={80} data={barChartData}>
                    <Bar dataKey="orgScore" onClick={handleClick}>
                      {barChartData.map((index: number, id: any) => (
                        <Cell
                          cursor="pointer"
                          fill={
                            id === activeIndex
                              ? "#4FACDF"
                              : theme == "dark"
                                ? "#4DC851"
                                : "#4DC851"
                          }
                          key={`cell-${index}`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="content">{`${activeItem?.name} score: ${activeItem?.orgScore}`}</p>
              </div>
              <div style={{ width: "100%" }}>
                <Card
                  x-chunk="dashboard-06-chunk-0"
                  className="col-span-2"
                  style={{ height: "fit-content" }}
                >
                  <CardHeader>
                    <CardTitle className="flex gap-5 justify-between">
                      <div>
                        {currentOrg}{" "}
                        <span className="text-primary"> Org Insights</span>
                      </div>
                      <div
                        className="border border-blue-500 rounded-lg px-4 py-1 "
                        style={{ fontSize: "15px" }}
                      >
                        score: <span>{activeItem?.orgScore}</span>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Analyze orgs at a granular level
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Project</TableHead>
                          {[...rulesArrayCol].map((rule) => (
                            <TableHead>{rulesMap[rule]}</TableHead>
                          ))}
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result[currentOrg]?.map((x: any) => {
                          const objKeys = Object.keys(x);

                          let total = 0;
                          objKeys.forEach((n) => {
                            if (!isNaN(x[n])) {
                              total += x[n];
                            }
                          });

                          return (
                            <TableRow key={x.project}>
                              {objKeys.map((k) => (
                                <TableCell>{x[k]}</TableCell>
                              ))}
                              <TableCell>{total}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          <Card
            x-chunk="dashboard-06-chunk-0"
            className="col-span-1"
            style={{ height: "fit-content" }}
            key={"zeroPipeline"}
          >
            <CardHeader>
              <CardTitle>Projects with zero production deployments</CardTitle>
              <CardDescription>
                Analyze projects with zero production deployments
              </CardDescription>
            </CardHeader>
            <CardContent className="flex">
              <PieChartComponent pieChartData={pieChartZeroDeployment} />
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        style={{ color: "#ff5252" }}
                        className="w-[90px]"
                      >
                        Organisation
                      </TableHead>
                      <TableHead style={{ color: "#ff5252" }}>
                        Project
                      </TableHead>
                      <TableHead
                        style={{ color: "#ff5252" }}
                        className="text-right"
                      >
                        Created At
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nonProdData?.slice(0, 5).map((row) => (
                      <TableRow key={row.org}>
                        <TableCell className="font-medium">{row.org}</TableCell>
                        <TableCell>{row.project}</TableCell>
                        <TableCell className="text-right">
                          12th Jan 2023
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </CardContent>
          </Card>
          <Card
            x-chunk="dashboard-06-chunk-0"
            className="col-span-1"
            style={{ height: "fit-content" }}
            key={"emptyProject"}
          >
            <CardHeader>
              <CardTitle>Projects with Zero Pipelines</CardTitle>
              <CardDescription>
                Analyze projects with zero pipelines
              </CardDescription>
            </CardHeader>
            <CardContent className="flex">
              <PieChartComponent pieChartData={pieChartEmptyProject} />
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="w-[90px]"
                        style={{ color: "#ff5252" }}
                      >
                        Organisation
                      </TableHead>
                      <TableHead style={{ color: "#ff5252" }}>
                        Project
                      </TableHead>
                      <TableHead
                        className="text-right"
                        style={{ color: "#ff5252" }}
                      >
                        Created At
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emptyProjects?.map((row) => (
                      <TableRow key={row.org}>
                        <TableCell className="font-medium">{row.org}</TableCell>
                        <TableCell>{row.project}</TableCell>
                        <TableCell className="text-right">
                          12th Jan 2023
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  } else {
    return <></>;
  }
}
