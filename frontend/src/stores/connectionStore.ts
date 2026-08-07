import { create } from "zustand";

const RESET_TIMER = 10000;

type ConnectionStatus = "idle" | "retrying" | "reconnected" | "failed";

interface ConnectionState {

    status: ConnectionStatus;
    //isRetrying: boolean;
    retryCount: number;
    maxRetries: number;

    startRetry: (retryCount: number, maxRetries: number) => void;
    showReconnected: () => void;
    showFailed: () => void;
    reset: () => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
    status: "idle",
    retryCount: 0,
    maxRetries: 0,

    startRetry: (retryCount, maxRetries) => 
        set({ status:"retrying", retryCount, maxRetries }),

    showReconnected: () => {
        set({status: "reconnected"});
        setTimeout(() => {
            set({status: "idle"});
        }, RESET_TIMER);
    },
    showFailed: () => {
        set({status:"failed"});
        setTimeout(() => {
            set({status: "idle"});
        }, RESET_TIMER);
    },

    reset: () => set({status: "idle", retryCount:0, maxRetries:0})
}));