import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

const Layout = lazy(() => import("@/components/organisms/Layout"));
const Home = lazy(() => import("@/components/pages/Home"));
const NoteEditor = lazy(() => import("@/components/pages/NoteEditor"));
const Search = lazy(() => import("@/components/pages/Search"));
const Recent = lazy(() => import("@/components/pages/Recent"));
const Tags = lazy(() => import("@/components/pages/Tags"));
const Trash = lazy(() => import("@/components/pages/Trash"));
const NotebookView = lazy(() => import("@/components/pages/NotebookView"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-amber-50">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-amber-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="text-stone-600">Loading InkDrop Notes...</p>
    </div>
  </div>
);

const withSuspense = (Component) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

const mainRoutes = [
  {
    path: "",
    index: true,
    element: withSuspense(Home),
  },
  {
    path: "new",
    element: withSuspense(NoteEditor),
  },
  {
    path: "note/:id",
    element: withSuspense(NoteEditor),
  },
  {
    path: "search",
    element: withSuspense(Search),
  },
  {
    path: "recent",
    element: withSuspense(Recent),
  },
  {
    path: "tags",
    element: withSuspense(Tags),
  },
  {
    path: "trash",
    element: withSuspense(Trash),
  },
  {
    path: "notebook/:notebookId",
    element: withSuspense(NotebookView),
  },
  {
    path: "*",
    element: withSuspense(NotFound),
  },
];

const routes = [
  {
    path: "/",
    element: withSuspense(Layout),
    children: mainRoutes,
  },
];

export const router = createBrowserRouter(routes);