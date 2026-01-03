import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type PanelSide = 'left' | 'right' | 'top' | 'bottom';
export type PanelContent =
  | 'navigation'
  | 'wallet'
  | 'settings'
  | 'anime-list'
  | 'notifications'
  | null;

interface PanelState {
  isOpen: boolean;
  content: PanelContent;
}

interface UIState {
  panels: Record<PanelSide, PanelState>;
}

const initialState: UIState = {
  panels: {
    left: { isOpen: false, content: 'navigation' },
    right: { isOpen: false, content: null },
    top: { isOpen: false, content: null },
    bottom: { isOpen: false, content: null },
  },
};

export const panelSlice = createSlice({
  name: 'panel',
  initialState,
  reducers: {
    /**
     * Opens a specific panel with content
     */
    openPanel: (
      state,
      action: PayloadAction<{ side: PanelSide; content: PanelContent }>
    ) => {
      const { side, content } = action.payload;
      state.panels[side].isOpen = true;
      state.panels[side].content = content;
    },

    /**
     * Closes a specific panel
     */
    closePanel: (state, action: PayloadAction<PanelSide>) => {
      state.panels[action.payload].isOpen = false;
    },

    /**
     * Toggles a specific panel
     */
    togglePanel: (
      state,
      action: PayloadAction<{ side: PanelSide; content: PanelContent }>
    ) => {
      const { side, content } = action.payload;
      const panel = state.panels[side];

      if (panel.isOpen && panel.content === content) {
        panel.isOpen = false;
      } else {
        panel.isOpen = true;
        panel.content = content;
      }
    },

    /**
     * Closes all open panels at once
     */
    closeAllPanels: (state) => {
      (Object.keys(state.panels) as PanelSide[]).forEach((side) => {
        state.panels[side].isOpen = false;
      });
    },
  },
});

export const { openPanel, closePanel, togglePanel, closeAllPanels } =
  panelSlice.actions;
export default panelSlice.reducer;
