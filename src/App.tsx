import LoginPage from "./components/auth/LoginPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./components/auth/SignupPage";
import Home from "./components/pages/Home";
import { Provider } from "react-redux";
import { store } from "./states/store/store";
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
