import { GitHubBanner, Refine, WelcomePage } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data";
import Dashboard from "./pages/dashboard";
import { BookOpen, GraduationCap, Home, Building2, Users, School } from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout";
import SubjectList from "./pages/subjects/list";
import SubjectCreate from "./pages/subjects/create";
import ClassesList from "./pages/classes/list";
import ClassesCreate from "./pages/classes/create";
import ClassesShow from "./pages/classes/show";
import DepartmentsList from "./pages/departments/list";
import DepartmentCreate from "./pages/departments/create";
import DepartmentShow from "./pages/departments/show";
import TeacherList from "./pages/teachers/list";
import TeacherShow from "./pages/teachers/show";
import TeacherCreate from "./pages/teachers/create";


function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "AT6Wr1-uuFfyM-5qAwn5",
                title: {
                  text: "CampusFlow",
                  icon: <School />,
                },
              }}

              resources={[
                {
                  name: 'dashboard',
                  list: '/',
                  meta: 
                  {
                    label: 'Home', 
                    icon: <Home/>
                  }
                },
                {
                  name: 'departments',
                  list: '/departments',
                  create: '/departments/create',
                  show: '/departments/show/:id',
                  meta: { label: 'Departments', icon: <Building2 /> }
                },
                {
                  name: 'subjects',
                  list: '/subjects',
                  create: '/subjects/create',
                  meta: { label: 'Subjects', icon: <BookOpen /> }
                },
                {
                   name: 'classes',
                   list: '/classes',
                   create: '/classes/create',
                   show: '/classes/show/:id',
                   meta: { label: 'Classes', icon: <GraduationCap /> }
                 },
                {
                   name: 'teachers',
                   list: '/teachers',
                   create: '/teachers/create',
                   show: '/teachers/show/:id',
                   meta: { label: 'Teachers', icon: <Users /> }
                 }
                ]}
            >
              <Routes>
                <Route element=
                {
                  <Layout>
                    <Outlet />
                  </Layout>
                }>
                <Route path="/" element={<Dashboard />} />
                <Route path="departments">
                  <Route index element={<DepartmentsList />} />
                  <Route path="create" element={<DepartmentCreate />} />
                  <Route path="show/:id" element={<DepartmentShow />} />
                </Route>
                <Route path="subjects">
                  <Route index element={<SubjectList />} />
                  <Route path="create" element={<SubjectCreate />} />
                </Route>
                <Route path="classes">
                   <Route index element={<ClassesList />} />
                   <Route path="create" element={<ClassesCreate />} />
                   <Route path="show/:id" element={<ClassesShow />} /> {/* Placeholder for class details page */}
                 </Route>
                 <Route path="teachers">
                   <Route index element={<TeacherList />} />
                   <Route path="create" element={<TeacherCreate />} />
                   <Route path="show/:id" element={<TeacherShow />} />
                 </Route>
                 </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
