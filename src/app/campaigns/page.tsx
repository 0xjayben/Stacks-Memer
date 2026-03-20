'use client';

import { Target, TrendingUp, Clock, CheckCircle2, Pause, Play, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// This handles mapping the database rows into our visual campaigns.
const STATUS_STYLES = {
  active: 'bg-green-500/10 text-green-500',
  paused: 'bg-orange-500/10 text-orange-500', 
  completed: 'bg-blue-500/10 text-blue-500',
  failed: 'bg-red-500/10 text-red-500'
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // We load the actual records from the active Supabase Data Store for our marketing initiatives
  useEffect(() => {
    async function loadCampaigns() {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (data && !error) {
        setCampaigns(data);
      }
      setLoading(false);
    }
    loadCampaigns();
  }, []);

  const totalRaised = campaigns.reduce((acc, c) => acc + (c.raised_stx || 0), 0);
  const activeCount = campaigns.filter(c => c.status === 'active').length;
  const successRate = campaigns.length > 0 
    ? ((campaigns.filter(c => c.status === 'completed').length / campaigns.length) * 100).toFixed(1)
    : '0.0';
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
          <div className="text-xl font-bold">{loading ? '-' : activeCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#131316] border border-border">
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5"><TrendingUp className="w-3 h-3" /> Total Raised</div>
          <div className="text-xl font-bold">{loading ? '-' : `${totalRaised} STX`}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#131316] border border-border">
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Avg Duration</div>
          <div className="text-xl font-bold">{loading ? '-' : '7 days'}</div>
        </div>
        <div className="p-4 rounded-xl bg-[#131316] border border-border">
          <div className="text-xs text-muted-foreground mb-1">
            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold">Success Rate</span>
          </div>
          <div className="text-xl font-bold text-green-500">{loading ? '-' : `${successRate}%`}</div>
        </div>
      </div>

      {campaigns.length === 0 && !loading && (
        <div className="p-12 text-center rounded-2xl bg-[#131316] border border-border border-dashed">
          <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-2">No Active Campaigns</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Create a marketing campaign to raise funds and drive ecosystem traffic to your favorite tokens.</p>
          <button className="px-6 py-3 bg-primary text-primary-foreground font-bold flex items-center gap-2 rounded-xl mx-auto hover:bg-primary/90 transition-colors">
            <PlusCircle className="w-4 h-4" /> Start New Campaign
          </button>
        </div>
      )}

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((c) => {
          const progress = Math.min(100, Math.floor(((c.raised_stx || 0) / c.target_stx) * 100));
          const endDate = new Date(c.ends_at).getTime();
          const remains = endDate - Date.now();
          const daysLeft = remains > 0 ? Math.floor(remains / (1000 * 60 * 60 * 24)) : 0;
          const statusStyleId = c.status as keyof typeof STATUS_STYLES;

          return (
            <div key={c.id} className="p-5 rounded-2xl bg-[#131316] border border-border hover:border-border/80 hover:-translate-y-0.5 transition-all flex flex-col relative overflow-hidden">
              <div className="flex items-start justify-between mb-5 relative z-10">
                <h3 className="font-bold text-foreground leading-tight max-w-[60%]">{c.title}</h3>
                <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${STATUS_STYLES[statusStyleId]}`}>
                  {c.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                  {c.status === 'paused' && <Pause className="w-2.5 h-2.5" />}
                  {c.status === 'completed' && <CheckCircle2 className="w-2.5 h-2.5" />}
                  {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                </span>
              </div>
              
              <div className="text-xs text-muted-foreground mb-5 line-clamp-2 min-h-8">
                {c.description}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="text-[11px] text-muted-foreground mb-0.5">Target Goal</div>
                  <div className="text-lg font-bold">{c.target_stx} STX</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground mb-0.5">Currently Raised</div>
                  <div className="text-lg font-bold">{c.raised_stx || 0} STX</div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Funding Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1 bg-card rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {daysLeft} days remaining</span>
              </div>
              {c.status === 'active' && (
                <button className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-primary/20 bg-primary/10 text-primary font-bold hover:bg-primary hover:text-primary-foreground transition-all">
                  Contribute STX
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      {campaigns.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#131316] border border-border">
          <h3 className="font-bold mb-4">Recent Campaign Records</h3>
          <div className="divide-y divide-border/50">
            {campaigns.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3.5">
                <div>
                  <div className="font-semibold text-sm">{a.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Created by {a.creator_address.substring(0,6)}...</div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${STATUS_STYLES[a.status as keyof typeof STATUS_STYLES]}`}>{a.status.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
