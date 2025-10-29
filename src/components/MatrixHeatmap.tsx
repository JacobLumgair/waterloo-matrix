'use client';

import React, { useState } from 'react';
import type { EDSObjective, SPObjective } from '@/lib/objectives';

type AlignmentMap = Record<string, number>; // "EDS-5|SP5-1" -> 0..3
type ExplanationMap = Record<string, { why: string; confidence?: number }>;

function InfoBadge({ title }: { title?: string }) {
  return (
    <span className="pointer-events-none absolute top-0.5 right-0.5" title={title}>
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true">
        <circle cx="10" cy="10" r="9" fill="white" />
        <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 5.4a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2ZM9 9.2h2v5.4H9z" fill="currentColor" />
      </svg>
    </span>
  );
}

/* ---------------- helpers ---------------- */

const getEdsNum = (id: string) => {
  const m = id.match(/^EDS-(\d+)$/i);
  return m ? parseInt(m[1], 10) : NaN;
};
const edsBand = (n: number) =>
  n >= 1 && n <= 4 ? 'Start + Attract'
  : n >= 5 && n <= 6 ? 'Grow + Preserve'
  : n >= 7 && n <= 9 ? 'Organize + Empower'
  : '';

const edsHeaderClass = (n: number) =>
  n >= 1 && n <= 4 ? 'bg-emerald-200 border-emerald-300 text-gray-900'
  : n >= 5 && n <= 6 ? 'bg-sky-200 border-sky-300 text-gray-900'
  : n >= 7 && n <= 9 ? 'bg-rose-200 border-rose-300 text-gray-900'
  : 'bg-gray-100 border-gray-200 text-gray-900';

const getSpPriorityNum = (id: string) => {
  const m = id.match(/^SP(\d+)-/i);
  return m ? parseInt(m[1], 10) : NaN;
};

/* Color: SP1 = fruit orange; SP3 = light orange (what SP1 used); others unchanged */
const spHeaderClass = (n: number) =>
  n === 1 ? 'bg-orange-400 border-orange-600 text-gray-900' :      // richer fruit orange
  n === 2 ? 'bg-green-400 border-green-600 text-gray-900' : // green
  n === 3 ? 'bg-amber-400 border-amber-600 text-gray-900' :     // light orange (was SP1)
  n === 4 ? 'bg-rose-400 border-rose-600 text-gray-900' :       // red
  n === 5 ? 'bg-sky-400 border-sky-600 text-gray-900' :         // blue
            'bg-gray-100 border-gray-200 text-gray-900';

const spPriorityFallbackName = (n: number) => (n ? `Priority ${n}` : '');

/* Expand READI in hover text */
const expandREADI = (s?: string) =>
  (s || '').replace(/\bREADI\b/gi, 'Reconciliation, Equity, Accessibility, Diversity and Inclusion');

/* Shared header text sizing (slightly larger) for SP & EDS headers */
const headerTextCls = 'font-semibold text-sm leading-none sm:text-[0.95rem]'; // ~14px→15.2px

export function MatrixHeatmap({
  rows,
  cols,
  alignment,
  explanations,
  showNumbers = false,
}: {
  rows: EDSObjective[];
  cols: SPObjective[];
  alignment: AlignmentMap;
  explanations?: ExplanationMap;
  showNumbers?: boolean;
}) {
  // sticky helpers — no bg-white so header colors show through
  const headSticky = 'sticky top-0 z-10';
  const leftSticky = 'sticky left-0 z-10';

  const [active, setActive] = useState<{ r?: EDSObjective; c?: SPObjective; score?: number; why?: string; conf?: number } | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  // Instant tooltip with bold heading (priority/band) + body (id + title, with READI expanded)
  const [tip, setTip] = useState<{ heading?: string; body?: string; x: number; y: number } | null>(null);

  const keyFor = (rId: string, cId: string) => `${rId}|${cId}`;
  const colorFor = (score: number) => {
    switch (score) {
      case 3: return 'bg-emerald-600 text-white';
      case 2: return 'bg-emerald-300 text-gray-900';
      case 1: return 'bg-emerald-100 text-gray-900';
      default: return 'bg-white text-gray-900';
    }
  };

  return (
    <div className="w-full overflow-auto rounded-2xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead className={headSticky}>
          {/* Single header row; no SP group titles */}
          <tr className="border-b border-gray-200">
            {/* corner cell minimal; match row height so header row equals cell height */}
            <th
              className={`${leftSticky} p-0 m-0 h-11 border-y`}
              style={{ width: 1 }}
              aria-hidden="true"
            />
            {cols.map(c => {
              const pn = getSpPriorityNum(c.id);
              const headerCls = spHeaderClass(pn);
              const heading = expandREADI(c.priority?.trim() || spPriorityFallbackName(pn)); // bold line
              const body = expandREADI(`${c.id}: ${c.title}`); // second line
              return (
                <th
                  key={c.id}
                  className={`relative p-0 text-center ${headerCls} border-l border-y`}
                  onMouseEnter={(e) => setTip({ heading, body, x: e.clientX, y: e.clientY })}
                  onMouseMove={(e) => setTip(prev => (prev ? { ...prev, x: e.clientX, y: e.clientY } : prev))}
                  onMouseLeave={() => setTip(null)}
                >
                  {/* inner flex to force same height as cells and center content */}
                  <div className="h-11 px-2 flex items-center justify-center">
                    <span className={headerTextCls}>{c.id}</span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {rows.map(r => {
            const n = getEdsNum(r.id);
            const band = edsBand(n);
            const rowHeaderCls = edsHeaderClass(n);

            return (
              <tr key={r.id} className="border-b border-gray-100 last:border-b-0">
                {/* EDS header cell — colored, centered, hugs content (tiny pad for breathing room) */}
                <th
                  className={`${leftSticky} p-0 m-0 whitespace-nowrap ${rowHeaderCls} border-y border-r`}
                  onMouseEnter={(e) =>
                    setTip({
                      heading: band || undefined,
                      body: expandREADI(`${r.id}: ${r.title}`),
                      x: e.clientX, y: e.clientY
                    })
                  }
                  onMouseMove={(e) => setTip(prev => (prev ? { ...prev, x: e.clientX, y: e.clientY } : prev))}
                  onMouseLeave={() => setTip(null)}
                >
                  {/* flex center so the ID is visually centered even in a tight cell */}
                  <div className="h-11 flex items-center justify-center">
                    <span className={`px-1 ${headerTextCls}`}>{r.id}</span>
                  </div>
                </th>

                {/* Cells */}
                {cols.map(c => {
                  const k = keyFor(r.id, c.id);
                  const score = alignment[k] ?? 0;
                  const exp = explanations?.[k];
                  const isHover = hoverKey === k;

                  return (
                    <td
                      key={k}
                      className={`relative h-11 w-11 align-middle border-l border-gray-200 ${colorFor(score)}`}
                      title={expandREADI(`${r.id} × ${c.id} → ${score}\n${r.title}\n${c.title}`)}
                      onMouseEnter={() => setHoverKey(k)}
                      onMouseLeave={() => setHoverKey(null)}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActive({ r, c, score, why: exp?.why, conf: exp?.confidence })
                        }
                        className="absolute inset-0 w-full h-full focus:outline-none focus:ring-2 focus:ring-emerald-500/70 rounded-[2px]"
                        aria-label={`${r.id} by ${c.id} score ${score}`}
                      />

                      {/* Optional: show numbers a bit larger now */}
                      {showNumbers && (
                        <span className="pointer-events-none select-none text-sm font-semibold absolute inset-0 grid place-items-center z-20">
                          {score}
                        </span>
                      )}

                      {exp && <InfoBadge title="AI rationale available" />}

                      {/* subtle hover veil */}
                      <span
                        aria-hidden="true"
                        className={[
                          'pointer-events-none absolute inset-0 rounded-[2px] transition',
                          isHover ? 'bg-black/5' : 'bg-transparent'
                        ].join(' ')}
                        style={{ zIndex: 10 }}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend (trimmed: removed the explanatory right-side text) */}
      <div className="flex flex-wrap items-center gap-4 p-4 border-t border-gray-200 bg-white">
        <div className="text-sm font-medium text-gray-900">Legend</div>
        <div className="flex items-center gap-3 text-sm text-gray-900">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-4 w-6 bg-white border border-gray-300 rounded" /> 0 (none)
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-4 w-6 bg-emerald-100 border-emerald-200 rounded" /> 1 (light)
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-4 w-6 bg-emerald-300 border-emerald-400 rounded" /> 2 (moderate)
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-4 w-6 bg-emerald-600 border-emerald-700 rounded" /> 3 (strong)
          </span>
        </div>
      </div>

      {/* Modal */}
      {active && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-gray-200 p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3">
              <div className="grow">
                <div className="text-xs text-gray-700">Selected cell</div>
                <div className="text-sm font-semibold text-gray-900">
                  {active.r?.id} × {active.c?.id}{' '}
                  <span className="text-gray-700 font-normal">score {active.score}</span>
                </div>
              </div>
              <button
                className="rounded-md px-2 py-1 text-sm border border-gray-300 text-gray-900 hover:bg-gray-50"
                onClick={() => setActive(null)}
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="text-xs text-gray-700">Row (EDS)</div>
                <div className="text-sm font-medium text-gray-900">{active.r?.title}</div>
              </div>
              <div>
                <div className="text-xs text-gray-700">Column (SP)</div>
                <div className="text-sm font-medium text-gray-900">{active.c?.title}</div>
              </div>
              {active.why && (
                <div>
                  <div className="text-xs text-gray-700">AI rationale</div>
                  <div className="text-sm text-gray-900">{active.why}</div>
                  {typeof active.conf === 'number' && (
                    <div className="text-xs text-gray-700 mt-1">Confidence: {(active.conf * 100).toFixed(0)}%</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instant tooltip: bold heading above body; READI expanded */}
      {tip && (
        <div
          className="fixed z-[9999] max-w-[28rem] px-2.5 py-1.5 rounded-md border border-gray-300 bg-white text-gray-900 text-xs shadow-md pointer-events-none"
          style={{ left: tip.x + 12, top: tip.y + 12, lineHeight: 1.25 }}
          role="tooltip"
        >
          {tip.heading && <div className="font-semibold mb-0.5">{tip.heading}</div>}
          {tip.body && <div className="whitespace-pre-line">{tip.body}</div>}
        </div>
      )}
    </div>
  );
}
