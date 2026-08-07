import { create } from "zustand";

type ConnectionStatus = "idle" | "retrying" | "reconnected";

interface ConnectionState {

    status: ConnectionStatus;
    //isRetrying: boolean;
    retryCount: number;
    maxRetries: number;

    startRetry: (retryCount: number, maxRetries: number) => void;
    showReconnected: () => void;
    reset: () => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
    status: "idle",
    retryCount: 0,
    maxRetries: 0,

    startRetry: (retryCount, maxRetries) =>
        set({ status:"retrying", retryCount, maxRetries }),

    showReconnected: () => set({status: "reconnected"}),

    reset: () => set({status: "idle", retryCount:0, maxRetries:0})
}));