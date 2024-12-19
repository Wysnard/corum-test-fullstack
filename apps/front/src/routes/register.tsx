import { createFileRoute } from "@tanstack/react-router";
import RegisterForm from "../components/register-form";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex justify-center items-center h-screen">
      <RegisterForm />
    </div>
  );
}
