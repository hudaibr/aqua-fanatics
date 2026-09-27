'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#172225] px-6 text-center">
      <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#527C78]">
        Something went wrong
      </p>
      <h1 className="mt-6 text-3xl font-light tracking-tight text-[#F5F2EA] sm:text-5xl">
        The tide turned on us.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[#F5F2EA]/50">
        The market could not be loaded. Please try again.
      </p>
      {error.digest && (
        <p className="mt-3 font-mono text-[10px] text-[#F5F2EA]/25">
          Reference: {error.digest}
        </p>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-10 border border-[#F5F2EA]/30 px-10 py-4 text-xs font-medium uppercase tracking-[0.3em] text-[#F5F2EA] transition-colors hover:bg-[#F5F2EA]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]/70"
      >
        Try again
      </button>
    </main>
  );
}
