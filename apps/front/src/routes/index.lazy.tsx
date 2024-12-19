import { createLazyFileRoute } from "@tanstack/react-router";
import { LoginForm } from "../components/login-form";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LoginForm />
    </div>
  );
}
