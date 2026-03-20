import { Target, TrendingUp, Clock, CheckCircle2, Pause, Play } from 'lucide-react';

// TODO: Remind user to connect campaigns to Supabase later
// This page currently uses mock data for demonstration

const CAMPAIGNS = [
  {
    title: 'Volume Boost Campaign',
    status: 'active' as const,
    targetVol: '$500K', currentVol: '$337K',
    progress: 67,
    duration: '7 days', timeLeft: '2d 14h left',
    tokens: 12,
  },
  {
    title: 'New Token Promotion',
    status: 'paused' as const,
    targetVol: '$250K', currentVol: '$89K',
    progress: 36,
    duration: '5 days', timeLeft: '3d 8h left',
    tokens: 5,
  },
  {
    title: 'Holiday Special',
    status: 'completed' as const,
    targetVol: '$1M', currentVol: '$1.2M',
    progress: 100,
    duration: '14 days', timeLeft: null,
    tokens: 25,
  },
];

const STATUS_STYLES = {
  active: 'bg-green-500/10 text-green-500',
  paused: 'bg-orange-500/10 text-orange-500',
  completed: 'bg-blue-500/10 text-blue-500',
};

const ACTIVITY = [
  { title: 'Volume Boost Campaign', sub: 'Target reached: $500K', status: 'completed' as const, label: 'Completed' },
  { title: 'New Token Promotion', sub: 'Paused by user', status: 'paused' as const, label: 'Paused' },
  { title: 'Weekend Special', sub: 'Started 2 hours ago', status: 'active' as const, label: 'Active' },
];

export default function CampaignsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Campaigns</h1>
        <p className="text-muted-foreground text-sm">Manage and track your meme token marketing campaigns</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#131316] border border-border">
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5"><Target className="w-3 h-3" /> Active Campaigns</div>
          <div className="text-xl font-bold">1</div>
        </div>
        <div className="p-4 rounded-xl bg-[#131316] border border-border">
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5"><TrendingUp className="w-3 h-3" /> Total Volume</div>
          <div className="text-xl font-bold">$426K</div>
        </div>
        <div className="p-4 rounded-xl bg-[#131316] border border-border">
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Avg Duration</div>
          <div className="text-xl font-bold">8.7 days</div>
        </div>
        <div className="p-4 rounded-xl bg-[#131316] border border-border">
          <div className="text-xs text-muted-foreground mb-1">
            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold">Success Rate</span>
          </div>
          <div className="text-xl font-bold text-green-500">84.3%</div>
        </div>
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CAMPAIGNS.map((c, i) => (
          <div key={i} className="p-5 rounded-2xl bg-[#131316] border border-border hover:border-border/80 hover:-translate-y-0.5 transition-all flex flex-col">
            <div className="flex items-start justify-between mb-5">
              <h3 className="font-bold text-foreground leading-tight max-w-[60%]">{c.title}</h3>
              <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${STATUS_STYLES[c.status]}`}>
                {c.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                {c.status === 'paused' && <Pause className="w-2.5 h-2.5" />}
                {c.status === 'completed' && <CheckCircle2 className="w-2.5 h-2.5" />}
                {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <div className="text-[11px] text-muted-foreground mb-0.5">Target Volume</div>
                <div className="text-lg font-bold">{c.targetVol}</div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground mb-0.5">Current Volume</div>
                <div className="text-lg font-bold">{c.currentVol}</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{c.progress}%</span>
              </div>
              <div className="h-1 bg-card rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" style={{ width: `${Math.min(c.progress, 100)}%` }} />
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.duration}</span>
              {c.timeLeft && <span>{c.timeLeft}</span>}
              <span>{c.tokens} tokens</span>
            </div>
            {c.status !== 'completed' && (
              <button className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-card transition-colors">
                {c.status === 'active' ? <><Pause className="w-3.5 h-3.5" /> Pause Campaign</> : <><Play className="w-3.5 h-3.5" /> Resume Campaign</>}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="p-5 rounded-2xl bg-[#131316] border border-border">
        <h3 className="font-bold mb-4">Recent Campaign Activity</h3>
        <div className="divide-y divide-border/50">
          {ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-center justify-between py-3.5">
              <div>
                <div className="font-semibold text-sm">{a.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{a.sub}</div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${STATUS_STYLES[a.status]}`}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
