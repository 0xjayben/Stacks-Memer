'use client'

import { useState } from 'react'
import { Upload, Rocket, AlertCircle, Target, Coins } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getUserAddress } from '@/lib/stacks'

export default function Submit() {
  const [tab, setTab] = useState<'token' | 'campaign'>('campaign')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Token Form State
  const [tokenForm, setTokenForm] = useState({ name: '', symbol: '', contractAddress: '', description: '', creatorWallet: '' })
  
  // Campaign Form State
  const [campaignForm, setCampaignForm] = useState({ title: '', description: '', target_stx: '', durationDays: '7', creatorWallet: '' })

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const creator = tokenForm.creatorWallet || (await getUserAddress()) || 'SP_UNKNOWN_WALLET'
    
    // @ts-ignore
    const { error } = await supabase.from('tokens').insert({
      name: tokenForm.name,
      symbol: tokenForm.symbol,
      contract_address: tokenForm.contractAddress,
      description: tokenForm.description,
      creator_wallet: creator,
      votes_count: 0
    })

    setIsSubmitting(false)
    if (error) alert("Error submitting token: " + error.message)
    else {
      alert("Token submitted successfully!")
      setTokenForm({ name: '', symbol: '', contractAddress: '', description: '', creatorWallet: '' })
    }
  }

  const handleCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const creator = campaignForm.creatorWallet || (await getUserAddress()) || 'SP_UNKNOWN_WALLET'
    
    const endsAt = new Date()
    endsAt.setDate(endsAt.getDate() + parseInt(campaignForm.durationDays || '7'))

    const payload = {
      title: campaignForm.title,
      description: campaignForm.description,
      target_stx: parseFloat(campaignForm.target_stx || '0'),
      raised_stx: 0,
      creator_address: creator,
      status: 'active' as const,
      ends_at: endsAt.toISOString()
    }

    // @ts-ignore
    const { error } = await supabase.from('campaigns').insert(payload)

    setIsSubmitting(false)
    if (error) alert("Error launching campaign: " + error.message)
    else {
      alert("Marketing Campaign explicitly launched to the live network database!")
      setCampaignForm({ title: '', description: '', target_stx: '', durationDays: '7', creatorWallet: '' })
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Creator Hub</h1>
        <p className="text-muted-foreground">List a new meme token or launch an ecosystem marketing campaign to securely funnel liquidity tracking.</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setTab('token')} 
          className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 rounded-xl font-semibold transition-all ${tab === 'token' ? 'bg-primary text-primary-foreground' : 'bg-[#131316] text-muted-foreground border border-border hover:bg-card'}`}
        >
          <Coins className="w-4 h-4" /> List Token
        </button>
        <button 
          onClick={() => setTab('campaign')} 
          className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 rounded-xl font-semibold transition-all ${tab === 'campaign' ? 'bg-primary text-primary-foreground' : 'bg-[#131316] text-muted-foreground border border-border hover:bg-card'}`}
        >
          <Target className="w-4 h-4" /> Start Campaign
        </button>
      </div>

      <div className="bg-[#131316] border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        {tab === 'token' && (
          <form onSubmit={handleTokenSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Token Name <span className="text-red-500">*</span></label>
                <input required value={tokenForm.name} onChange={e => setTokenForm({...tokenForm, name: e.target.value})} placeholder="e.g. Stacks Pepe" className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Token Symbol <span className="text-red-500">*</span></label>
                <input required value={tokenForm.symbol} onChange={e => setTokenForm({...tokenForm, symbol: e.target.value})} placeholder="e.g. SPEPE" className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contract Address <span className="text-red-500">*</span></label>
              <input required value={tokenForm.contractAddress} onChange={e => setTokenForm({...tokenForm, contractAddress: e.target.value})} placeholder="e.g. SP2Z...stacks-pepe" className="w-full px-4 py-3 bg-background border border-border font-mono rounded-xl focus:outline-none focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea rows={3} value={tokenForm.description} onChange={e => setTokenForm({...tokenForm, description: e.target.value})} placeholder="Tell the community about your meme coin..." className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary resize-none" />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-70 transition-all">
              {isSubmitting ? <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : <><Rocket className="w-5 h-5" /> Launch Token Listing</>}
            </button>
          </form>
        )}

        {tab === 'campaign' && (
          <form onSubmit={handleCampaignSubmit} className="space-y-6">
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl flex gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-primary shrink-0" />
              <p className="text-foreground">
                Campaigns push real-time fundraising targets and ecosystem liquidity tracking visible to the entire community via the Live Data module.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign Target/Title <span className="text-red-500">*</span></label>
              <input required value={campaignForm.title} onChange={e => setCampaignForm({...campaignForm, title: e.target.value})} placeholder="e.g. Reach $10M Volume on Stacks Mainnet" className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Funding Goal (STX) <span className="text-red-500">*</span></label>
                <input required type="number" min="1" value={campaignForm.target_stx} onChange={e => setCampaignForm({...campaignForm, target_stx: e.target.value})} placeholder="10000" className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (Days) <span className="text-red-500">*</span></label>
                <input required type="number" min="1" max="90" value={campaignForm.durationDays} onChange={e => setCampaignForm({...campaignForm, durationDays: e.target.value})} className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign Description <span className="text-red-500">*</span></label>
              <textarea required rows={4} value={campaignForm.description} onChange={e => setCampaignForm({...campaignForm, description: e.target.value})} placeholder="Explain what the funding milestones will be utilized for..." className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary resize-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Wallet Address Override (Optional)</label>
              <input value={campaignForm.creatorWallet} onChange={e => setCampaignForm({...campaignForm, creatorWallet: e.target.value})} placeholder="Leave blank to use automatically connected wallet..." className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none font-mono text-sm focus:border-primary" />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-pink-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-pink-700 disabled:opacity-70 transition-all">
              {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Target className="w-5 h-5" /> Execute Campaign Creation</>}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
