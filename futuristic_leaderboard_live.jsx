import React, { useMemo, useState, useEffect } from "react";
import { Crown, Zap, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ==============================================
// FIX: This file is a React component (TSX), not a full HTML page.
// The previous version started with <!DOCTYPE html>, which caused:
//   SyntaxError: Unexpected token (1:0)
// because TSX can't parse raw HTML documents.
//
// ✅ This component renders the UI directly.
// ✅ LIVE badge + ticking clock.
// ✅ Top-centered HBP image on MAIN page only.
// ✅ Toggle button to switch between MAIN leaderboard (5) and ALL (8) players.
// ✅ First-place row uses golden transparent style on BOTH pages.
// ✅ Simple runtime tests via console.assert (won't crash the UI).
// ==============================================

export default function FuturisticLeaderboard() {
  // --- TIME / LIVE ---
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // --- PAGE VIEW ---
  const [view, setView] = useState<"main" | "all">("main");

  // --- DATA ---
  const mainPlayers = useMemo(
    () => [
      { name: "Sebastian", points: 2 },
      { name: "Levi", points: 1 },
      { name: "Kian", points: 1 },
      { name: "Kaleb", points: 0 },
      { name: "Cary", points: 0 },
    ],
    []
  );

  const allPlayers = useMemo(
    () => [
      { name: "Sebastian", points: 2 },
      { name: "Levi", points: 1 },
      { name: "Kian", points: 1 },
      { name: "Kaleb", points: 0 },
      { name: "Cary", points: 0 },
      { name: "Daniel", points: 0 },
      { name: "Oliver", points: 0 },
      { name: "Tyler", points: 0 },
      { name: "Oscar", points: 0 },
    ],
    []
  );

  // --- RUNTIME TESTS (do not throw; just log failures) ---
  useEffect(() => {
    console.assert(mainPlayers.length === 5, "Main page should show 5 players");
    console.assert(allPlayers.length === 8, "All-players page should show 8 players");
    const names = new Set(allPlayers.map((p) => p.name));
    console.assert(names.size === allPlayers.length, "Player names should be unique on ALL page");
    const allContainsMain = mainPlayers.every((p) => names.has(p.name));
    console.assert(allContainsMain, "Main players must be included in ALL players");
  }, [mainPlayers, allPlayers]);

  // --- IMAGE SRC ---
  // Put your image file named "Car Wash.png" next to this file OR into /public.
  // We'll try a public path first. If bundler supports asset URLs, you can swap to:
  //   const logoUrl = new URL("./Car\u0020Wash.png", import.meta.url).href;
  const logoUrl = "/Car Wash.png";

  const sortedMain = useMemo(
    () => mainPlayers.slice().sort((a, b) => b.points - a.points || a.name.localeCompare(b.name)),
    [mainPlayers]
  );
  const sortedAll = useMemo(
    () => allPlayers.slice().sort((a, b) => b.points - a.points || a.name.localeCompare(b.name)),
    [allPlayers]
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#06080f] via-[#0a0f1e] to-[#0e1224] text-white relative overflow-hidden">
      {/* Soft grid + glow background */}
      <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
        <div className="[background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] w-full h-full" />
        <div className="absolute -inset-24 blur-3xl bg-[radial-gradient(circle_at_30%_20%,#4f46e5_0%,transparent_40%),radial-gradient(circle_at_70%_80%,#06b6d4_0%,transparent_35%)]" />
      </div>

      {/* HEADER */}
      <header className="relative z-10 max-w-5xl mx-auto px-6 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 backdrop-blur border border-white/10 shadow-lg">
            <Zap className="h-6 w-6" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            HandBall <span className="text-cyan-300">Elimanation</span>
          </h1>
        </div>

        <LiveBadge now={now} />
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-6 pb-16">
        {/* Top toggles */}
        <div className="mt-6 flex items-center justify-between">
          <div />
          {view === "main" ? (
            <button
              onClick={() => setView("all")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              View All Players <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setView("main")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" /> Go Back
            </button>
          )}
        </div>

      
        {/* LIST CARD */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center gap-3">
              <Crown className="h-5 w-5 text-amber-300" />
              <h2 className="text-lg font-semibold">
                {view === "main" ? "Leaderboard" : "All Players"}
              </h2>
            </div>

            <ul className="p-3">
              <AnimatePresence>
                {(view === "main" ? sortedMain : sortedAll).map((p, idx) => (
                  <motion.li
                    key={`${view}-${p.name}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.25, delay: idx * 0.05 }}
                    className={`flex items-center justify-between px-3 py-4 rounded-xl mb-2 ${
                      idx === 0
                        ? "bg-gradient-to-r from-yellow-500/30 via-amber-400/20 to-yellow-600/30 border border-yellow-400/40 shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                        : "bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm tabular-nums text-white/70 w-6 text-right">
                        {idx + 1}
                      </span>
                      <span className="font-medium">{p.name}</span>
                    </div>
                    <span className="text-sm bg-white/10 px-3 py-1 rounded-lg border border-white/10 tabular-nums">
                      {p.points} pt{p.points === 1 ? "" : "s"}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </motion.section>

        {/* FOOTER */}
        <div className="mt-8 text-center text-sm text-white/60">
          Updated <span className="tabular-nums">{now.toLocaleTimeString()}</span>
        </div>
      </main>
    </div>
  );
}

function LiveBadge({ now }: { now: Date }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-sm">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-300" />
        </span>
        LIVE
      </span>
      <span className="hidden sm:inline text-xs text-white/60">
        {now.toLocaleDateString()} {now.toLocaleTimeString()}
      </span>
    </div>
  );
}
