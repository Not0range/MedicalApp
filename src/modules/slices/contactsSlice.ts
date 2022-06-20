import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Contact from '../../common/contact';
import { RootState } from '../store';

interface IContactsState {
  list: Contact[],
  current: Contact,
  lastId:  number
}

const initialState: IContactsState = {
  list: [],
  current: {
    id: -1,
    name: '',
    position: '',
    tel: '',
    workTel: ''
  }, 
  lastId: 0
}

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    push: (state, action: PayloadAction<Contact>) => {
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
    remove: (state, action: PayloadAction<Contact>) => {
      state.list.splice(state.list.findIndex(t => t.id == action.payload.id), 1);
    },
    setCurrent: (state, action: PayloadAction<Contact>) => {
      state.current = action.payload;
    },
    setLastId: (state, action: PayloadAction<number>) => {
      state.lastId = action.payload;
    },
  }
});

export const { push, remove, setCurrent, setLastId } = contactsSlice.actions;
export const selectContacts = (state: RootState) => state.contacts.list
export default contactsSlice.reducer;