import Image from "next/image";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import React, { PureComponent, act, useState } from "react";
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

export default function Dashboard() {
  const pieChartData = [
    { name: "Healthy Projects", value: 400 },
    { name: "0 Pipeline Projects", value: 300 },
    // { name: "Group C", value: 300 },
    // { name: "Group D", value: 200 }
  ];

  const adoptionStatus = {
    green: "#4EC851",
    red: "#ff5252",
    yellow: "#FAFA33",
  };
  const [data] = useState([
    { name: "Org A", orgScore: 4000, pv: 2400, amt: 4000 },
    { name: "Org B", orgScore: 3000, pv: 1398, amt: 3000 },
    { name: "Org C", orgScore: 2000, pv: 9800, amt: 2000 },
    { name: "Org D", orgScore: 2780, pv: 3908, amt: 2780 },
    { name: "Org E", orgScore: 1890, pv: 4800, amt: 1890 },
    { name: "Org F", orgScore: 2390, pv: 3800, amt: 2390 },
    { name: "Org G", orgScore: 3490, pv: 4300, amt: 3490 },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (data: any, index: number) => {
    setActiveIndex(index);
  };

  const leastActivity = [
    {
      org: "Org A",
      project: "Project A",
      createdAt: "12th Jan 2023",
      noOfPipelines: 0,
    },
    {
      org: "Org A",
      project: "Project B",
      createdAt: "20th June 2023",
      noOfPipelines: 0,
    },
    {
      org: "Org B",
      project: "Project C",
      createdAt: "1st Jan 2024",
      noOfPipelines: 0,
    },
    {
      org: "Org C",
      project: "Project D",
      createdAt: "15th May 2024",
      noOfPipelines: 0,
    },
  ];

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
  const activeItem = sortedData[activeIndex];
  const activeOrgIndex = findOrgIndex(
    drillDownData,
    sortedData[activeIndex].name
  );
  const activeOrg = Object.keys(drillDownData[activeOrgIndex])[0];
  const activeOrgData = drillDownData[activeOrgIndex][activeOrg];
  const status = "red";
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
            <CardTitle>Top 7 Org Leadership Board</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-20">
            <div style={{ width: "100%" }}>
              <ResponsiveContainer width="90%" height={150}>
                <BarChart width={110} height={80} data={sortedData}>
                  <Bar dataKey="orgScore" onClick={handleClick}>
                    {sortedData.map((entry, index) => (
                      <Cell
                        cursor="pointer"
                        fill={
                          index === activeIndex
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
              <p className="content">{`${activeItem.name} score: ${activeItem.orgScore}`}</p>
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
                      {activeOrg} <span className="text-primary">Insights</span>
                    </div>
                    <div
                      className="border border-blue-500 rounded-lg px-4 py-1 "
                      style={{ fontSize: "15px" }}
                    >
                      score: <span>{activeItem.orgScore}</span>
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
                        <TableHead>Triggers</TableHead>
                        <TableHead>CV</TableHead>
                        <TableHead>Templates</TableHead>
                        <TableHead>Unit Test</TableHead>
                        <TableHead>Security</TableHead>
                        <TableHead>Project Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
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
        >
          <CardHeader>
            <CardTitle>Projects with zero production deployments</CardTitle>
            <CardDescription>
              Analyze projects with zero production deployments
            </CardDescription>
          </CardHeader>
          <CardContent className="flex">
            <PieChartComponent pieChartData={pieChartData} />
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
                    <TableHead style={{ color: "#ff5252" }}>Project</TableHead>
                    <TableHead
                      style={{ color: "#ff5252" }}
                      className="text-right"
                    >
                      Created At
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leastActivity.map((row) => (
                    <TableRow key={row.org}>
                      <TableCell className="font-medium">{row.org}</TableCell>
                      <TableCell>{row.project}</TableCell>
                      <TableCell className="text-right">
                        {row.createdAt}
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
        >
          <CardHeader>
            <CardTitle>Projects with Zero Pipelines</CardTitle>
            <CardDescription>
              Analyze projects with zero pipelines
            </CardDescription>
          </CardHeader>
          <CardContent className="flex">
            <PieChartComponent pieChartData={pieChartData} />
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
                    <TableHead style={{ color: "#ff5252" }}>Project</TableHead>
                    <TableHead
                      className="text-right"
                      style={{ color: "#ff5252" }}
                    >
                      Created At
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leastActivity.map((row) => (
                    <TableRow key={row.org}>
                      <TableCell className="font-medium">{row.org}</TableCell>
                      <TableCell>{row.project}</TableCell>
                      <TableCell className="text-right">
                        {row.createdAt}
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
}
