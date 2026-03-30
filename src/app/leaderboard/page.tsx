'use client';

import Link from "next/link"
import { Trophy, ArrowUp, Sparkles } from "lucide-react"
import { useLeaderboard } from "@/hooks/useLeaderboard"

const COLORS = ['#facc15', '#9ca3af', '#f97316']; // gold, silver, bronze

export default function Leaderboard() {
  const { leaderboard, loading } = useLeaderboard();

  // Top 3 for the podium (display order: #2, #1, #3)
  const top3 = leaderboard.slice(0, 3);
  const podiumOrder = top3.length >= 3
    ? [top3[1], top3[0], top3[2]]
    : top3;

  const rest = leaderboard.slice(3);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Global Leaderboard
          </h1>
          <p className="text-muted-foreground">The most voted meme coins on the Stacks ecosystem.</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-[#131316] border border-border rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && leaderboard.length === 0 && (
        <div className="p-16 text-center rounded-2xl bg-[#131316] border border-border border-dashed">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold mb-2">No votes yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
            Be the first to vote for a meme coin. Head to the Discover page and upvote your favorites.
          </p>
          <Link href="/discover" className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors">
            Discover Tokens
          </Link>
        </div>
      )}

      {/* Top 3 Podium */}
      {!loading && top3.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 items-end">
          {podiumOrder.map((token, i) => {
            const isFirst = i === 1;
            const isSecond = i === 0;
            const isThird = i === 2;
            const rank = isFirst ? 1 : isSecond ? 2 : 3;
            const borderColor = COLORS[rank - 1];

            return (
              <Link
                key={token.contractId}
                href={`/token/${encodeURIComponent(token.contractId)}`}
                className={`relative flex flex-col items-center p-6 rounded-2xl border bg-card/50 text-center transition-all hover:bg-card ${
                  isFirst ? 'md:-mt-8 md:scale-105 shadow-[0_0_30px_-5px_rgba(234,179,8,0.2)] z-10' : ''
                }`}
                style={{ borderColor: `${borderColor}80` }}
              >
                {isFirst && (
                  <div className="absolute -top-4 bg-yellow-500 text-yellow-950 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> #1 MOST VOTED
                  </div>
                )}
                {isSecond && <div className="absolute -top-3 bg-gray-300 text-gray-800 text-xs font-bold px-3 py-0.5 rounded-full">#2</div>}
                {isThird && <div className="absolute -top-3 bg-orange-500 text-orange-950 text-xs font-bold px-3 py-0.5 rounded-full">#3</div>}

                <div
                  className="w-20 h-20 rounded-full bg-background flex items-center justify-center text-4xl border-2 mb-4 shadow-inner overflow-hidden"
                  style={{ borderColor }}
                >
                  {token.imageUri ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={token.imageUri} alt={token.symbol} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                  ) : (
                    <span className="text-2xl font-bold" style={{ color: borderColor }}>
                      {token.symbol?.substring(0, 2)}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-1">{token.name}</h3>
                <p className="text-primary font-medium text-sm mb-1">${token.symbol}</p>
                <p className={`text-xs font-bold mb-3 ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(1)}%
                </p>

                <div className="flex items-center gap-1.5 bg-background px-4 py-2 rounded-xl text-sm font-bold border border-border/50 w-full justify-center">
                  <ArrowUp className="w-4 h-4 text-green-500" />
                  {token.votes.toLocaleString()} votes
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Rest of the list */}
      {!loading && rest.length > 0 && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="px-6 py-4 font-medium text-muted-foreground w-16 text-center">#</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Token</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground hidden md:table-cell">Price</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground hidden sm:table-cell">24h Change</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground text-right w-32">Votes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rest.map((token, i) => (
                  <tr key={token.contractId} className="hover:bg-muted/50 transition-colors group cursor-pointer relative">
                    <td className="px-6 py-5 text-center font-bold text-muted-foreground">{i + 4}</td>
                    <td className="px-6 py-5">
                      <Link href={`/token/${encodeURIComponent(token.contractId)}`} className="absolute inset-0 z-10" />
                      <div className="flex items-center gap-4">
                        {token.imageUri ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={token.imageUri} alt={token.symbol} className="w-10 h-10 rounded-full object-cover bg-card" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500 text-sm font-bold border border-border">
                            {token.symbol?.substring(0, 2)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-foreground group-hover:text-primary transition-colors">{token.name}</p>
                          <p className="text-sm text-muted-foreground">${token.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <span className="font-mono text-sm">${token.price.toFixed(6)}</span>
                    </td>
                    <td className="px-6 py-5 hidden sm:table-cell">
                      <span className={`text-sm font-medium ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(1)}%
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
      )}
    </div>
  );
}
