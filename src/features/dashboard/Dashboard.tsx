import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Bell, Calendar, ChevronLeft, ChevronRight, Droplets, Footprints, Flame, HeartPulse, MoreHorizontal, Plus, Settings, Sparkles, Target, Users, Weight } from 'lucide-react';
import { useAuth } from '../../app/providers/AuthProvider';
import { supabase } from '../../lib/supabase/client';

const week = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const chart = [44, 58, 52, 72, 63, 82, 76];

const FLIRTY_QUOTES = [
  "You look dangerously good today, [NAME]. Don't forget your water!",
  "Just a reminder that you're the prettiest girl I know. Now go log your steps.",
  "I was just thinking about you. (Also, drink some water).",
  "Looking at you makes me smile. Keep crushing it today, [NAME].",
  "You're literally glowing today.",
  "I'm saving my appetite for our next dinner date. Until then, log your meals, [NAME]!",
  "Hope your day is as beautiful as you are.",
  "Just dropping by to remind you how much I adore you.",
  "Take a break, drink some water, and remember you're amazing, [NAME].",
  "You make everything better just by existing.",
  "I love you more than you love ignoring your step count. (Go walk, [NAME]!)",
  "Hey [NAME], don't forget to take care of yourself today.",
  "Even the prettiest beach sunset has nothing on you.",
  "You always look so perfect, even when you're just logging your stats.",
  "My favorite time of day is whenever I'm talking to you.",
  "You're my favorite person to watch the sunset with.",
  "Stop looking so good and start logging your food, [NAME]!",
  "Just checking in on my favorite person in the world.",
  "I'd trade a perfect evening by the water just to see you smile.",
  "Walking is good for your heart, but you already have mine."
];

// Added animation logic to the GlassCard
function GlassCard({ children, className = '', delay = '0ms' }: { children: React.ReactNode; className?: string, delay?: string }) {
  return (
    <section 
      className={`glass-card animate-slide-up ${className}`} 
      style={{ animationDelay: delay }}
    >
      {children}
    </section>
  );
}

function Ring({ progress }: { progress: number }) {
  const radius = 108;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="heart-ring breathing" aria-label={`${Math.round(progress * 100)} percent complete`}>
      <svg viewBox="0 0 240 240" aria-hidden="true">
        <defs>
          <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#ff8c72" />
            <stop offset=".48" stopColor="#ff5f83" />
            <stop offset="1" stopColor="#9b87ff" />
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <circle cx="120" cy="120" r={radius} className="ring-track" />
        <circle cx="120" cy="120" r={radius} className="ring-progress" stroke="url(#ringGradient)" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} filter="url(#glow)" />
      </svg>
      <div className="ring-copy">
        <HeartPulse size={18} />
        <strong>{Math.round(progress * 100)}%</strong>
        <span>day in rhythm</span>
      </div>
    </div>
  );
}

function Odometer({ value }: { value: string }) {
  return <span className="odometer">{value}</span>;
}

export const Dashboard = () => {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState<string>('');
  const [quoteTemplate] = useState(() => FLIRTY_QUOTES[Math.floor(Math.random() * FLIRTY_QUOTES.length)]);

  const [steps, setSteps] = useState(3742);
  const [water, setWater] = useState(5);
  const [stepGoal, setStepGoal] = useState(5000);
  const [day, setDay] = useState(0);
  const [isOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const fetchName = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();
      
      if (data?.display_name) setDisplayName(data.display_name);
    };
    fetchName();
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const addWater = () => setWater((current) => Math.min(8, current + 1));
  const addSteps = () => setSteps((current) => Math.min(stepGoal, current + 250));

  const progress = Math.min(1, (steps / stepGoal + water / 8) / 2);
  const activeName = displayName || user?.user_metadata?.first_name || 'Diya';
  const firstInitial = activeName.charAt(0).toUpperCase() || 'D';
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning 🌸' : hour < 18 ? 'Good afternoon ☀️' : 'Good evening 🌙';
  const finalQuote = quoteTemplate.replace(/[NAME]/g, activeName);

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <div className="app-frame">
        
        <header className="topbar">
          <div className="brand-mark">
            <span>n</span>
            <div><b>numpy</b><small>your daily rhythm</small></div>
          </div>
          <div className="top-actions">
            {isOffline && <span className="sync-pill"><span className="sync-dot" />Syncing paused</span>}
            <button className="icon-button" onClick={() => navigate('/calendar')} aria-label="Calendar"><Calendar size={18} /></button>
            <button className="icon-button" onClick={() => navigate('/companion')} aria-label="Companion"><Users size={18} /></button>
            <button className="icon-button" onClick={() => navigate('/settings')} aria-label="Settings"><Settings size={18} /></button>
            <button className="avatar" onClick={handleSignOut} title="Sign Out" aria-label="Sign out">{firstInitial}</button>
          </div>
        </header>

        <div className="date-row">
          <button className="icon-button" onClick={() => setDay((v) => v - 1)}><ChevronLeft /></button>
          <div>
            <span className="eyebrow">{day === 0 ? 'Today' : day < 0 ? 'Yesterday' : 'Tomorrow'}</span>
            <h1>{day === 0 ? 'Thursday, October 21' : day < 0 ? 'Wednesday, October 20' : 'Friday, October 22'}</h1>
          </div>
          <button className="icon-button" onClick={() => setDay((v) => v + 1)}><ChevronRight /></button>
        </div>

        <div className="dashboard-grid">
          
          <GlassCard className="hero-card" delay="0ms">
            <div className="card-kicker"><span><Sparkles size={14} />Daily overview</span><button className="more-button"><MoreHorizontal /></button></div>
            <div className="hero-content">
              <Ring progress={progress} />
              <div className="hero-message">
                <span className="eyebrow">{greeting.toUpperCase()}</span>
                <h2>Your rhythm<br /><em>is taking shape.</em></h2>
                <p>{finalQuote}</p>
                <button className="primary-button breathing" onClick={addSteps}><Plus size={17} /> Log a moment</button>
              </div>
            </div>
            <div className="ring-legend">
              <span><i className="legend-dot coral" />Movement <b>{Math.round(steps / 50)}%</b></span>
              <span><i className="legend-dot violet" />Hydration <b>{Math.round(water / 8 * 100)}%</b></span>
              <span><i className="legend-dot gold" />Recovery <b>62%</b></span>
            </div>
          </GlassCard>

          <GlassCard className="steps-card" delay="75ms">
            <div className="card-kicker"><span><Footprints size={15} />Movement</span><Target size={17} /></div>
            <div className="metric-head">
              <div><Odometer value={steps.toLocaleString()} /><span className="metric-label">steps</span></div>
              <span className="metric-badge">+12.4%</span>
            </div>
            <div className="progress-line"><span style={{ width: `${Math.min(100, steps / stepGoal * 100)}%` }} /></div>
            <div className="card-footer">
              <span><b>{stepGoal.toLocaleString()}</b> daily goal</span>
              <button className="text-button" onClick={() => setStepGoal(stepGoal === 5000 ? 7500 : 5000)}>Edit goal</button>
            </div>
            <button className="secondary-button" onClick={addSteps}><Plus size={16} /> Add 250 steps</button>
          </GlassCard>

          <GlassCard className="water-card" delay="150ms">
            <div className="card-kicker"><span><Droplets size={15} />Hydration</span><span className="small-muted">{water} / 8 glasses</span></div>
            <div className="water-layout">
              <div className="water-vessel">
                <div className="water-fill" style={{ height: `${Math.min(100, Math.max(0, water / 8 * 100))}%` }}><span /></div>
                <Droplets className="vessel-icon" />
              </div>
              <div>
                <Odometer value={`${water * 250}`} />
                <span className="metric-label">ml today</span>
                <p className="support-copy">Keep your energy<br />flowing smoothly.</p>
                <button className="secondary-button" onClick={addWater}><Plus size={16} /> Add glass</button>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="weekly-card" delay="225ms">
            <div className="card-kicker"><span><Activity size={15} />Weekly progress</span><span className="small-muted">Steps · This week</span></div>
            <div className="chart-wrap">
              <svg viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ff7b83" stopOpacity=".28" /><stop offset="1" stopColor="#ff7b83" stopOpacity="0" /></linearGradient>
                </defs>
                <path className="chart-area" d="M0 110 C45 92 62 86 95 94 S145 66 180 78 S230 42 260 59 S310 74 335 46 S385 60 410 32 S470 43 500 24 V150 H0Z" />
                <path className="chart-line" d="M0 110 C45 92 62 86 95 94 S145 66 180 78 S230 42 260 59 S310 74 335 46 S385 60 410 32 S470 43 500 24" />
              </svg>
              {week.map((label, index) => <span key={`${label}-${index}`} className={index === 3 ? 'active-day' : ''}>{label}</span>)}
            </div>
            <div className="chart-stat">
              <div><b>32,840</b><span>total steps</span></div>
              <div><b className="positive">+18.6%</b><span>vs last week</span></div>
            </div>
          </GlassCard>

          <GlassCard className="small-card" delay="300ms">
            <div className="card-kicker"><span><Flame size={15} />Energy</span><MoreHorizontal size={17} /></div>
            <Odometer value="1,842" />
            <span className="metric-label">active calories</span>
            <div className="mini-bars">{chart.map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div>
          </GlassCard>

          <GlassCard className="small-card weight-card" delay="375ms">
            <div className="card-kicker"><span><Weight size={15} />Body</span><MoreHorizontal size={17} /></div>
            <Odometer value="68.4" />
            <span className="metric-label">kg · trending steady</span>
            <svg className="weight-line" viewBox="0 0 220 44">
              <path d="M4 28 C28 25 35 29 54 24 S82 18 101 22 S132 23 150 19 S181 18 216 16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="small-muted">Last logged 2 days ago</span>
          </GlassCard>

        </div>
      </div>
    </main>
  );
};