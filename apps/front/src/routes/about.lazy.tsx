import { createLazyFileRoute } from "@tanstack/react-router";
import { useAuth } from "../auth";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  const { token } = useAuth();
  return <div className="p-2">Hello from About! {token}</div>;
}
