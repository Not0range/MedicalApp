import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Measuring from '../../common/measuring';
import UserMeasuring from '../../common/userMeasuring';
import { RootState } from '../store';

interface IMeasuringState {
  list: Measuring[],
  current: Measuring,
  lastId:  number
}

const initialState: IMeasuringState = {
  list: [],
  current: {
    id: -1,
    title: '',
    times: []
  }, 
  lastId: 0
}

export const measuringsSlice = createSlice({
  name: 'measurings',
  initialState,
  reducers: {
    push: (state, action: PayloadAction<Measuring>) => {
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
    remove: (state, action: PayloadAction<Measuring>) => {
      state.list.splice(state.list.findIndex(t => t.id == action.payload.id), 1);
    },
    setCurrent: (state, action: PayloadAction<Measuring>) => {
      state.current = action.payload;
    },
    setLastId: (state, action: PayloadAction<number>) => {
      state.lastId = action.payload;
    },
  }
});

export const { push, remove, setCurrent, setLastId } = measuringsSlice.actions;
export const selectMeasurings = (state: RootState) => state.measurings.list
export default measuringsSlice.reducer;