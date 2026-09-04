import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Check if user is logged in via HttpOnly cookie
export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch (err) {
    return rejectWithValue(null); // Return null so we don't show errors on initial load
  }
});

// Login user
export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { error: 'Login failed. Check your credentials.' });
  }
});

// Logout user
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await api.post('/auth/logout');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true, 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load User
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null; // Silently fail on initial load
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.error = null; // Clear previous errors when submitting
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload; // This will contain { error: "Invalid credentials" }
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;