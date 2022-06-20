import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment';
import UserMeasuring from '../../common/userMeasuring';
import UserMedication from '../../common/userMedication';
import { AppDispatch, RootState } from '../store';

interface IUserMeasuringsState {
  list: UserMeasuring[],
  current: UserMeasuring,
  lastId: number
}

const initialState: IUserMeasuringsState = {
  list: [],
  current: {
    id: -1,
    type: '',
    date: {
      day: moment().get('d'),
      month: moment().get('M'),
      year: moment().get('y'),
      time: { hours: 0, minutes: 0 }
    },
    value: [0]
  }, 
  lastId: 0
}

export const medicationsSlice = createSlice({
  name: 'userMeasuring',
  initialState,
  reducers: {
    push: (state, action: PayloadAction<UserMeasuring>) => {
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
    remove: (state, action: PayloadAction<UserMeasuring>) => {
      state.list.splice(state.list.findIndex(t => t.id == action.payload.id), 1);
    },
    setCurrent: (state, action: PayloadAction<UserMeasuring>) => {
      state.current = action.payload;
    },
    setLastId: (state, action: PayloadAction<number>) => {
      state.lastId = action.payload;
    },
  }
});

export const { push, remove, setCurrent, setLastId } = medicationsSlice.actions;
export const selectMedications = (state: RootState) => state.userMeasurings.list;
export default medicationsSlice.reducer;