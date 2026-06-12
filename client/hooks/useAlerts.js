import { useState, useEffect } from 'react';
import socket from '../services/socket';

export const useAlerts = (user) => {
    const [activeAlerts, setActiveAlerts] = useState([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
      const roomId = user?.org || user?._id;
      if (!roomId) return;
      console.log('useAlerts connecting, roomId:', roomId);

      // connect and join org room
      socket.connect();

      socket.on("connect", () => {
        console.log('socket connected successfully');
        setConnected(true);
        socket.emit("join_org", roomId);
        socket.emit("get_active_alerts", { orgId: roomId });
      });

      // New alert received
      socket.on("new_alert", (alert) => {
        setActiveAlerts((prev) => [alert, ...prev]);
      });

      // Alert cleared
      socket.on("alert_cleared", (updated) => {
        setActiveAlerts((prev) => prev.filter((a) => a._id !== updated._id));
      });

      // Load exsisting active alerts
      socket.on("active_alerts", (alerts) => {
        setActiveAlerts(alerts);
      });

      socket.on("disconnect", () => {
        setConnected(false);
      });

      return () => {
        socket.off("connect");
        socket.off("new_alert");
        socket.off("alert_cleared");
        socket.off("active_alerts");
        socket.off("disconnect");
        socket.disconnect();
      };
    }, [user]);

    const sendAlert = (section, button, action) => {
        const roomId = user?.org || user?._id;
        if (!roomId) return;
        socket.emit('send_alert', {
            orgId: user?.org || user?._id,
            sentBy: user._id,
            section,
            button,
            action,
        });
    };

    const clearAlert = (alertId) => {
        const roomId = user?.org || user?._id;
        if (!roomId) return;
        socket.emit('clear_alert', {
            alertId,
            clearedBy: user._id,
            orgId: user?.org || user?._id,
        });
    };

    return { activeAlerts, connected, sendAlert, clearAlert };
}