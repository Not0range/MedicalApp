import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment';
import Medication from '../../common/medication';
import UserMedication from '../../common/userMedication';
import { AppDispatch, RootState } from '../store';

interface IUserMedicationsState {
  list: UserMedication[],
  current: UserMedication,
  lastId: number
}

const initialState: IUserMedicationsState = {
  list: [],
  current: {
    id: -1,
    title: '',
    date: {
      day: moment().get('d'),
      month: moment().get('M'),
      year: moment().get('y'),
      time: { hours: 0, minutes: 0 }
    }
  }, 
  lastId: 0
}

export const medicationsSlice = createSlice({
  name: 'userMedications',
  initialState,
  reducers: {
    push: (state, action: PayloadAction<UserMedication>) => {
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
    remove: (state, action: PayloadAction<UserMedication>) => {
      state.list.splice(state.list.findIndex(t => t.id == action.payload.id), 1);
    },
    setCurrent: (state, action: PayloadAction<UserMedication>) => {
      state.current = action.payload;
    },
    setLastId: (state, action: PayloadAction<number>) => {
      state.lastId = action.payload;
    },
  }
});

export const { push, remove, setCurrent, setLastId } = medicationsSlice.actions;
export const selectMedications = (state: RootState) => state.userMedications.list;
export default medicationsSlice.reducer;