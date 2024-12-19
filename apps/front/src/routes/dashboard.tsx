import { GetUserParams, User } from "@corum/dto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpDown, PlusIcon, TrashIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { AddDialog } from "../add-dialog";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { EditableCol } from "../components/editable-col";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../auth";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const [params, setParams] = useState<GetUserParams>({});
  const searchParams = new URLSearchParams(params);
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { data, error, isLoading } = useQuery({
    queryKey: ["users", searchParams.toString()],
    queryFn: () =>
      fetch(`http://localhost:8080/users?${searchParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  const { mutate: deleteUser } = useMutation({
    mutationFn: (id: number) =>
      fetch(`http://localhost:8080/user/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    retryDelay: 100,
  });

  const { mutate: updateUser } = useMutation({
    mutationFn: (user: Partial<User>) =>
      fetch(`http://localhost:8080/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const defaultColumn: Partial<ColumnDef<User>> = {
    cell: ({ getValue, row, column: { id } }) => (
      <EditableCol
        id={row.original.id}
        columnId={id}
        initialValue={getValue() as string}
        update={updateUser}
      />
    ),
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: () => (
        <div>
          <Button
            variant="ghost"
            onClick={() =>
              setParams({
                ...params,
                sortBy: "id",
                sortOrder:
                  params.sortBy === "id"
                    ? params.sortOrder === "asc"
                      ? "desc"
                      : "asc"
                    : "asc",
              })
            }
          >
            ID
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "firstname",
      header: () => (
        <div>
          <Button
            variant="ghost"
            onClick={() =>
              setParams({
                ...params,
                sortBy: "firstname",
                sortOrder:
                  params.sortBy === "firstname"
                    ? params.sortOrder === "asc"
                      ? "desc"
                      : "asc"
                    : "asc",
              })
            }
          >
            First Name
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "lastname",
      header: () => (
        <Button
          variant="ghost"
          onClick={() =>
            setParams({
              ...params,
              sortBy: "lastname",
              sortOrder:
                params.sortBy === "lastname"
                  ? params.sortOrder === "asc"
                    ? "desc"
                    : "asc"
                  : "asc",
            })
          }
        >
          Last Name
          <ArrowUpDown className="w-4 h-4" />
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: () => (
        <Button
          variant="ghost"
          onClick={() =>
            setParams({
              ...params,
              sortBy: "email",
              sortOrder:
                params.sortBy === "email"
                  ? params.sortOrder === "asc"
                    ? "desc"
                    : "asc"
                  : "asc",
            })
          }
        >
          Email
          <ArrowUpDown className="w-4 h-4" />
        </Button>
      ),
    },
    {
      accessorKey: "password",
      header: "Password",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Button variant="outline" onClick={() => deleteUser(row.original.id)}>
            <TrashIcon className="w-4 h-4" />
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) return <div>Error: {error.message}</div>;

  return (
    <main className="flex flex-col items-center justify-center h-screen px-12">
      <h1 className="text-2xl font-semibold">Corum Fullstack</h1>
      <div className="grid grid-cols-3 gap-4 my-4">
        <div className="flex flex-col gap-2">
          <Label>Filter by first name</Label>
          <Input
            type="text"
            value={params.firstNameQuery}
            onChange={(e) =>
              setParams({ ...params, firstNameQuery: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Filter by last name</Label>
          <Input
            type="text"
            value={params.lastNameQuery}
            onChange={(e) =>
              setParams({ ...params, lastNameQuery: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Filter by email</Label>
          <Input
            type="text"
            value={params.emailQuery}
            onChange={(e) =>
              setParams({ ...params, emailQuery: e.target.value })
            }
          />
        </div>
      </div>
      {isLoading && <div>Loading...</div>}
      {data && (
        <div className="w-full">
          <Table className="border rounded-md">
            <TableCaption>A list of your users</TableCaption>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>
                  <AddDialog>
                    <div className="flex items-center justify-center cursor-pointer">
                      <PlusIcon className="w-4 h-4" />
                    </div>
                  </AddDialog>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </main>
  );
}
