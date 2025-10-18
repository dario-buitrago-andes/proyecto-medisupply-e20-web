import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

type NotificationContextType = {
  notify: (message: string, severity?: AlertColor, durationMs?: number) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotify(): NotificationContextType {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotify must be used within NotificationProvider");
  return ctx;
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [autoHideDuration, setAutoHideDuration] = useState<number>(5000);

  const notify = useCallback((msg: string, sev: AlertColor = "info", durationMs: number = 5000) => {
    setMessage(msg);
    setSeverity(sev);
    setAutoHideDuration(durationMs);
    setOpen(true);
  }, []);

  const handleClose = useCallback((_e?: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
