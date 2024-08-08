import { createSlice } from '@reduxjs/toolkit';

import { DEFAULT_PROMPTS, MESSAGE_ROLE, MESSAGE_TYPES } from '@/constants/bots';

import fetchChat from '../thunks/fetchChat';
import { fetchDiscoveryLibraries } from '../thunks/fetchDiscoveryLibraries';

const initialState = {
  input: '',
  error: null,
  emaChat: {},
  chat: {},
  sessions: {},
  typing: false,
  chatUser: null,
  more: false,
  openSettingsChat: false,
  fullyScrolled: true,
  infoChatOpened: false,
  started: false,
  loading: false,
  sessionLoaded: false,
  historyLoaded: false,
  streamingDone: false,
  streaming: false,
  displayQuickActions: false,
  actionType: null,
  defaultPrompts: DEFAULT_PROMPTS,
  discoveryLibraries: [],
  selectedDiscoveryLibraryId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // eslint-disable-next-line no-unused-vars
    resetChat: (state, _) => ({
      ...initialState,
      sessions: state.sessions,
      discoveryLibraries: state.discoveryLibraries,
    }),
    setInput: (state, action) => {
      state.input = action.payload;
    },
    setChatUser: (state, action) => {
      state.chatUser = action.payload;
    },
    setMore: (state, action) => {
      const { role } = action.payload;
      if (role === 'toggle') state.more = !state.more;
      if (role === 'shutdown') state.more = false;
    },
    openInfoChat: (state) => {
      state.infoChatOpened = true;
      state.more = false;
    },
    closeInfoChat: (state) => {
      state.infoChatOpened = false;
    },
    closeSettingsChat: (state) => {
      state.openSettingsChat = false;
    },
    setMessages: (state, action) => {
      const { role, response } = action.payload;

      if (role === MESSAGE_ROLE.HUMAN) {
        const message = {
          role,
          type: MESSAGE_TYPES.TEXT,
          payload: {
            text: state.input,
          },
        };

        return {
          ...state,
          chat: {
            ...state.chat,
            messages: [...(state.chat?.messages || []), message],
          },
          input: '',
        };
      }

      return {
        ...state,
        chat: {
          ...state.chat,
          messages: [...(state.chat?.messages || []), response],
        },
        input: '',
      };
    },
    setSessionLoaded: (state, action) => {
      state.sessionLoaded = action.payload;
    },
    setHistoryLoaded: (state, action) => {
      state.historyLoaded = action.payload;
    },
    setChatSession: (state, action) => {
      const session = action.payload;

      localStorage.setItem('sessionId', session.id);

      state.chat = session;
    },
    setTyping: (state, action) => {
      state.typing = action.payload;
    },
    setFullyScrolled: (state, action) => {
      state.fullyScrolled = action.payload;
    },
    setStreamingDone: (state, action) => {
      state.streamingDone = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setChatStarted: (state, action) => {
      state.started = action.payload;
    },
    setSelectedOption: (state, action) => {
      const { selectedOption, questionId } = action.payload;
      state.emaChat = {
        ...state.emaChat,
        questionId,
        choice: selectedOption,
      };
    },
    setStreaming: (state, action) => {
      state.streaming = action.payload;
    },
    setExerciseId: (state, action) => {
      state.exerciseId = action.payload;
    },
    setDisplayQuickActions: (state, action) => {
      state.displayQuickActions = action.payload;
    },
    setActionType: (state, action) => {
      state.actionType = action.payload;
    },
    setDefaultPrompt: (state, action) => {
      if (action.payload) {
        state.defaultPrompts = action.payload;
      } else {
        state.defaultPrompts = DEFAULT_PROMPTS;
      }
    },
    setSelectedDiscoveryLibraryId: (state, action) => {
      state.selectedDiscoveryLibraryId = action.payload;
      const selectedLibrary = state.discoveryLibraries.find(
        (library) => library.id === action.payload
      );

      if (selectedLibrary) {
        state.defaultPrompts = selectedLibrary.defaultPrompts;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChat.pending, (state) => {
        state.sessionLoaded = false;
        state.error = null;
      })
      .addCase(fetchChat.fulfilled, (state, action) => {
        state.chat = action.payload;
        state.sessionLoaded = true;
        state.selectedDiscoveryLibraryId = null;

        if (state.discoveryLibraries) {
          const discoveryLibraryId = action.payload?.discoveryLibraryId;
          if (discoveryLibraryId !== undefined && discoveryLibraryId !== null) {
            state.selectedDiscoveryLibraryId = discoveryLibraryId;
          }
        }

        state.error = null;
      })
      .addCase(fetchChat.rejected, (state, action) => {
        state.chat = {};
        state.sessionLoaded = true;
        console.error(action.error);
        state.error = 'Could not fetch chat. Please try again.';
      })
      .addCase(fetchDiscoveryLibraries.fulfilled, (state, action) => {
        state.discoveryLibraries = action.payload;
      })
      .addCase(fetchDiscoveryLibraries.rejected, (state, action) => {
        state.discoveryLibraries = null;
        console.error(action.error);
        state.error = 'Could not fetch discovery libraries. Please try again.';
      });
  },
});

export const {
  setInput,
  setMessages,
  setChatUser,
  setMore,
  setSessionLoaded,
  setChatSession,
  openInfoChat,
  closeSettingsChat,
  closeInfoChat,
  setTyping,
  setBotFeature,
  setFullyScrolled,
  resetChat,
  setExerciseId,
  setError,
  setChatStarted,
  setStreamingDone,
  setSelectedOption,
  setEMAMessages,
  resetExplainMyAnswer,
  setStreaming,
  setHistoryLoaded,
  setDisplayQuickActions,
  setActionType,
  setSelectedDiscoveryLibraryId,
} = chatSlice.actions;

export default chatSlice.reducer;
