import Image from "next/image";

export default function RootLoading() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.2),transparent_45%)]" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-md">
        <div className="mb-5 overflow-hidden rounded-xl border border-white/20">
          <Image
            src="/images/6894423.jpg"
            alt="Cricket loading visual"
            width={720}
            height={400}
            className="h-40 w-full object-cover"
            priority
          />
        </div>
        <div className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-4 border-red-400/30 border-t-red-400" />
        <h2 className="text-2xl font-bold text-white">Loading Match Data</h2>
        <p className="mt-2 text-sm text-slate-200">
          Setting the field for your FanUp experience.
        </p>
      </div>
    </div>
  );
}
