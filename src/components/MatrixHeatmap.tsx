'use client';

import React, { useMemo, useState } from 'react';
import type { EDSObjective, SPObjective } from '@/lib/objectives';

type AlignmentMap = Record<string, number>;            // "EDS-5|SP5-1" -> 0..3
type ExplanationMap = Record<string, { why: string; confidence?: number }>;

function InfoBadge({ title }: { title?: string }) {
  // crisp "i" in a circle; readable on any background
  return (
    <span className="pointer-events-none absolute top-0.5 right-0.5" title={title}>
      <svg
        viewBox="0 0 20 20"
        className="h-3.5 w-3.5 text-emerald-700 drop-shadow-[0_0_0.5px_rgba(255,255,255,0.9)]"
        aria-hidden="true"
      >
        <circle cx="10" cy="10" r="9" fill="white" />
        <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 5.4a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2ZM9 9.2h2v5.4H9z" fill="currentColor" />
      </svg>
    </span>
  );
}

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
  // Group columns by SP priority (tiered header)
  const groups = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, SPObjective[]>();
    for (const c of cols) {
      if (!map.has(c.priority)) {
        map.set(c.priority, []);
        order.push(c.priority);
      }
      map.get(c.priority)!.push(c);
    }
    return { order, map };
  }, [cols]);

  const [active, setActive] = useState<{ r?: EDSObjective; c?: SPObjective; score?: number; why?: string; conf?: number } | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null); // per-cell hover only

  const keyFor = (rId: string, cId: string) => `${rId}|${cId}`;

  const colorFor = (score: number) => {
    switch (score) {
      case 3: return 'bg-emerald-600 text-white';
      case 2: return 'bg-emerald-300 text-gray-900';
      case 1: return 'bg-emerald-100 text-gray-900';
      default: return 'bg-white text-gray-900';
    }
  };

  const cellTitle = (r: EDSObjective, c: SPObjective, score: number) =>
    `${r.id} × ${c.id} → ${score}\n${r.title}\n${c.title}`;

  const headSticky = 'sticky top-0 z-10 bg-white';
  const leftSticky = 'sticky left-0 z-10 bg-white';

  return (
    <div className="w-full overflow-auto rounded-2xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        {/* GROUP HEADER */}
        <thead className={headSticky}>
          <tr className="border-b border-gray-200">
            <th className={`${leftSticky} p-4 text-left align-bottom w-72`}>
              <div className="font-semibold text-gray-900">Economic Development Strategy (rows)</div>
              <div className="text-xs text-gray-800">Click any cell for details</div>
            </th>
            {groups.order.map(priority => {
              const colsInGroup = groups.map.get(priority)!;
              return (
                <th
                  key={priority}
                  colSpan={colsInGroup.length}
                  className="p-3 text-center text-gray-900 font-semibold align-bottom border-l border-gray-200"
                >
                  {priority}
                </th>
              );
            })}
          </tr>

          {/* COLUMN IDS */}
          <tr className="border-b border-gray-200">
            <th className={`${leftSticky} p-2 text-left text-gray-900 text-xs font-medium`}>
              EDS objective
            </th>
            {groups.order.flatMap(priority =>
              groups.map.get(priority)!.map(c => (
                <th
                  key={c.id}
                  className="px-2 py-1 text-center text-[11px] text-gray-900 font-medium border-l border-gray-200"
                  title={`${c.id}\n${c.title}`}
                >
                  {c.id}
                </th>
              ))
            )}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b border-gray-100 last:border-b-0">
              {/* ROW LABEL */}
              <th
                className={`${leftSticky} p-4 text-left align-middle w-72 border-r border-gray-200`}
                title={`${r.id}\n${r.title}`}
              >
                <div className="font-semibold text-gray-900">{r.id}</div>
                <div className="text-xs text-gray-900 leading-snug">{r.title}</div>
              </th>

              {/* CELLS */}
              {groups.order.flatMap(priority =>
                groups.map.get(priority)!.map(c => {
                  const k = keyFor(r.id, c.id);
                  const score = alignment[k] ?? 0;
                  const exp = explanations?.[k];
                  const isHover = hoverKey === k;

                  return (
                    <td
                      key={k}
                      className={`relative h-11 w-11 align-middle border-l border-gray-200 ${colorFor(score)}`}
                      title={cellTitle(r, c, score)}
                      onMouseEnter={() => setHoverKey(k)}
                      onMouseLeave={() => setHoverKey(null)}
                    >
                      {/* Click target */}
                      <button
                        type="button"
                        onClick={() =>
                          setActive({
                            r, c, score,
                            why: exp?.why,
                            conf: exp?.confidence
                          })
                        }
                        className="absolute inset-0 w-full h-full focus:outline-none focus:ring-2 focus:ring-emerald-500/70 rounded-[2px]"
                        aria-label={`${r.id} by ${c.id} score ${score}`}
                      />

                      {/* Optional numbers */}
                      {showNumbers && (
                        <span className="pointer-events-none select-none text-xs font-semibold absolute inset-0 grid place-items-center z-20">
                          {score}
                        </span>
                      )}

                      {/* Rationale badge */}
                      {exp && <InfoBadge title="AI rationale available" />}

                      {/* Subtle hover veil (works on any bg) */}
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
                })
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* LEGEND */}
      <div className="flex flex-wrap items-center gap-4 p-4 border-t border-gray-200 bg-white">
        <div className="text-sm font-medium text-gray-900">Legend</div>
        <div className="flex items-center gap-3 text-sm text-gray-900">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-4 w-6 bg-white border border-gray-300 rounded" /> 0 (none)
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-4 w-6 bg-emerald-100 border border-emerald-200 rounded" /> 1 (light)
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-4 w-6 bg-emerald-300 border border-emerald-400 rounded" /> 2 (moderate)
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-4 w-6 bg-emerald-600 border border-emerald-700 rounded" /> 3 (strong)
          </span>
          <span className="inline-flex items-center gap-2 ml-2">
            <span className="relative inline-block align-middle">
              <svg viewBox="0 0 20 20" className="h-4 w-4 text-emerald-700 align-middle">
                <circle cx="10" cy="10" r="9" fill="white" />
                <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M10 5.4a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2ZM9 9.2h2v5.4H9z" fill="currentColor" />
              </svg>
            </span>
            AI rationale
          </span>
        </div>
        <div className="ml-auto text-sm text-gray-900">
          Columns = Strategic Plan objectives • Rows = EDS objectives
        </div>
      </div>

      {/* MODAL */}
      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-gray-200 p-5"
            onClick={(e) => e.stopPropagation()}
          >
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
    </div>
  );
}
