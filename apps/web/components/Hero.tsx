import { Users, Pencil, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 overflow-hidden bg-white">
      {/* Crisp grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(#f1f5f9 1.5px, transparent 1.5px), linear-gradient(90deg, #f1f5f9 1.5px, transparent 1.5px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-600 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600" />
          </span>
          <span className="text-xs font-semibold text-slate-700 tracking-wide">
            Real-time collaborative whiteboard
          </span>
        </div>

        {/* Title */}
        <h1 className="mb-6 text-5xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-6xl md:text-7.5xl">
          Draw together,
          <br />
          <span className="text-indigo-600">in real time.</span>
        </h1>

        {/* Description */}
        <p className="mx-auto mb-10 max-w-xl text-base sm:text-lg text-slate-500 leading-relaxed">
          A collaborative canvas where multiple people can sketch, draw
          shapes, and brainstorm together — just like Excalidraw, but built for
          teams.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/room"
            className="group inline-flex items-center gap-2 rounded-full bg-black px-8 py-3.5 text-sm font-semibold text-white hover:bg-slate-900 active:scale-95 transition-all shadow-md"
          >
            Start Drawing
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#demo"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
          >
            See How It Works
          </a>
        </div>
      </div>

      {/* Floating sketch elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        {/* Dashed circle - top-left */}
        <svg
          className="absolute left-[8%] top-[20%] h-16 w-16 text-slate-300 animate-[pulse_3s_infinite]"
          viewBox="0 0 64 64"
          fill="none"
        >
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </svg>

        {/* Blue/indigo rounded rectangle - top-right */}
        <svg
          className="absolute right-[10%] top-[25%] h-14 w-14 text-indigo-400/20"
          viewBox="0 0 56 56"
          fill="none"
        >
          <rect
            x="4"
            y="4"
            width="48"
            height="48"
            rx="10"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>

        {/* Gray triangle - bottom-left */}
        <svg
          className="absolute bottom-[25%] left-[12%] h-12 w-12 text-slate-200"
          viewBox="0 0 48 48"
          fill="none"
        >
          <path
            d="M24 6L42 38H6L24 6Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>

        {/* Hand-drawn zig-zag line - bottom-right */}
        <svg
          className="absolute bottom-[20%] right-[10%] h-10 w-20 text-slate-200"
          viewBox="0 0 80 40"
          fill="none"
        >
          <path
            d="M10 30 L25 10 L45 30 L60 10 L75 25"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}

export function Features() {
  const features = [
    {
      icon: Users,
      title: "Real-time Collaboration",
      description:
        "Invite others to your room and draw together simultaneously. See cursors and changes live as they happen.",
    },
    {
      icon: Pencil,
      title: "Sketchy by Design",
      description:
        "Hand-drawn aesthetic with rough edges that feels natural and approachable, just like pen on paper.",
    },
    {
      icon: Zap,
      title: "Fast & Lightweight",
      description:
        "No installation required. Open in browser, create a room, and start drawing in seconds.",
    },
  ];

  return (
    <section id="features" className="relative bg-white px-6 py-24 border-t border-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to{" "}
            <span className="text-indigo-600">create together</span>
          </h2>
          <p className="mx-auto max-w-lg text-slate-500">
            Simple, powerful tools designed for teams who think visually.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-3xl border border-slate-100 bg-white p-8 transition-all hover:-translate-y-1 hover:border-slate-200 hover:shadow-lg"
            >
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-slate-500 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}