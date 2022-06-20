import { configureStore } from '@reduxjs/toolkit'
import medicationsReducer from './slices/medicationsSlice'
import measuringsReducer from './slices/measuringsSlice'
import visitsReducer from './slices/visitsSlice'
import contactsReducer from './slices/contactsSlice'
import dictionaryReducer from './slices/dictionarySlice'
import userMedicationReducer from './slices/userMedicationsSlice'
import userMeasuringsReducer from './slices/userMeasuringsSlice'
import loadingReducer from './slices/loadingSlice'

export const store = configureStore({
  reducer: {
    medications: medicationsReducer,
    measurings: measuringsReducer,
    visits: visitsReducer,
    contacts: contactsReducer,
    dictionary: dictionaryReducer,
    userMedications: userMedicationReducer,
    userMeasurings: userMeasuringsReducer,
    loading: loadingReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch