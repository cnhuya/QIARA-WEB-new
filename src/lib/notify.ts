import { createSignal } from "solid-js";
import { JSX } from "solid-js";

export type NotificationType = "error" | "success" | "info" | "warning";

export type NotificationItem = {
  id: number;
  type: NotificationType;
  header: string;
  message: JSX.Element;
};

const [notification, setNotification] = createSignal<NotificationItem | null>(null);
let timeout: ReturnType<typeof setTimeout>;

export const notify = (type: NotificationType, header: string, message: JSX.Element) => {
  clearTimeout(timeout);
  setNotification({ id: Date.now(), type, header, message });
  timeout = setTimeout(() => setNotification(null), 5000);
};

export const dismiss = () => setNotification(null);
export { notification };