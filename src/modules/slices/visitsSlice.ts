import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment';
import Visit from '../../common/visit';
import { AppDispatch, RootState } from '../store';

interface IVisitsState {
  list: Visit[],
  current: Visit,
  lastId: number
}

const initialState: IVisitsState = {
  list: [],
  current: {
    id: -1,
    doctor: undefined,
    date: {
      day: moment().get('d'),
      month: moment().get('M'),
      year: moment().get('y'),
      time: { hours: 0, minutes: 0 }
    }
  }, 
  lastId: 0
}

export const visitsSlice = createSlice({
  name: 'visits',
  initialState,
  reducers: {
    push: (state, action: PayloadAction<Visit>) => {
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
    remove: (state, action: PayloadAction<Visit>) => {
      state.list.splice(state.list.indexOf(action.payload), 1);
    },
    setCurrent: (state, action: PayloadAction<Visit>) => {
      state.current = action.payload;
    },
    setLastId: (state, action: PayloadAction<number>) => {
      state.lastId = action.payload;
    },
  }
});

export const { push, remove, setCurrent, setLastId } = visitsSlice.actions;
export const selectMedications = (state: RootState) => state.medications.list;
export default visitsSlice.reducer;