'use client';
import { useState } from 'react';

export default function AnalyzePage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setResult(null);
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const json = await res.json();
    setResult(json);
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Analyze</h1>
      <textarea
        className="w-full h-48 p-3 border rounded"
        placeholder="Paste a speaker summary, proposal, or minutes…"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={run}
        disabled={loading}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {loading ? 'Analyzing…' : 'Analyze'}
      </button>

      {result && (
        <pre className="mt-6 p-4 bg-gray-100 rounded text-sm overflow-auto">
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
