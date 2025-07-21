import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Form,
  Input,
  message,
  Space,
  Modal,
  Typography,
  Divider,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import _isEqual from "lodash/isEqual";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchUser, updateUser } from "../../store/usersSlice";
import { fetchUserPosts, updatePost, deletePost } from "../../store/postsSlice";
import type { Post, UserFormData } from "../../types";
import { deletePostModal, errors, statuses } from "../../constants/MicroCopy";
import Alert from "../common/Alert";
import { editUserValidationMessages } from "../../constants/validations";
import { userDetailsFields } from "../../constants/userDetailsFields";
import Loader from "../common/Loader";

const { TextArea } = Input;
const { Title } = Typography;

const UserPosts: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    selectedUser,
    loading: userLoading,
    error: userError,
  } = useAppSelector((state) => state.users);
  const {
    posts,
    loading: postsLoading,
    error: postsError,
  } = useAppSelector((state) => state.posts);

  const [editingUser, setEditingUser] = useState(false);
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [postForm] = Form.useForm();
  const [originalUserData, setOriginalUserData] = useState<UserFormData | null>(
    null
  );
  const [originalPostData, setOriginalPostData] = useState<{
    title: string;
    body: string;
  } | null>(null);

  useEffect(() => {
    if (!userId) return;

    const id = parseInt(userId);
    dispatch(fetchUser(id));
    dispatch(fetchUserPosts(id));
  }, [dispatch, userId]);

  const handleEditUser = useCallback(() => {
    if (!selectedUser) return;

    setEditingUser(true);
    const formData: UserFormData = {
      username: selectedUser.username,
      email: selectedUser.email,
      address: {
        street: selectedUser.address.street,
        suite: selectedUser.address.suite,
        city: selectedUser.address.city,
      },
    };
    setOriginalUserData(formData);
    form.setFieldsValue(formData);
  }, [form, selectedUser]);

  const handleCancelUserEdit = useCallback(() => {
    setEditingUser(false);
    setOriginalUserData(null);
    form.resetFields();
  }, [form]);

  const handleSaveUser = async () => {
    try {
      const values = await form.validateFields();
      if (selectedUser) {
        await dispatch(
          updateUser({
            id: selectedUser.id,
            user: {
              ...selectedUser,
              username: values.username,
              email: values.email,
              address: {
                ...selectedUser.address,
                street: values.address.street,
                suite: values.address.suite,
                city: values.address.city,
              },
            },
          })
        ).unwrap();
        message.success(statuses.updateUserSuccess);
        setEditingUser(false);
        setOriginalUserData(null);
      }
    } catch {
      message.error(errors.failedToUpdateUser);
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post.id);
    const postData = { title: post.title, body: post.body };
    setOriginalPostData(postData);
    postForm.setFieldsValue(postData);
  };

  const handleCancelPostEdit = () => {
    setEditingPost(null);
    setOriginalPostData(null);
    postForm.resetFields();
  };

  const handleSavePost = async () => {
    try {
      const values = await postForm.validateFields();
      if (editingPost) {
        await dispatch(
          updatePost({
            id: editingPost,
            post: values,
          })
        ).unwrap();
        message.success(statuses.updatePostSuccess);
        setEditingPost(null);
        setOriginalPostData(null);
      }
    } catch {
      message.error(errors.failedToUpdatePost);
    }
  };

  const handleDeletePost = (postId: number) => {
    Modal.confirm({
      ...deletePostModal,
      onOk: async () => {
        try {
          await dispatch(deletePost(postId)).unwrap();
          message.success(statuses.deletePostSuccess);
        } catch {
          message.error(errors.failedToDeletePost);
        }
      },
    });
  };

  const watchedUserValues = Form.useWatch([], form);
  const watchedPostValues = Form.useWatch([], postForm);

  const hasUserChanges = useMemo(
    () => !!originalUserData && !_isEqual(watchedUserValues, originalUserData),
    [watchedUserValues, originalUserData]
  );

  const hasPostChanges = useMemo(
    () => !!originalPostData && !_isEqual(watchedPostValues, originalPostData),
    [watchedPostValues, originalPostData]
  );

  if (userLoading || postsLoading) return <Loader />;

  if (userError || postsError) {
    return (
      <Alert
        message="Error"
        description={userError || postsError || undefined}
        type="error"
        showIcon
        className="mb-4"
      />
    );
  }

  if (!selectedUser) {
    return <Alert message="User not found" type="warning" showIcon />;
  }

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/")}
        className="mb-4"
      >
        Back to Users
      </Button>

      <Title level={2}>User Details & Posts</Title>

      {/* User Details Card */}
      <Card
        title={`${selectedUser.name} (@${selectedUser.username})`}
        extra={
          !editingUser && (
            <Button icon={<EditOutlined />} onClick={handleEditUser}>
              Edit
            </Button>
          )
        }
        className="mb-6"
      >
        {editingUser ? (
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
                onClick={handleSaveUser}
                disabled={!hasUserChanges}
              >
                Save
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={handleCancelUserEdit}
                disabled={!hasUserChanges}
              >
                Cancel
              </Button>
            </Space>
          </Form>
        ) : (
          <div>
            {userDetailsFields.map(({ label, getValue }) => (
              <p key={label}>
                <strong>{label}:</strong> {getValue(selectedUser)}
              </p>
            ))}
          </div>
        )}
      </Card>

      <Divider />

      {/* Posts Section */}
      <Title level={3}>Posts ({posts.length})</Title>

      {posts.length === 0 ? (
        <Alert message="No posts found for this user" type="info" />
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card
              key={post.id}
              title={editingPost === post.id ? "Editing Post" : post.title}
              extra={
                editingPost !== post.id && (
                  <Space>
                    <Button
                      icon={<EditOutlined />}
                      size="small"
                      onClick={() => handleEditPost(post)}
                    >
                      Edit
                    </Button>
                    <Button
                      icon={<DeleteOutlined />}
                      size="small"
                      danger
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Delete
                    </Button>
                  </Space>
                )
              }
            >
              {editingPost === post.id ? (
                <Form form={postForm} layout="vertical">
                  <Form.Item
                    label="Title"
                    name="title"
                    rules={[
                      {
                        required: true,
                        message: editUserValidationMessages.titleRequired,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Body"
                    name="body"
                    rules={[
                      {
                        required: true,
                        message: editUserValidationMessages.bodyRequired,
                      },
                    ]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      onClick={handleSavePost}
                      disabled={!hasPostChanges}
                    >
                      Save
                    </Button>
                    <Button
                      icon={<CloseOutlined />}
                      onClick={handleCancelPostEdit}
                      disabled={!hasPostChanges}
                    >
                      Cancel
                    </Button>
                  </Space>
                </Form>
              ) : (
                <p>{post.body}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPosts;
