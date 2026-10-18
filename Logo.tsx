import { Wine } from 'lucide-react';

export function Logo({ className = '', showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-500/20">
        <Wine className="h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
      {showText && (
        <span className="text-xl font-bold tracking-tight text-ink-900">
          Bar<span className="text-brand-500">Stock</span> <span className="text-ink-500 font-medium text-lg">AI</span>
        </span>
      )}
    </div>
  );
}
