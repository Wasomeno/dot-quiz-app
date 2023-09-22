import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Layout } from "./components/layout.tsx";
import { SignInRequiredWrapper } from "./components/sign-in-required-wrapper.tsx";
import { HomePage } from "./views/home.tsx";
import { QuizCategorySelectPage } from "./views/quiz-category-select.tsx";
import { QuizRoomPage } from "./views/quiz-room.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route
        path="quiz"
        element={
          <SignInRequiredWrapper>
            <QuizCategorySelectPage />
          </SignInRequiredWrapper>
        }
      />
      <Route
        path="quiz/:categoryId"
        element={
          <SignInRequiredWrapper>
            <QuizRoomPage />
          </SignInRequiredWrapper>
        }
      />
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
    cacheLocation="localstorage"
    useRefreshTokens
  >
    <QueryClientProvider client={queryClient}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </QueryClientProvider>
  </Auth0Provider>,
);
