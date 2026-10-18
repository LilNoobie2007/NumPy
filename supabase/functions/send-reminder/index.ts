import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push";

// Push notification templates with [NAME] placeholders
const NOTIFICATIONS = {
  breakfast: [
    "Even my WiFi has a better connection than your stomach right now, [NAME]. Eat something! 🥐",
    "Breakfast is the most important meal. Don't make me come over there, [NAME]! 🍳",
    "Your tea/coffee is getting lonely. Pair it with some breakfast, [NAME]! ☕"
  ],
  lunch: [
    "Your stomach is growling louder than my code compiling. Time for lunch, [NAME]! 🍛",
    "Hanger management alert: Please insert food to continue, [NAME]. 🥪",
    "Skipping lunch is a red flag. Be a green flag, [NAME]. 🥗"
  ],
  dinner: [
    "Dinner date with your plate? Don't leave it hanging, [NAME]! 🍝",
    "You survived the day, [NAME]! Now reward yourself with dinner. 🍲",
    "I'm legally required to remind you to eat dinner. (Not really, but do it anyway, [NAME]). 🍕"
  ],
  steps: [
    "Your sneakers are filing a missing persons report, [NAME]. Let's get moving! 👟",
    "Forgot to walk? Your step counter is bored, [NAME]. 🚶‍♀️",
    "Zero steps? Are you levitating today, [NAME]? Touch some grass! 🌿"
  ],
  water: [
    "You are 70% water, [NAME], don't let it drop to 69%. Hydrate! 💧",
    "Desert mode activated. Drink water now, [NAME]! 🚰",
    "Your kidneys called, [NAME]. They want a drink. 🥤"
  ]
};

serve(async (req) => {
  const url = new URL(req.url);
  const alertType = url.searchParams.get('type') as keyof typeof NOTIFICATIONS || 'water';
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
      // 1. Check daily logs
      const { data: logs } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', sub.user_id)
        .eq('date', today)
        .single();

      if (logs) {
        if (alertType === 'breakfast' && logs.breakfast_logged) return;
        if (alertType === 'lunch' && logs.lunch_logged) return;
        if (alertType === 'dinner' && logs.dinner_logged) return;
        if (alertType === 'steps' && logs.steps > 0) return;
        if (alertType === 'water' && logs.water_glasses > 4) return;
      }

      // 2. Fetch user's profile name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', sub.user_id)
        .single();

      const userName = profile?.display_name || 'gorgeous';

      // 3. Select random template and inject name
      const messages = NOTIFICATIONS[alertType] || NOTIFICATIONS['water'];
      const randomTemplate = messages[Math.floor(Math.random() * messages.length)];
      const customizedBody = randomTemplate.replace(/\[NAME\]/g, userName);

      const payload = JSON.stringify({
        title: 'NumPy Check-In 👀',
        body: customizedBody,
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