'use client'

import { useState } from 'react'
import { Upload, Rocket, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getUserAddress } from '@/lib/stacks'

export default function Submit() {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    contractAddress: '',
    description: '',
    creatorWallet: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const creator = formData.creatorWallet || (await getUserAddress()) || 'SP_UNKNOWN_WALLET'
    
    // @ts-ignore
    const { error } = await supabase.from('tokens').insert({
      name: formData.name,
      symbol: formData.symbol,
      contract_address: formData.contractAddress,
      description: formData.description,
      creator_wallet: creator,
      votes_count: 0
    })

    setIsSubmitting(false)
    
    if (error) {
      console.error(error)
      alert("Error submitting token: " + error.message)
    } else {
      alert("Token submitted successfully!")
      setFormData({ name: '', symbol: '', contractAddress: '', description: '', creatorWallet: '' })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Submit Meme Coin</h1>
        <p className="text-muted-foreground">List your token on Stacksmemer to get discovery and votes from the community.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-xl flex gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-primary shrink-0" />
          <p className="text-foreground">
            Ensure your smart contract is verified and launched on the mainnet. We manually review all submissions to protect our community against scams.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Token Name <span className="text-red-500">*</span></label>
              <input 
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Stacks Pepe" 
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="symbol" className="text-sm font-medium">Token Symbol <span className="text-red-500">*</span></label>
              <input 
                id="symbol"
                name="symbol"
                required
                value={formData.symbol}
                onChange={handleChange}
                placeholder="e.g. SPEPE" 
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="contractAddress" className="text-sm font-medium">Contract Address <span className="text-red-500">*</span></label>
            <input 
              id="contractAddress"
              name="contractAddress"
              required
              value={formData.contractAddress}
              onChange={handleChange}
              placeholder="e.g. SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS.stacks-pepe" 
              className="w-full px-4 py-3 bg-background border border-border rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <textarea 
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell the community about your meme coin..." 
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Logo Upload</label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center bg-background/50 hover:bg-background transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 2MB. Square ratio recommended.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="creatorWallet" className="text-sm font-medium">Creator Wallet Address</label>
            <input 
              id="creatorWallet"
              name="creatorWallet"
              value={formData.creatorWallet}
              onChange={handleChange}
              placeholder="Leave empty to use connected wallet" 
              className="w-full px-4 py-3 bg-background border border-border rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Launch Token listing
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
