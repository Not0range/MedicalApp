import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store';

interface ILoading {
  loading: boolean;
}

const initialState: ILoading = {
  loading: true
}

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const { setState } = loadingSlice.actions;
export const selectLoading = (state: RootState) => state.loading.loading
export default loadingSlice.reducer;