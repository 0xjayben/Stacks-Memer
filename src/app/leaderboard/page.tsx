import Link from "next/link"
import { Trophy, ArrowUp, Zap, Sparkles } from "lucide-react"

const MOCK_LEADERBOARD = [
  { rank: 1, id: '1', name: 'Stacks Pepe', symbol: 'SPEPE', logo: '🐸', creator: 'SP2...A4', votes: 12450, change: '+24%' },
  { rank: 2, id: '2', name: 'DogeLayer', symbol: 'DOGEL', logo: '🐕', creator: 'SP3...XJ', votes: 9400, change: '+12%' },
  { rank: 3, id: '3', name: 'StacksCat', symbol: 'SCAT', logo: '🐱', creator: 'SP1...ZZ', votes: 5200, change: '+45%' },
  { rank: 4, id: '4', name: 'InuStacks', symbol: 'INU', logo: '🐶', creator: 'SP5...BY', votes: 3100, change: '+5%' },
  { rank: 5, id: '5', name: 'Spongebob Token', symbol: 'SBOB', logo: '🧽', creator: 'SP8...QW', votes: 2150, change: '-2%' },
  { rank: 6, id: '6', name: 'Pepe Original', symbol: 'PEPE', logo: '🐸', creator: 'SP9...OP', votes: 1980, change: '+1%' },
  { rank: 7, id: '7', name: 'Shiba Stacks', symbol: 'SHIB', logo: '🦊', creator: 'SPX...1Z', votes: 1540, change: '+8%' },
]

export default function Leaderboard() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Global Leaderboard
          </h1>
          <p className="text-muted-foreground">The most upvoted meme coins on the Stacks ecosystem.</p>
        </div>
        
        <div className="flex gap-2 bg-card p-1 rounded-xl border border-border">
          <button className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg shadow-sm">All Time</button>
          <button className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-background font-medium rounded-lg transition-colors">24h</button>
          <button className="px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-background font-medium rounded-lg transition-colors">7d</button>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 items-end">
        {[MOCK_LEADERBOARD[1], MOCK_LEADERBOARD[0], MOCK_LEADERBOARD[2]].map((token, i) => {
          const isFirst = i === 1
          const isSecond = i === 0
          const isThird = i === 2
          
          return (
            <div 
              key={token.id} 
              className={`relative flex flex-col items-center p-6 rounded-2xl border border-border bg-card/50 text-center transition-all hover:bg-card ${
                isFirst ? 'md:-mt-8 md:scale-105 border-yellow-500/50 shadow-[0_0_30px_-5px_rgba(234,179,8,0.2)] z-10' : ''
              } ${isSecond ? 'border-gray-400/50' : ''} ${isThird ? 'border-orange-600/50' : ''}`}
            >
              {isFirst && <div className="absolute -top-4 bg-yellow-500 text-yellow-950 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><Sparkles className="w-3 h-3"/> #1 TRENDING</div>}
              {isSecond && <div className="absolute -top-3 bg-gray-300 text-gray-800 text-xs font-bold px-3 py-0.5 rounded-full">#2</div>}
              {isThird && <div className="absolute -top-3 bg-orange-500 text-orange-950 text-xs font-bold px-3 py-0.5 rounded-full">#3</div>}
              
              <div className={`w-20 h-20 rounded-full bg-background flex items-center justify-center text-4xl border-2 mb-4 shadow-inner ${
                isFirst ? 'border-yellow-500' : isSecond ? 'border-gray-400' : 'border-orange-600'
              }`}>
                {token.logo}
              </div>
              <h3 className="font-bold text-lg mb-1">{token.name}</h3>
              <p className="text-primary font-medium text-sm mb-4">${token.symbol}</p>
              
              <div className="flex items-center gap-1.5 bg-background px-4 py-2 rounded-xl text-sm font-bold border border-border/50 w-full justify-center">
                <ArrowUp className="w-4 h-4 text-green-500" />
                {token.votes.toLocaleString()}
              </div>
            </div>
          )
        })}
      </div>

      {/* List View */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-6 py-4 font-medium text-muted-foreground w-16 text-center">#</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Token</th>
                <th className="px-6 py-4 font-medium text-muted-foreground hidden md:table-cell">Creator</th>
                <th className="px-6 py-4 font-medium text-muted-foreground hidden sm:table-cell">24h Change</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-right w-32">Votes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_LEADERBOARD.slice(3).map((token) => (
                <tr key={token.id} className="hover:bg-muted/50 transition-colors group cursor-pointer relative">
                  <td className="px-6 py-5 text-center font-bold text-muted-foreground">{token.rank}</td>
                  <td className="px-6 py-5">
                    <Link href={`/token/${token.id}`} className="absolute inset-0 z-10" />
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-xl border border-border">
                        {token.logo}
                      </div>
                      <div>
                        <p className="font-bold text-foreground group-hover:text-primary transition-colors">{token.name}</p>
                        <p className="text-sm text-muted-foreground">${token.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 hidden md:table-cell">
                    <span className="font-mono text-sm bg-background px-2 py-1 rounded-md border border-border">{token.creator}</span>
                  </td>
                  <td className="px-6 py-5 hidden sm:table-cell">
                    <span className={`text-sm font-medium ${token.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {token.change}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="inline-flex items-center gap-1.5 font-bold text-foreground">
                      <ArrowUp className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {token.votes.toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
