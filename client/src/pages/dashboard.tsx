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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
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
  const [rulesLocalStorge] = useLocalStorage("rulesStateKey", {});
  useEffect(() => {
    const fetchScannedData = () => {
      try {
        fetch("http://localhost:4567/scan-account")
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
    // const sortedData = [...orgsArr].sort((a, b) => b.orgScore - a.orgScore);

    // const activeItem = sortedData[activeIndex];
    // const activeOrgIndex = findOrgIndex(
    //   drillDownData,
    //   sortedData[activeIndex].name
    // );
    // const activeOrg = Object.keys(drillDownData[activeOrgIndex])[0];
    // const activeOrgData = drillDownData[activeOrgIndex][activeOrg];
    // setBarChartData({ activeOrg, activeOrgData });
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

  const [data] = useState([
    { name: "Org A", orgScore: 4000, amt: 4000 },
    { name: "Org B", orgScore: 3000, amt: 3000 },
    { name: "Org C", orgScore: 2000, amt: 2000 },
    { name: "Org D", orgScore: 2780, amt: 2780 },
    { name: "Org E", orgScore: 1890, amt: 1890 },
    { name: "Org F", orgScore: 2390, amt: 2390 },
    { name: "Org G", orgScore: 3490, amt: 3490 },
  ]);
  // console.log(barChartData);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (data: any, index: number) => {
    setActiveIndex(index);
  };

  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateRandomProjectData(projectName: string) {
    const triggers = getRandomInt(0, 20);
    const cv = getRandomInt(0, 20);
    const templates = getRandomInt(0, 20);
    const unitTest = getRandomInt(0, 20);
    const security = getRandomInt(0, 20);
    const projectScore = triggers + cv + templates + unitTest + security;

    return {
      project: projectName,
      triggers,
      cv,
      templates,
      unitTest,
      security,
      projectScore,
    };
  }

  function generateRandomOrgData(projectNames: Array<string>) {
    return projectNames.map((projectName: string) =>
      generateRandomProjectData(projectName)
    );
  }

  const orgProjectNames = [
    {
      org: "Org A",
      projects: ["Alpha", "Beta", "Gamma", "Delta", "Eta"],
    },
    {
      org: "Org B",
      projects: ["Theta", "Iota"],
    },
    {
      org: "Org C",
      projects: ["Omicron", "Pi", "Tau", "Upsilon", "Phi"],
    },
    {
      org: "Org D",
      projects: ["Chi", "Psi", "Omega", "Delta2"],
    },
    {
      org: "Org E",
      projects: ["Epsilon2", "Zeta2", "Eta2", "Theta2", "Iota2", "Kappa2"],
    },
    {
      org: "Org F",
      projects: ["Mu2", "Nu2", "Xi2", "Sigma2"],
    },
    {
      org: "Org G",
      projects: [
        "Tau2",
        "Upsilon2",
        "Phi2",
        "Chi2",
        "Psi2",
        "Omega2",
        "Alpha3",
      ],
    },
  ];

  const drillDownData = orgProjectNames.map(({ org, projects }) => ({
    [org]: generateRandomOrgData(projects),
  }));

  // console.log("drilldown", drillDownData);

  const { theme } = useTheme();
  function findOrgIndex(data: any, orgName: string) {
    for (let i = 0; i < data.length; i++) {
      if (Object.keys(data[i])[0] === orgName) {
        return i;
      }
    }
    return -1;
  }
  const sortedData = [...data].sort((a, b) => b.orgScore - a.orgScore);

  const activeItem = barChartData[activeIndex];

  // const activeOrgIndex = findOrgIndex(
  //   drillDownData,
  //   sortedData[activeIndex].name
  // );
  // const activeOrg = Object.keys(drillDownData[activeOrgIndex])[0];
  // const activeOrgData = drillDownData[activeOrgIndex][activeOrg];
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


  if (prodScanData) {
    return (
      <div className="grid gap-4 grid-flow-row ml-7 p-8 min-h-screen w-content flex-col bg-muted/40">
        <div className="grid grid-cols-4 gap-4 px-7">
          <Card className="col-span-1 px-2 py-2">
            <CardHeader>
              <CardTitle className="flex gap-5 justify-around">
                <div className="text-base">Compliant Rules Enforced</div>
                <div>8</div>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="px-2 py-2">
            <CardHeader>
              <CardTitle className="flex gap-5 justify-around">
                <div className="text-base">Total Organisations</div>
                <div>45</div>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className=" px-2 py-2">
            <CardHeader>
              <CardTitle className="flex gap-5 justify-around">
                <div className="text-base">% of compliant Organisation</div>
                <div>67%</div>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card
            className=" px-2 py-2"
            style={{ borderColor: "#FFBF00", backgroundColor: "#FFBF00" }}
          >
            <CardHeader>
              <CardTitle className="flex gap-5 justify-around">
                <div className={`text-base `}>Adpoption Status</div>
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
                      {/* <div>
                        {activeOrg} <span className="text-primary">Insights</span>
                      </div> */}
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
                      {/* <TableBody>
                        {activeOrgData.map((row) => (
                          <TableRow key={row.project}>
                            <TableCell className="font-medium">
                              {row.project}
                            </TableCell>
                            <TableCell>{row.triggers}</TableCell>
                            <TableCell>{row.cv}</TableCell>
                            <TableCell>{row.templates}</TableCell>
                            <TableCell>{row.unitTest}</TableCell>
                            <TableCell>{row.security}</TableCell>
                            <TableCell>{row.projectScore}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody> */}
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
                    {nonProdData?.map((row) => (
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
