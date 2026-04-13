import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
  unreadMessages: {},

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  // setSelectedUser: (selectedUser) => set({ selectedUser }),
  setSelectedUser: (user) => {
  set({ selectedUser: user });

  // clear unread messages when opening chat
  get().clearUnread(user._id);
},

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      console.log("chat partner here",res);
      set({ chats: res.data });
    } catch (error) {
      console.log("chat partner nigga here",error);

      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();
    // const { socket} = get();
    const tempId = `temp-${Date.now()}`;

//     socket.emit("sendMessage", {
//   ...messageData,
//   receiverId: selectedUser._id,
// });
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true, // flag to identify optimistic messages (optional)
    };
    // immidetaly update the ui by adding the message
    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: messages.concat(res.data) });
    } catch (error) {
      // remove optimistic message on failure
      set({ messages: messages });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;


    const socket = useAuthStore.getState().socket;

    // socket.on("newMessage", (newMessage) => {
    //   const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
    //   if (!isMessageSentFromSelectedUser) return;

    //   const currentMessages = get().messages;
    //   set({ messages: [...currentMessages, newMessage] });

    //   if (isSoundEnabled) {
    //     const notificationSound = new Audio("/sounds/notification.mp3");

    //     notificationSound.currentTime = 0; // reset to start
    //     notificationSound.play().catch((e) => console.log("Audio play failed:", e));
    //   }
    // });

    socket.on("newMessage", (newMessage) => {
  const { selectedUser } = get();

  if (selectedUser?._id === newMessage.senderId) {
    // user is currently in chat → show message
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  } else {
    // user NOT in chat → increase unread count
    get().incrementUnread(newMessage.senderId);
  }

  if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");

        notificationSound.currentTime = 0; // reset to start
        notificationSound.play().catch((e) => console.log("Audio play failed:", e));
      }
});
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  incrementUnread: (senderId) =>
  set((state) => ({
    unreadMessages: {
      ...state.unreadMessages,
      [senderId]: (state.unreadMessages[senderId] || 0) + 1,
    },
  })),

  clearUnread: (userId) =>
  set((state) => {
    const updated = { ...state.unreadMessages };
    delete updated[userId];
    return { unreadMessages: updated };
  }),

}));
