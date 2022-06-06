import { configureStore } from '@reduxjs/toolkit'
import medicationsReducer from './slices/medicationsSlice'
import measuringsReducer from './slices/measuringsSlice'
import visitsReducer from './slices/visitsSlice'
import contactsReducer from './slices/contactsSlice'

export const store = configureStore({
  reducer: {
    medications: medicationsReducer,
    measurings: measuringsReducer,
    visits: visitsReducer,
    contacts: contactsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch