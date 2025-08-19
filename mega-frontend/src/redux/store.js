import { configureStore,combineReducers } from '@reduxjs/toolkit'
import userReducer from "./userSlice"
import videoReducer from "./videoSlice"
import channelReducer from "./subsSlice"
import viewReducer from "./viewSlice"
import videoIdreducer from "./videoid"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import playlistReducer from "./playlistSlice"


const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer=combineReducers({user:userReducer,video:videoReducer,channel:channelReducer,views:viewReducer,playlist:playlistReducer,videoId:videoIdreducer})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store= configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware(
    {
      serializableCheck:{
        ignoreActions:[],
      },
    }),
});

export const persistor=persistStore(store)