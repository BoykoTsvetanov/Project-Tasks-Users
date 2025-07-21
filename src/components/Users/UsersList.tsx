import React, { useEffect, useState, useMemo } from "react";
import { Collapse, Button, Form, Input, message, Space } from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchUsers, updateUser } from "../../store/usersSlice";
import type { User, UserFormData } from "../../types";
import Loader from "../common/Loader";
import Alert from "../common/Alert";
import { errors, statuses } from "../../constants/MicroCopy";
import { editUserValidationMessages } from "../../constants/validations";
import _isEqual from "lodash/isEqual";
import { userDetailsFields } from "../../constants/userDetailsFields";

const { Panel } = Collapse;

export default function UsersList() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { users = [], loading, error } = useAppSelector((state) => state.users);

  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [originalData, setOriginalData] = useState<UserFormData | null>(null);
  const [activePanel, setActivePanel] = useState<string | number | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const watchedValues = Form.useWatch([], form);

  const hasChanges = useMemo(
    () => !!originalData && !_isEqual(watchedValues, originalData),
    [watchedValues, originalData]
  );

  const handleEdit = (user: User) => {
    setEditingUser(user.id);
    setActivePanel(user.id);
    const formData: UserFormData = {
      username: user.username,
      email: user.email,
      address: {
        street: user.address.street,
        suite: user.address.suite,
        city: user.address.city,
      },
    };
    setOriginalData(formData);
    form.setFieldsValue(formData);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setOriginalData(null);
    form.resetFields();
    setActivePanel(null);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        const user = users.find((u) => u.id === editingUser);
        if (user) {
          await dispatch(
            updateUser({
              id: editingUser,
              user: {
                ...user,
                username: values.username,
                email: values.email,
                address: {
                  ...user.address,
                  street: values.address.street,
                  suite: values.address.suite,
                  city: values.address.city,
                },
              },
            })
          ).unwrap();
          message.success(statuses.updateUserSuccess);
          setEditingUser(null);
          setOriginalData(null);
        }
      }
    } catch {
      message.error(errors.failedToUpdateUser);
    }
  };

  const handleViewPosts = (userId: number) => navigate(`/user/${userId}/posts`);

  if (loading) return <Loader />;

  if (error) return <Alert description={error} />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <Collapse
        activeKey={activePanel === null ? undefined : activePanel}
        onChange={(key) => {
          if (Array.isArray(key)) setActivePanel(key[0] ?? null);
          else setActivePanel(key ?? null);
        }}
      >
        {users.map((user) => (
          <Panel
            key={user.id}
            header={
              <div className="flex justify-between items-center">
                <span>
                  {user.name} (@{user.username})
                </span>
                <Space>
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewPosts(user.id);
                    }}
                  >
                    See posts
                  </Button>
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(user);
                    }}
                  >
                    Edit
                  </Button>
                </Space>
              </div>
            }
          >
            {editingUser === user.id ? (
              <Form form={form} layout="vertical">
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: editUserValidationMessages.userNameRequired,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: editUserValidationMessages.emailRequired,
                    },
                    {
                      type: "email",
                      message: editUserValidationMessages.emailInvalid,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Street"
                  name={["address", "street"]}
                  rules={[
                    {
                      required: true,
                      message: editUserValidationMessages.streetRequired,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Suite"
                  name={["address", "suite"]}
                  rules={[
                    {
                      required: true,
                      message: editUserValidationMessages.suiteRequired,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="City"
                  name={["address", "city"]}
                  rules={[
                    {
                      required: true,
                      message: editUserValidationMessages.cityRequired,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Space>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSave}
                    disabled={!hasChanges}
                  >
                    Save
                  </Button>
                  <Button
                    icon={<CloseOutlined />}
                    onClick={handleCancel}
                    disabled={!hasChanges}
                  >
                    Cancel
                  </Button>
                </Space>
              </Form>
            ) : (
              <div className="space-y-2">
                {userDetailsFields.map(({ label, getValue }) => (
                  <p key={label}>
                    <strong>{label}:</strong> {getValue(user)}
                  </p>
                ))}
              </div>
            )}
          </Panel>
        ))}
      </Collapse>
    </div>
  );
}
