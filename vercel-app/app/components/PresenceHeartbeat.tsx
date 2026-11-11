"use client";
import { useEffect } from "react";

export default function PresenceHeartbeat({section}:{section:string}) {
  useEffect(() => {
    let stopped = false;
    async function pulse() {
      if (stopped || document.visibilityState !== "visible") return;
      await fetch("/api/private/presence", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({section}), cache:"no-store", credentials:"same-origin",
      }).catch(() => undefined);
    }
    void pulse();
    const timer = window.setInterval(() => { void pulse(); }, 60000);
    document.addEventListener("visibilitychange", pulse);
    return () => { stopped = true; window.clearInterval(timer); document.removeEventListener("visibilitychange", pulse); };
  }, [section]);
  return null;
}
