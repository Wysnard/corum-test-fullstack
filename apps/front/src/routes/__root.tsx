import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useAuth } from "../auth";

export type MyRouteContext = object;

export const Route = createRootRouteWithContext<MyRouteContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { token } = useAuth();

  return (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        {token && (
          <Link to="/dashboard" className="[&.active]:font-bold">
            Dashboard
          </Link>
        )}
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
