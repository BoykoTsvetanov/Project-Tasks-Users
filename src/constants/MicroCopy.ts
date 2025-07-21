export const errors = {
  failedToDeletePost: "Failed to delete post",
  failedToFetchTodos: "Failed to fetch tasks",
  failedToUpdateUser: "Failed to update user",
  failedToFetchUsers: "Failed to fetch users",
  failedToUpdatePost: "Failed to update post",
  failedToUpdateTask: "Failed to update task status",
};

export const statuses = {
  deletePostSuccess: "Post deleted successfully",
  statusChanged: (checked: boolean) =>
    `Task marked as ${checked ? "completed" : "pending"}`,
  updateUserSuccess: "User updated successfully",
  updatePostSuccess: "Post updated successfully",
};

export const deletePostModal = {
  title: "Delete Post",
  content: "Are you sure you want to delete this post?",
  okText: "Delete",
  okType: "danger" as const,
  cancelText: "Cancel",
};
