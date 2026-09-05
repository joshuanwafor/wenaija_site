"use client";

import { useState } from "react";

const MAX = 500;

export function Composer({
  online,
  onPost,
  viewerLocation,
}: {
  online: boolean;
  onPost: (body: string) => void;
  viewerLocation: string;
}) {
  const [body, setBody] = useState("");
  const [open, setOpen] = useState(false);

  const remaining = MAX - body.length;
  const canPost = body.trim().length > 0 && remaining >= 0;

  function submit() {
    if (!canPost) return;
    onPost(body.trim());
    setBody("");
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl border border-ink-900/8 bg-white p-4 text-left transition-colors hover:border-naija-500/40"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-900 text-[12px] font-bold text-white">
          YO
        </span>
        <span className="text-[15px] text-ink-900/40">
          What&apos;s happening in {viewerLocation}?
        </span>
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-naija-500/40 bg-white p-4">
      <div className="flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-900 text-[12px] font-bold text-white">
          YO
        </span>
        <textarea
          autoFocus
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder={`What's happening in ${viewerLocation}?`}
          className="w-full resize-none border-0 bg-transparent text-[15px] leading-relaxed text-ink-900 outline-none placeholder:text-ink-900/35"
        />
      </div>

      <div className="mt-3 flex items-center gap-3 border-t border-ink-900/6 pt-3">
        <p className="text-[12px] text-ink-900/45">
          Posts to{" "}
          <span className="font-semibold text-ink-900/70">{viewerLocation}</span>
        </p>

        <span
          className={`ml-auto text-[12px] tabular-nums ${
            remaining < 0
              ? "font-semibold text-red-600"
              : remaining < 50
                ? "text-ink-900/60"
                : "text-ink-900/35"
          }`}
        >
          {remaining}
        </span>

        <button
          type="button"
          onClick={() => {
            setBody("");
            setOpen(false);
          }}
          className="rounded-full px-3 py-2 text-[13px] font-medium text-ink-900/50 hover:text-ink-900"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={!canPost}
          className="rounded-full bg-naija-600 px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-naija-500 disabled:pointer-events-none disabled:opacity-40"
        >
          {online ? "Post" : "Queue"}
        </button>
      </div>

      {!online ? (
        <p className="mt-2 text-[12px] text-ink-900/50">
          You&apos;re offline — this will be saved on your device and posted
          automatically when you reconnect.
        </p>
      ) : null}
    </div>
  );
}
