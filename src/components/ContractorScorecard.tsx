import { ContractorScore } from '@/types/pothole';
import { cn } from '@/lib/utils';
import { Trophy, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface ContractorScorecardProps {
  contractors: ContractorScore[];
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  return 'text-destructive';
}

function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-success';
  if (score >= 60) return 'bg-warning';
  return 'bg-destructive';
}

function getScoreRing(score: number): string {
  if (score >= 80) return 'ring-success/20';
  if (score >= 60) return 'ring-warning/20';
  return 'ring-destructive/20';
}

export function ContractorScorecard({ contractors }: ContractorScorecardProps) {
  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden animate-fade-in">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          <h3 className="text-lg font-semibold text-foreground">Contractor Performance Scorecard</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">AI-evaluated performance metrics</p>
      </div>
      
      <div className="p-6 space-y-4">
        {contractors.map((contractor, index) => (
          <div 
            key={contractor.name}
            className="p-4 rounded-xl border border-border bg-muted/20 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ring-4",
                  getScoreBg(contractor.score),
                  getScoreRing(contractor.score),
                  "text-white"
                )}>
                  {contractor.score}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{contractor.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {contractor.completed}/{contractor.totalAssigned} repairs completed
                  </p>
                </div>
              </div>
              
              <div className={cn("text-2xl font-bold", getScoreColor(contractor.score))}>
                {contractor.score >= 80 ? 'A' : contractor.score >= 60 ? 'B' : 'C'}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-info" />
                <div>
                  <p className="text-xs text-muted-foreground">Avg Response</p>
                  <p className="font-semibold">{contractor.avgResponseTime}h</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <div>
                  <p className="text-xs text-muted-foreground">Avg Completion</p>
                  <p className="font-semibold">{contractor.avgCompletionTime}d</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-warning" />
                <div>
                  <p className="text-xs text-muted-foreground">Repeat Issues</p>
                  <p className="font-semibold">{contractor.repeatOccurrence}%</p>
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-1000", getScoreBg(contractor.score))}
                  style={{ width: `${contractor.score}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
