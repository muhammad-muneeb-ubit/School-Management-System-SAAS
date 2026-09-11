import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchTheme = createAsyncThunk('theme/fetchTheme', async () => {
  const res = await api.get('/admin/settings/public');
  return res.data;
});

const themeSlice = createSlice({
  name: 'theme',
  initialState: { schoolName: 'SMS', theme: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTheme.fulfilled, (state, action) => {
      state.schoolName = action.payload.schoolName;
      state.theme = action.payload.theme;
    });
  },
});

export default themeSlice.reducer;