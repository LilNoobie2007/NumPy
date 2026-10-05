import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push";

// Zomato/Swiggy Style Notification Arrays
const NOTIFICATIONS = {
  breakfast: [
    "Even my WiFi has a better connection than your stomach right now. Eat something! 🥐",
    "Breakfast is the most important meal. Don't make me come over there! 🍳",
    "Your tea/coffee is getting lonely. Pair it with some breakfast! ☕"
  ],
  lunch: [
    "Your stomach is growling louder than my code compiling. Time for lunch! 🍛",
    "Hanger management alert: Please insert food to continue. 🥪",
    "Skipping lunch is a red flag. Be a green flag, Diya. 🥗"
  ],
  dinner: [
    "Dinner date with your plate? Don't leave it hanging! 🍝",
    "You survived the day! Now reward yourself with dinner. 🍲",
    "I'm legally required to remind you to eat dinner. (Not really, but do it anyway). 🍕"
  ],
  steps: [
    "Your sneakers are filing a missing persons report. Let's get moving! 👟",
    "Forgot to walk? Your step counter is bored. 🚶‍♀️",
    "Zero steps? Are you levitating today? Touch some grass! 🌿"
  ],
  water: [
    "You are 70% water, don't let it drop to 69%. Hydrate! 💧",
    "Desert mode activated. Drink water now! 🚰",
    "Your kidneys called. They want a drink. 🥤"
  ]
};

serve(async (req) => {
  const url = new URL(req.url);
  const alertType = url.searchParams.get('type') as keyof typeof NOTIFICATIONS || 'water';
  
  // Get today's date in YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  webpush.setVapidDetails(
    'mailto:notifications@numpy.app',
    Deno.env.get('VAPID_PUBLIC_KEY') ?? '',
    Deno.env.get('VAPID_PRIVATE_KEY') ?? ''
  );

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { data: subscriptions, error } = await supabase.from('push_subscriptions').select('*');
  if (error || !subscriptions) {
    return new Response(JSON.stringify({ error: 'Failed to fetch subscriptions' }), { status: 500 });
  }

  let sentCount = 0;

  const promises = subscriptions.map(async (sub) => {
    try {
      // Check if user has already logged data for today
      // IMPORTANT: Update 'daily_logs' and column names to match your actual database schema
      const { data: logs } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', sub.user_id)
        .eq('date', today)
        .single();

      // Conditional skips based on what she has already logged
      if (logs) {
        if (alertType === 'breakfast' && logs.breakfast_logged) return;
        if (alertType === 'lunch' && logs.lunch_logged) return;
        if (alertType === 'dinner' && logs.dinner_logged) return;
        if (alertType === 'steps' && logs.steps > 0) return; // Customize threshold if needed
        if (alertType === 'water' && logs.water_glasses > 4) return;
      }

      // Pick random witty message
      const messages = NOTIFICATIONS[alertType] || NOTIFICATIONS['water'];
      const randomBody = messages[Math.floor(Math.random() * messages.length)];

      const payload = JSON.stringify({
        title: 'NumPy Check-In 👀',
        body: randomBody,
        url: '/'
      });

      await webpush.sendNotification({
        endpoint: sub.endpoint,
        keys: { auth: sub.auth, p256dh: sub.p256dh }
      }, payload);

      sentCount++;
    } catch (err: any) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        await supabase.from('push_subscriptions').delete().eq('id', sub.id);
      }
    }
  });

  await Promise.all(promises);

  return new Response(JSON.stringify({ success: true, processed: subscriptions.length, sent: sentCount }), {
    headers: { "Content-Type": "application/json" }
  });
});