export function getApiErrorMessage(error: any, fallback = "Ups!! Algo salió mal"): string {
  try {
    // Axios style error
    const msg = error?.response?.data?.mensaje;
    if (typeof msg === "string" && msg.trim().length > 0) return msg;

    // Fetch style error with already-parsed body
    const fetchMsg = error?.data?.mensaje;
    if (typeof fetchMsg === "string" && fetchMsg.trim().length > 0) return fetchMsg;

    // Direct error with mensaje
    const directMsg = error?.mensaje;
    if (typeof directMsg === "string" && directMsg.trim().length > 0) return directMsg;
  } catch (_) {
    // ignore parsing issues
  }
  return fallback;
}

export function alertApiError(error: any, fallback = "Ups!! Algo salió mal"): void {
  const message = getApiErrorMessage(error, fallback);
  // Simple popup per requirement
  alert(message);
}
