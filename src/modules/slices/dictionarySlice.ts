import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Dictionary from '../../common/dictionary';
import { RootState } from '../store';

interface IDictionaryState {
  list: Dictionary[],
}

const initialState: IDictionaryState = {
  list: [],
}

export const dictionarySlice = createSlice({
  name: 'dictionary',
  initialState,
  reducers: {
    push: (state, action: PayloadAction<Dictionary>) => {
      state.list.push(action.payload);
    }
  }
});

export const { push } = dictionarySlice.actions;
export const selectDictionary = (state: RootState) => state.dictionary.list
export default dictionarySlice.reducer;