import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  message,
  Alert,
  Card,
  Row,
  Col,
} from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import type { TablePaginationConfig } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  fetchTodos,
  updateTodo,
  setFilters,
  setPage,
} from "../../store/todosSlice";
import { fetchUsers } from "../../store/usersSlice";
import { Statuses, type Todo } from "../../types";
import Loader from "../common/Loader";
import { getTodoColumns } from "../../constants";
import { errors, statuses } from "../../constants/MicroCopy";

const { Option } = Select;

export default function TasksList() {
  const dispatch = useAppDispatch();
  const { filteredTodos, loading, error, pagination } = useAppSelector(
    (state) => state.todos
  );
  const { users } = useAppSelector((state) => state.users);

  const [localFilters, setLocalFilters] = useState({
    title: "",
    status: Statuses.ALL,
    userId: null as number | null,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLocalFilters((prev) => ({ ...prev, title: e.target.value }));

  const handleStatusFilterChange = (value: Statuses) =>
    setLocalFilters((prev) => ({ ...prev, status: value }));

  const handleUserChange = (value: number | null) =>
    setLocalFilters((prev) => ({ ...prev, userId: value }));

  useEffect(() => {
    dispatch(fetchTodos());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleStatusChange = async (checked: boolean, record: Todo) => {
    try {
      await dispatch(
        updateTodo({
          id: record.id,
          todo: { ...record, completed: checked },
        })
      ).unwrap();
      message.success(statuses.statusChanged(checked));
    } catch {
      message.error(errors.failedToUpdateTask);
    }
  };

  const handleSearch = () => dispatch(setFilters(localFilters));

  const handleClear = () => {
    const clearedFilters = {
      title: "",
      status: Statuses.ALL,
      userId: null,
    };
    setLocalFilters(clearedFilters);
    dispatch(setFilters(clearedFilters));
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) dispatch(setPage(pagination.current));
  };

  const columns = getTodoColumns(users, handleStatusChange);

  // Calculate paginated data
  const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const paginatedTodos = filteredTodos.slice(startIndex, endIndex);

  const paginationConfig: TablePaginationConfig = {
    current: pagination.currentPage,
    pageSize: pagination.pageSize,
    total: pagination.total,
    showSizeChanger: false,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} tasks`,
  };

  if (loading) return <Loader />;

  if (error)
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        className="mb-4"
      />
    );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>

      {/* Filters */}
      <Card className="mb-4">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Input
              placeholder="Search by title..."
              value={localFilters.title}
              onChange={handleTitleChange}
              allowClear
            />
          </Col>
          <Col xs={24} sm={6}>
            <Select
              className="w-full"
              value={localFilters.status}
              onChange={handleStatusFilterChange}
            >
              <Option value={Statuses.ALL}>All Tasks</Option>
              <Option value={Statuses.COMPLETED}>Completed</Option>
              <Option value={Statuses.PENDING}>Pending</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <Select
              className="w-full"
              placeholder="Select owner..."
              value={localFilters.userId}
              onChange={handleUserChange}
              allowClear
            >
              {users.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={4}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
              >
                Search
              </Button>
              <Button icon={<ClearOutlined />} onClick={handleClear}>
                Clear
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Tasks Table */}
      <Table
        columns={columns}
        dataSource={paginatedTodos}
        rowKey="id"
        pagination={paginationConfig}
        onChange={handleTableChange}
        scroll={{ x: 800 }}
      />
    </div>
  );
}
