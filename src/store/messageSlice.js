import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
  },
  reducers: {
    setAllMessages(state, action) {
     state.messages = action.payload
    },
    setNewConversation(state, action) {
      if (action.payload.messageId !== state.messages[0]?.messageId) {
        state.messages.unshift(action.payload);
      }else{
        state.messages.map((message) =>{
          if (message.messageId === action.payload.messageId) {
            message.messages = action.payload.messages;
            message.lastMessagetime = action.payload.lastMessagetime;
          }
        })
      }
    },
    updateMessage(state, action) {
      state.messages.map((message) =>{
        if (message.messageId === action.payload.messageId) {
          message.messages = action.payload.messages;
          message.lastMessagetime = action.payload.lastMessagetime;
        }
      })
    }
  },
});

export const { setAllMessages, setNewConversation, updateMessage } = messageSlice.actions;
export default messageSlice.reducer;
