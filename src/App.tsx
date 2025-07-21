import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { store } from "./store";
import AppLayout from "./components/Layout/AppLayout";
import UsersList from "./components/Users/UsersList";
import UserPosts from "./components/Posts/UserPosts";
import TasksList from "./components/Tasks/TasksList";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<UsersList />} />
              <Route path="/user/:userId/posts" element={<UserPosts />} />
              <Route path="/tasks" element={<TasksList />} />
            </Routes>
          </AppLayout>
        </Router>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
