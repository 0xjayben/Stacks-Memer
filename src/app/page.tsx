import Link from "next/link"
import { Rocket, Gem, Users, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-background to-background/50 relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse mix-blend-screen pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-8 border border-primary/20">
          <Rocket className="w-4 h-4" />
          <span className="text-sm font-medium">Stacksmemer is Live on Stacks</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
          The home of meme coins on Stacks
        </h1>

        <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
          Discover the next 100x gem, promote your community, and vote for the ultimate meme coin. 
          The Stacks ecosystem just got a lot more fun.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/discover" 
            className="inline-flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 active:scale-95"
          >
            <Gem className="w-5 h-5" />
            Explore Meme Coins
          </Link>
          <Link 
            href="/submit" 
            className="inline-flex justify-center items-center gap-2 bg-card hover:bg-card/80 border border-border text-foreground px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 active:scale-95"
          >
            <Rocket className="w-5 h-5" />
            Submit Token
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8 bg-card/30 border-t border-border">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-background border border-border flex flex-col items-center text-center hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                <CompassIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Discover Early</h3>
              <p className="text-muted-foreground">Find new meme coins launching on Stacks before they hit the mainstream.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-background border border-border flex flex-col items-center text-center hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 text-accent">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community Driven</h3>
              <p className="text-muted-foreground">Upvote your favorite coins. The leaderboard is completely controlled by the community.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-background border border-border flex flex-col items-center text-center hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 text-green-500">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fair Launches</h3>
              <p className="text-muted-foreground">Transparent token information, contract verification, and creator details.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function CompassIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}
