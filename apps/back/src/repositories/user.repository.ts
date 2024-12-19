import type { CreateUser, GetUserParams, UpdateUser, User } from "@corum/dto";
import sql from "../db";

export const getUsers = async (params: GetUserParams) => {
  return sql<User[]>`
    SELECT * FROM users 
    WHERE ${params.firstNameQuery ? sql`LOWER(firstname) LIKE LOWER(${params.firstNameQuery + "%"})` : sql`1=1`}
    AND ${params.lastNameQuery ? sql`LOWER(lastname) LIKE LOWER(${params.lastNameQuery + "%"})` : sql`1=1`} 
    AND ${params.emailQuery ? sql`LOWER(email) LIKE LOWER(${params.emailQuery + "%"})` : sql`1=1`} 
    ORDER BY ${sql(params.sortBy || "id")} ${sql.unsafe(params.sortOrder || "asc")}`;
};

export const getUser = async (id: number) => {
  return sql<User[]>`SELECT * FROM users WHERE id = ${id}`;
};

export const loginUser = async (user: string, password: string) => {
  return sql<
    User[]
  >`SELECT * FROM users WHERE email = ${user} AND password = ${password}`;
};

export const createUser = async (user: CreateUser) => {
  return sql`INSERT INTO users (firstname, lastname, email, password) VALUES (${user.firstname}, ${user.lastname}, ${user.email}, ${user.password})`;
};

export const deleteUser = async (id: number) => {
  return sql`DELETE FROM users WHERE id = ${id}`;
};

export const updateUser = async (id: number, user: UpdateUser) => {
  return sql`UPDATE users SET ${sql(user)} WHERE id = ${id}`;
};
