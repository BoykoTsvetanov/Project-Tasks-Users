// src/constants/index.tsx
import { Switch } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Todo, User } from "../types";
import { getUserName } from "../utils";

export const getTodoColumns = (
  users: User[],
  handleStatusChange: (checked: boolean, record: Todo) => void
): ColumnsType<Todo> => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 80,
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    ellipsis: true,
  },
  {
    title: "Owner",
    dataIndex: "userId",
    key: "userId",
    width: 150,
    render: (userId: number) => getUserName(users, userId),
  },
  {
    title: "Status",
    dataIndex: "completed",
    key: "completed",
    width: 120,
    render: (completed: boolean, record: Todo) => (
      <Switch
        checked={completed}
        checkedChildren="Completed"
        unCheckedChildren="Pending"
        onChange={(checked) => handleStatusChange(checked, record)}
      />
    ),
  },
];
