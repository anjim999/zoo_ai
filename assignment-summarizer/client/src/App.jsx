import { useState } from 'react';
import './index.css';

function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please provide some text to summarize first.');
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong while summarizing.');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex justify-center py-10 px-5 font-sans antialiased">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Text Summarizer
          </h1>
          <p className="text-lg text-slate-400">
            Paste unstructured text to instantly generate a one-sentence summary, key insights, and sentiment analysis.
          </p>
        </header>

        <main className="flex flex-col gap-6">
          <form 
            onSubmit={handleAnalyze} 
            className="flex flex-col gap-4 bg-slate-900 p-6 rounded-2xl shadow-lg border border-white/10"
          >
            <textarea
              className="w-full min-h-[160px] p-4 rounded-xl border border-white/10 bg-black/40 text-slate-50 text-base resize-y focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Paste your unstructured text, article, or notes here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !text.trim()}
              className="self-end bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              {loading ? 'Analyzing...' : 'Generate Summary'}
            </button>
          </form>

          {error && (
            <div className="flex items-center gap-3 bg-red-950/40 text-red-400 p-4 rounded-xl border border-red-900/50">
              <span className="text-xl">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-slate-900 p-8 rounded-2xl border border-white/10 shadow-2xl transition-all">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                <h2 className="text-2xl font-semibold m-0">Analysis Complete</h2>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase ${
                  result.sentiment?.toLowerCase() === 'positive' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                  result.sentiment?.toLowerCase() === 'negative' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' :
                  'bg-slate-500/20 text-slate-400 border border-slate-500/20'
                }`}>
                  {result.sentiment || 'neutral'}
                </span>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-3">Summary</h3>
                <p className="text-lg leading-relaxed text-slate-50 m-0">
                  {result.summary}
                </p>
              </div>

              <div className="mb-0">
                <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-3">Key Points</h3>
                <ul className="list-disc pl-5 flex flex-col gap-3 m-0">
                  {result.keyPoints?.map((point, i) => (
                    <li key={i} className="text-slate-50 leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
