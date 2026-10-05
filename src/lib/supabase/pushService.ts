import { supabase } from './client';

// Converts the VAPID public key string into a Uint8Array
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const enablePushNotifications = async (userId: string) => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Push notifications are not supported by this browser.');
  }

  // Ensure the service worker is registered and ready
  const registration = await navigator.serviceWorker.ready;

  // Ask for permission and subscribe
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
  });

  // Extract the raw keys from the subscription object
  const subData = JSON.parse(JSON.stringify(subscription));

  // Save to Supabase
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({
      user_id: userId,
      endpoint: subData.endpoint,
      auth: subData.keys.auth,
      p256dh: subData.keys.p256dh
    }, { onConflict: 'user_id, endpoint' });

  if (error) throw error;
  return true;
};