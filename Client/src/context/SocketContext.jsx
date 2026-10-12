import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Create socket connection
    const newSocket = io("http://localhost:3001", {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    newSocket.on("connect", () => {
      console.log("🔌 Socket connected:", newSocket.id);

      // If user is logged in, join their room
      if (user) {
        newSocket.emit("join-user-room", user._id);

        // If admin, join admin room
        if (user.role === "admin") {
          newSocket.emit("join-admin-room");
        }
      }
    });

    newSocket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  // Join user room when user changes
  useEffect(() => {
    if (socket && user) {
      socket.emit("join-user-room", user._id);
      if (user.role === "admin") {
        socket.emit("join-admin-room");
      }
    }
  }, [socket, user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
