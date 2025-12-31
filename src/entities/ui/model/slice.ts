import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  interactiveCube: {
    isOpen: boolean;
    activePosterId: string | null;
  };
}

const initialState: UIState = {
  interactiveCube: {
    isOpen: false,
    activePosterId: null,
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Triggers the interactive cube to fly in with a specific poster
     */
    openInteractiveCube: (state, action: PayloadAction<string>) => {
      state.interactiveCube.isOpen = true;
      state.interactiveCube.activePosterId = action.payload;
    },
    /**
     * Closes the cube and resets its data
     */
    closeInteractiveCube: (state) => {
      state.interactiveCube.isOpen = false;
      state.interactiveCube.activePosterId = null;
    },
  },
});

export const { openInteractiveCube, closeInteractiveCube } = uiSlice.actions;
