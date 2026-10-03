'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Sun, Moon, Sparkles, Waves, Flame } from 'lucide-react';

export type ThemeOption = 'cyber' | 'oceanic' | 'sunset' | 'light';

interface ThemeItem {
  id: ThemeOption;
  name: string;
  icon: React.ReactNode;
  colorClass: string;
  isDark: boolean;
}

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>('cyber');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('careerlens-theme') as ThemeOption;
    if (savedTheme && ['cyber', 'oceanic', 'sunset', 'light'].includes(savedTheme)) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'cyber');
    }
  }, []);

  const changeTheme = (theme: ThemeOption) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('careerlens-theme', theme);
    setIsOpen(false);
  };

  const toggleDayNight = () => {
    const newTheme = currentTheme === 'light' ? 'cyber' : 'light';
    changeTheme(newTheme);
  };

  const themes: ThemeItem[] = [
    {
      id: 'cyber',
      name: 'Night (Cyber)',
      icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" />,
      colorClass: 'bg-indigo-500',
      isDark: true
    },
    {
      id: 'oceanic',
      name: 'Night (Teal)',
      icon: <Waves className="w-3.5 h-3.5 text-teal-400" />,
      colorClass: 'bg-teal-500',
      isDark: true
    },
    {
      id: 'sunset',
      name: 'Night (Velvet)',
      icon: <Flame className="w-3.5 h-3.5 text-rose-400" />,
      colorClass: 'bg-rose-500',
      isDark: true
    },
    {
      id: 'light',
      name: 'Day Mode',
      icon: <Sun className="w-3.5 h-3.5 text-amber-500" />,
      colorClass: 'bg-amber-400',
      isDark: false
    }
  ];

  const isLightMode = currentTheme === 'light';

  return (
    <div className="flex items-center space-x-2">
      {/* Quick Day / Night Toggle Switch */}
      <button
        onClick={toggleDayNight}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md border ${
          isLightMode
            ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
            : 'bg-indigo-950/80 text-indigo-200 border-indigo-500/40 hover:bg-indigo-900/90'
        }`}
        title={isLightMode ? "Switch to Night Mode (Dark)" : "Switch to Day Mode (Light)"}
      >
        {isLightMode ? (
          <>
            <Sun className="w-4 h-4 text-amber-600 animate-spin-slow" />
            <span>Day</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 text-indigo-300" />
            <span>Night</span>
          </>
        )}
      </button>

      {/* Palette Dropdown Selector */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/15 border border-white/15 text-gray-200 transition-all flex items-center justify-center"
          title="Customize Theme Palette"
        >
          <Palette className="w-4 h-4 text-indigo-400" />
        </button>

        {isOpen && (
          <div 
            className="absolute right-0 mt-2 w-48 rounded-2xl glass-card border border-white/20 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200"
            style={{ background: 'var(--card-bg)', backdropFilter: 'blur(20px)' }}
          >
            <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/10 mb-1">
              Select Theme Theme
            </div>
            <div className="space-y-1">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => changeTheme(t.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                    currentTheme === t.id
                      ? 'bg-indigo-500/25 border border-indigo-500/40 text-[var(--text-primary)] font-bold'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {t.icon}
                    <span>{t.name}</span>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${t.colorClass}`}></span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
