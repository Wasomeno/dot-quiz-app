import { useAuth0 } from "@auth0/auth0-react";
import { ReactNode } from "react";
import { SignInRequiredScreen } from "./sign-in-required-screen";

export function SignInRequiredWrapper({ children }: { children: ReactNode }) {
  const authSession = useAuth0();

  if (authSession.isLoading) return;
  if (!authSession.isLoading && !authSession.isAuthenticated)
    return <SignInRequiredScreen />;

  return children;
}
