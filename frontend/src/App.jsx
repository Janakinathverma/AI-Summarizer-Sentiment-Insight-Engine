import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, BrainCircuit, AlignLeft, RefreshCw, AlertCircle, Sun, Moon, Cpu } from 'lucide-react';
import './App.css';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('summarize');
  const [textInput, setTextInput] = useState('');
  const [maxLength, setMaxLength] = useState(130);
  const [minLength, setMinLength] = useState(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Toggle Dark Mode Class on Root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (activeTab === 'summarize') {
        const res = await axios.post(`${API_BASE}/summarize`, {
          text: textInput,
          max_length: parseInt(maxLength),
          min_length: parseInt(minLength),
        });
        setResult({ type: 'summary', data: res.data.summary });
      } else {
        const res = await axios.post(`${API_BASE}/sentiment`, {
          text: textInput,
        });
        setResult({ type: 'sentiment', data: res.data });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upstream service error or network unreachable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative selection:bg-indigo-500 selection:text-white">

      {/* Top Controls: Dark/Light Mode Switch */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-3 rounded-full border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-800 dark:text-amber-400 hover:scale-105 transition-all shadow-md"
          title="Toggle Theme Mode"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>
      </div>

      {/* Futuristic Header */}
      <header className="text-center mb-10">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-4">
          <Cpu className="w-4 h-4 animate-pulse" /> AI Neural Core v2.0
        </div>
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent uppercase tracking-wider mb-3">
          Insight Engine
        </h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium">
          Next-Gen AI Summarization & Emotion Analytics
        </p>
      </header>

      {/* Futuristic Tabs */}
      <div className="flex justify-center border-b border-slate-200 dark:border-slate-800 mb-8">
        <button
          onClick={() => { setActiveTab('summarize'); setResult(null); }}
          className={`flex items-center gap-2 px-8 py-3 font-semibold transition-all uppercase tracking-wider border-b-2 text-sm ${
            activeTab === 'summarize'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <AlignLeft className="w-4 h-4" /> Summarizer
        </button>
        <button
          onClick={() => { setActiveTab('sentiment'); setResult(null); }}
          className={`flex items-center gap-2 px-8 py-3 font-semibold transition-all uppercase tracking-wider border-b-2 text-sm ${
            activeTab === 'sentiment'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <BrainCircuit className="w-4 h-4" /> Sentiment
        </button>
      </div>

      {/* Main Glassmorphism Form Card */}
      <form onSubmit={handleSubmit} className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-2xl mb-8 transition-all">
        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 font-futuristic">
          {activeTab === 'summarize' ? 'Input Text Vector' : 'Input Analysis String'}
        </label>
        <textarea
          rows={6}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={
            activeTab === 'summarize'
              ? "Paste long articles, documentation, or news text here..."
              : "Type a sentence or review to analyze emotion and sentiment score..."
          }
          className="w-full bg-slate-100/80 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-xl p-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all mb-4 text-base"
          required
        />

        {/* Dynamic Controls for Summarizer */}
        {activeTab === 'summarize' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">
                Min Length Threshold ({minLength} words)
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={minLength}
                onChange={(e) => setMinLength(e.target.value)}
                className="w-full accent-indigo-600 dark:accent-indigo-500 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">
                Max Length Limit ({maxLength} words)
              </label>
              <input
                type="range"
                min="50"
                max="300"
                value={maxLength}
                onChange={(e) => setMaxLength(e.target.value)}
                className="w-full accent-indigo-600 dark:accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !textInput.trim()}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all uppercase tracking-widest font-futuristic flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-600/30 active:scale-[0.99]"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" /> Processing Neural Tensor...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" /> Execute {activeTab === 'summarize' ? 'Summarizer' : 'Sentiment Engine'}
            </>
          )}
        </button>
      </form>

      {/* Error Output Card */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-400 flex items-center gap-3 mb-8">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">{error}</span>
        </div>
      )}

      {/* Result Display Card */}
      {result && (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-indigo-500/30 shadow-2xl glow-indigo">
          <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2 font-futuristic">
            <Sparkles className="w-4 h-4" /> Neural Output Result
          </h2>

          {result.type === 'summary' ? (
            <p className="text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-100/60 dark:bg-slate-950/60 p-5 rounded-xl border border-slate-200 dark:border-slate-800 text-lg">
              {result.data}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-100/60 dark:bg-slate-950/60 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase tracking-wider mb-1 font-semibold">Predicted Sentiment</span>
                <span className={`text-2xl font-black font-futuristic ${
                  result.data.label === 'POSITIVE' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {result.data.label}
                </span>
              </div>
              <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase tracking-wider mb-1 font-semibold">Confidence Probability</span>
                <span className="text-2xl font-black font-futuristic text-indigo-600 dark:text-indigo-400">
                  {(result.data.score * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
