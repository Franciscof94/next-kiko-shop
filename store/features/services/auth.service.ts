import Cookies from "js-cookie";
import Router from "next/router";
import { tesloApi } from "../../../api";


const register = async (name: string, email: number | string, password: string) => {
  const { data } = await tesloApi.post("/user/register", {
    name,
    email,
    password,
  });
  const { user } = data;
  return user;
}


const login = async (email?: number | string, password?: string) => {
  const { data } = await tesloApi.post("/user/login", { email, password });
      const { token, user } = data;
      Cookies.set("token", token);
      if(token) {
        return {
          token,
          user
        }
      }
  return { 
    token: "",
    user: null
  }
}

const logout = (): void => {
  Cookies.remove("token");
  Cookies.remove("cart");
  Cookies.remove("name");
  Cookies.remove("lastName");
  Cookies.remove("address");
  Cookies.remove("address2");
  Cookies.remove("zipCode");
  Cookies.remove("phone");
  Cookies.remove("city");
  Cookies.remove("state");
  Router.reload();
};



const authService = {
  register,
  login,
  logout,
};

export default authService;
