import { useDispatch } from "react-redux";
import { register, login, getMe, logout } from "../services/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";

export function useAuth() {
  const dispatch = useDispatch();

  async function registerHandler({ fullName, email, password }) {
    dispatch(setError(null));
    try {
      dispatch(setLoading(true));
      const data = await register({ fullName, email, password });
      return { success: true, data };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      dispatch(setError(message));
      return {
        success: false,
        message,
        status: error.response?.status,
      };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function loginHandler({ email, password }) {
    dispatch(setError(null));
    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
      return { success: true, data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Sign-in failed. Please try again.";
      dispatch(setError(message));
      return {
        success: false,
        message,
        status: error.response?.status,
      };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function getMeHandler() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "getMe Failed"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function logoutHandler() {
    try {
      dispatch(setLoading(true));
      const data = await logout();
      dispatch(setUser(null));
      dispatch(setError(null));
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to logout";
      dispatch(setError(message));
      return {
        success: false,
        message,
        status: error.response?.status,
      };
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    loginHandler,
    registerHandler,
    getMeHandler,
    logoutHandler,
  };
}
