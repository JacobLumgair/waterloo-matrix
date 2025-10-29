'use client';

import React, { useMemo, useState } from 'react';
import { MatrixHeatmap } from '@/components/MatrixHeatmap';
import { EDS_OBJECTIVES, STRATEGIC_PLAN_OBJECTIVES } from '@/lib/objectives';

type AnalyzeResponse = {
  row_scores: Record<string, number>;
  col_scores: Record<string, number>;
  top_cells: { row: string; col: string; why: string; confidence?: number }[];
  analysis: string;
  alignment: Record<string, number>; // "EDS-5|SP5-1": 0..3
};

export default function HeatmapPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Unknown error');
      setResult(json);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  const explanations = useMemo(() => {
    if (!result?.top_cells) return {};
    const map: Record<string, { why: string; confidence?: number }> = {};
    for (const t of result.top_cells) {
      map[`${t.row}|${t.col}`] = { why: t.why, confidence: t.confidence };
    }
    return map;
  }, [result]);

  return (
    <div className="min-h-[100dvh] bg-white">
      <main className="mx-auto max-w-[1200px] px-6 py-6 space-y-6">
        {/* Input card */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="p-4 sm:p-5 border-b border-gray-200">
            <div className="text-sm font-semibold text-gray-900">Analyze a snippet</div>
            <div className="text-sm text-gray-800">Paste a brief summary, minutes excerpt, or initiative description.</div>
          </div>
          <div className="p-4 sm:p-5 space-y-4">
            <textarea
              placeholder="E.g., (Feb 18) Briefed on Housing Accelerator Fund... zoning by-law amendment for 4 units / 4 storeys..."
              className="w-full h-40 p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={run}
                disabled={loading || !text.trim()}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
              >
                {loading ? 'Analyzing…' : 'Analyze'}
              </button>

              <label className="inline-flex items-center gap-2 text-sm text-gray-900">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  checked={showNumbers}
                  onChange={(e) => setShowNumbers(e.target.checked)}
                />
                Show numbers in cells
              </label>

              {error && <div className="text-sm text-red-600">{error}</div>}
            </div>

            {result?.analysis && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="text-sm font-medium text-gray-900 mb-1">AI Summary</div>
                <p className="text-sm text-gray-900 leading-relaxed">{result.analysis}</p>
              </div>
            )}
          </div>
        </div>

        {/* Heatmap card */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5">
          {result?.alignment ? (
            <MatrixHeatmap
              rows={EDS_OBJECTIVES as any}
              cols={STRATEGIC_PLAN_OBJECTIVES as any}
              alignment={result.alignment}
              explanations={explanations}
              showNumbers={showNumbers}
            />
          ) : (
            <div className="text-sm text-gray-900">
              Run an analysis to render the heatmap.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
