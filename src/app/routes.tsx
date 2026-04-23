import { createBrowserRouter } from "react-router";

import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { AppLayout } from "./layouts/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailsPage } from "./pages/ProjectDetailsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { LeaderDashboardPage } from "./pages/LeaderDashboardPage";
import { TeamMonitoringPage } from "./pages/TeamMonitoringPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  {
    path: "/app",
    Component: AppLayout,
    children: [
      { index: true, Component: LeaderDashboardPage },
      { path: "projects", Component: ProjectsPage },
      { path: "projects/:id", Component: ProjectDetailsPage },
      { path: "team", Component: TeamMonitoringPage },
      { path: "reports", Component: ReportsPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
]);
