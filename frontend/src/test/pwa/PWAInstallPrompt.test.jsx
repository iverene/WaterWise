import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PWAInstallPrompt from "../../components/PWAInstallPrompt";

function createInstallEvent(outcome = "accepted") {
  const event = new Event("beforeinstallprompt", { cancelable: true });
  event.prompt = vi.fn().mockResolvedValue(undefined);
  event.userChoice = Promise.resolve({ outcome, platform: "web" });
  return event;
}

describe("PWAInstallPrompt", () => {
  const originalUserAgent = window.navigator.userAgent;

  beforeEach(() => {
    window.sessionStorage.clear();
    Object.defineProperty(window.navigator, "userAgent", {
      configurable: true,
      value: originalUserAgent,
    });
    Object.defineProperty(window, "isSecureContext", {
      configurable: true,
      value: true,
    });
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("binds the installability event and invokes the browser prompt", async () => {
    const installEvent = createInstallEvent();
    render(<PWAInstallPrompt />);

    expect(screen.queryByTestId("pwa-install-prompt")).not.toBeInTheDocument();

    fireEvent(window, installEvent);

    expect(screen.getByTestId("pwa-install-prompt")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Install app" }));

    expect(installEvent.defaultPrevented).toBe(true);
    expect(installEvent.prompt).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(screen.queryByTestId("pwa-install-prompt")).not.toBeInTheDocument();
    });
  });

  it("hides a dismissed prompt for the rest of the browser session", () => {
    render(<PWAInstallPrompt />);
    fireEvent(window, createInstallEvent("dismissed"));
    fireEvent.click(screen.getByRole("button", { name: "Not now" }));

    expect(screen.queryByTestId("pwa-install-prompt")).not.toBeInTheDocument();

    fireEvent(window, createInstallEvent());
    expect(screen.queryByTestId("pwa-install-prompt")).not.toBeInTheDocument();
  });

  it("clears the prompt after the application is installed", () => {
    render(<PWAInstallPrompt />);
    fireEvent(window, createInstallEvent());

    expect(screen.getByTestId("pwa-install-prompt")).toBeInTheDocument();
    fireEvent(window, new Event("appinstalled"));
    expect(screen.queryByTestId("pwa-install-prompt")).not.toBeInTheDocument();
  });

  it("shows Add to Home Screen instructions on iPhone and iPad", () => {
    Object.defineProperty(window.navigator, "userAgent", {
      configurable: true,
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
    });

    render(<PWAInstallPrompt />);

    expect(screen.getByTestId("pwa-install-prompt")).toHaveAttribute(
      "data-install-mode",
      "ios",
    );
    expect(screen.getByText(/tap Share/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Install app" })).not.toBeInTheDocument();
  });

  it("explains the HTTPS requirement on insecure mobile URLs", () => {
    Object.defineProperty(window.navigator, "userAgent", {
      configurable: true,
      value: "Mozilla/5.0 (Linux; Android 15; Mobile)",
    });
    Object.defineProperty(window, "isSecureContext", {
      configurable: true,
      value: false,
    });

    render(<PWAInstallPrompt />);

    expect(screen.getByTestId("pwa-install-prompt")).toHaveAttribute(
      "data-install-mode",
      "insecure",
    );
    expect(screen.getByText(/requires HTTPS/i)).toBeInTheDocument();
  });

  it("does not prompt when already running as an installed application", () => {
    Object.defineProperty(window.navigator, "userAgent", {
      configurable: true,
      value: "Mozilla/5.0 (Linux; Android 15; Mobile)",
    });
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });

    render(<PWAInstallPrompt />);

    expect(screen.queryByTestId("pwa-install-prompt")).not.toBeInTheDocument();
  });
});
