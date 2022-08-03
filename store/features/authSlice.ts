import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { tesloApi } from "../../api";
import { IUser } from "../../interfaces";
import { AppState, RootState } from "../store";
import authService from "./services/auth.service";

const storedToken: string | undefined = Cookies.get('token');
const token = !!storedToken ? storedToken : null;


interface AsyncState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface AuthState extends AsyncState {
  user?: IUser;
  token?: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  user: undefined,
  token: token,
  isLoggedIn: false,
};


export const loginUser = createAsyncThunk(
  "user/loginUser",

  async (
    { email, password }: { email?: number | string; password?: string },
    thunkAPI
  ) => {
    try {
      return await authService.login(email, password);
    } catch (error) {
      return thunkAPI.rejectWithValue('Error al iniciar sesión');
      
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",

  async (
    {
      name,
      email,
      password,
    }: { name: string; email: number | string; password: string },
    thunkAPI
  ) => {
    try {
      return await authService.register(name, email, password);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue("No se pudo crear el usuario - intente de nuevo");
        
      }
    }
  }
);



export const logout = createAsyncThunk('auth/logout', async () => {
  authService.logout();
});


export const checkToken = createAsyncThunk("auth/checkToken", async (_,thunkAPI) => {
  if (!Cookies.get("token")) {
    return;
  }

  try {
    const { data } = await tesloApi.get('/user/validate-token');
    const { token, user } = data;
    Cookies.set('token', token );
    return {
      tokenResult: true,
      user
    }
  } catch (error) {
    Cookies.remove("token");
    return thunkAPI.rejectWithValue("Error al validar el token");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isLoggedIn = true;
      state.user = payload.user;
    });
    builder.addCase(loginUser.rejected, (state, { payload }: any) => {
      state.isLoading = false;
      state.isError = true;
      state.isLoggedIn = false;
      state.user = undefined;
    });
      // REGISTER
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = payload
    });
    builder.addCase(registerUser.rejected, (state, { payload }: any) => {
      state.isLoading = false;
      state.user = undefined;
      state.isError = true;
    });
    // LOGOUT
    builder.addCase(logout.fulfilled, (state) => {
      state.user = undefined;
      state.isLoggedIn = false;
    });
    // CHECK TOKEN
    builder.addCase(checkToken.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(checkToken.fulfilled, (state, { payload }) => { 
      state.isLoading = false;
      state.isSuccess = true;
      state.isLoggedIn = payload?.tokenResult!!;
      state.user = payload?.user!!;
    
    });
    builder.addCase(checkToken.rejected, (state) => {
      state.isLoading = false;
      state.isLoggedIn = false;
    });
  },
});

export const { reset } = authSlice.actions;
export const selectedUser = (state: RootState) => {
  return state.authUser;
};

export default authSlice.reducer;
