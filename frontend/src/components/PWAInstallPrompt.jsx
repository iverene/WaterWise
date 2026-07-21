import { useEffect, useState } from "react";
import { FiDownload, FiX } from "react-icons/fi";

const DISMISSED_KEY = "waterwise-pwa-install-dismissed";

function isStandalone() {
  return window.matchMedia?.("(display-mode: standalone)").matches === true
    || window.navigator.standalone === true;
}

function getMobilePlatform() {
  const userAgent = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/i.test(userAgent)
    || (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);

  if (isIOS) return "ios";
  if (/Android|Mobile/i.test(userAgent)) return "mobile";
  return null;
}

function getInitialPromptState() {
  if (
    isStandalone()
    || window.sessionStorage.getItem(DISMISSED_KEY) === "true"
  ) {
    return null;
  }

  const platform = getMobilePlatform();
  if (!platform) return null;
  if (window.isSecureContext === false) return { mode: "insecure" };
  return { mode: platform };
}

export default function PWAInstallPrompt() {
  const [promptState, setPromptState] = useState(getInitialPromptState);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();

      if (window.sessionStorage.getItem(DISMISSED_KEY) !== "true") {
        setPromptState({ event, mode: "native" });
      }
    };

    const handleAppInstalled = () => {
      setPromptState(null);
      window.sessionStorage.removeItem(DISMISSED_KEY);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (!promptState) {
    return null;
  }

  const handleDismiss = () => {
    window.sessionStorage.setItem(DISMISSED_KEY, "true");
    setPromptState(null);
  };

  const handleInstall = async () => {
    await promptState.event.prompt();
    await promptState.event.userChoice;
    setPromptState(null);
  };

  const instructions = {
    insecure: "Installation requires HTTPS on a phone. Open the deployed HTTPS site instead of a local-network HTTP address.",
    ios: "In Safari, tap Share, then choose Add to Home Screen.",
    mobile: "Open your browser menu and choose Install app or Add to Home screen.",
    native: "Add WaterWise to your device for quick access and an app-like experience.",
  }[promptState.mode];

  return (
    <aside
      aria-labelledby="pwa-install-title"
      className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-md rounded-[12px] border border-sky-200 bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.22)] sm:bottom-6"
      data-install-mode={promptState.mode}
      data-testid="pwa-install-prompt"
      role="dialog"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-sky-50 text-[#0284C7]">
          <FiDownload aria-hidden="true" className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-[#0F172A]" id="pwa-install-title">
            Install WaterWise
          </h2>
          <p className="mt-1 text-sm leading-5 text-slate-600">
            {instructions}
          </p>

          <div className="mt-4 flex gap-2">
            {promptState.mode === "native" && (
              <button
                className="rounded-[8px] bg-[#0284C7] px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2"
                onClick={handleInstall}
                type="button"
              >
                Install app
              </button>
            )}
            <button
              className="rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2"
              onClick={handleDismiss}
              type="button"
            >
              Not now
            </button>
          </div>
        </div>

        <button
          aria-label="Dismiss install prompt"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-slate-500 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7]"
          onClick={handleDismiss}
          type="button"
        >
          <FiX aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
}
