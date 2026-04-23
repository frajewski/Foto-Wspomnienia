import { configureStore, createSlice } from '@reduxjs/toolkit';

// Placeholder slice — do usunięcia po dodaniu pierwszego prawdziwego slice'a
const appSlice = createSlice({
  name: 'app',
  initialState: { initialized: true },
  reducers: {},
});

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
