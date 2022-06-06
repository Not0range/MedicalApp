import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Medication from '../../common/medication';
import { AppDispatch, RootState } from '../store';

interface IMedicationsState {
  list: Medication[],
  current: Medication,
  lastId: number
}

const initialState: IMedicationsState = {
  list: [],
  current: {
    id: -1,
    title: '',
    times: []
  }, 
  lastId: 0
}

export const medicationsSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    push: (state, action: PayloadAction<Medication>) => {
      if (action.payload.id == -1) {
        state.list.push({ ...action.payload, id: state.lastId++ });
        return;
      }
      const m = state.list.findIndex(t => t.id == action.payload.id);
      if (m == -1)
        state.list.push(action.payload);
      else 
        state.list[m] = { ...action.payload };
    },
    remove: (state, action: PayloadAction<Medication>) => {
      state.list.splice(state.list.indexOf(action.payload), 1);
    },
    setCurrent: (state, action: PayloadAction<Medication>) => {
      state.current = action.payload;
    },
    setLastId: (state, action: PayloadAction<number>) => {
      state.lastId = action.payload;
    },
  }
});

export const { push, remove, setCurrent, setLastId } = medicationsSlice.actions;
export const selectMedications = (state: RootState) => state.medications.list;
export default medicationsSlice.reducer;