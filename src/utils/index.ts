import type { User } from "../types";
import _find from "lodash/find";

export const getUserName = (users: User[], userId: number) =>
  _find(users, { id: userId })?.name ?? `User ${userId}`;
