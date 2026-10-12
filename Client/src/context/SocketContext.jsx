import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    // Don't create multiple sockets
    if (socketRef.current) return;

    console.log("🔌 Initializing socket connection...");

    const newSocket = io("http://localhost:3001", {
      transports: ["polling", "websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      timeout: 20000,
      forceNew: false,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
    });

    newSocket.on("connect_error", (error) => {
      // Only log if not a normal disconnection
      if (error.message !== "websocket error") {
        console.log("⚠️ Socket connection error:", error.message);
      }
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // ✅ Cleanup on unmount only
    return () => {
      if (socketRef.current) {
        console.log("🧹 Closing socket connection");
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []); // ✅ Empty dependency array - only run once

  // ✅ Join rooms separately when user changes (doesn't recreate socket)
  useEffect(() => {
    if (!socket || !user) return;

    console.log("👤 Joining user room:", user._id);
    socket.emit("join-user-room", user._id);

    if (user.role === "admin") {
      console.log("👑 Joining admin room");
      socket.emit("join-admin-room");
    }
  }, [socket, user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
