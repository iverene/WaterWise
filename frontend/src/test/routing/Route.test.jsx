import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../../App";
import { MOCK_ROLE_STORAGE_KEY } from "../../config/mockAuth";

function renderRoute(path = "/") {
  window.history.pushState({}, "", path);
  return render(<App />);
}

describe("App routing", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.pushState({}, "", "/");
  });

  it("redirects the app root to the login page", async () => {
    renderRoute("/");

    expect(
      await screen.findByRole("heading", { name: /select your role/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(window.location.pathname).toBe("/login");
    });
  });

  it("redirects unknown routes back to login", async () => {
    renderRoute("/missing-page");

    expect(
      await screen.findByRole("heading", { name: /select your role/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(window.location.pathname).toBe("/login");
    });
  });

  it("signs in with the selected mock role and opens the matching route", async () => {
    const user = userEvent.setup();
    renderRoute("/login");

    await user.click(screen.getByRole("button", { name: /consumer/i }));
    await user.type(screen.getByLabelText(/email or username/i), "consumer@sucolwater.local");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign in as consumer/i }));

    expect(
      await screen.findByRole("heading", { level: 1, name: /profile details/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/contact and location/i)).toBeInTheDocument();
    expect(window.location.pathname).toBe("/consumer/profile-details");
  });

  it("redirects role base paths to their default portal pages", async () => {
    window.localStorage.setItem(MOCK_ROLE_STORAGE_KEY, "admin");
    const { unmount } = renderRoute("/admin");

    expect(
      await screen.findByRole("heading", { level: 1, name: /dashboard/i }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(window.location.pathname).toBe("/admin/dashboard");
    });

    unmount();
    window.localStorage.setItem(MOCK_ROLE_STORAGE_KEY, "meter-reader");
    renderRoute("/meter-reader");

    expect(
      await screen.findByRole("heading", { level: 1, name: /readings entry/i }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(window.location.pathname).toBe("/meter-reader/readings-entry");
    });
  });

  it("renders mock portal routes inside the shared layout", async () => {
    window.localStorage.setItem(MOCK_ROLE_STORAGE_KEY, "admin");
    renderRoute("/admin/events");

    expect(
      await screen.findByRole("heading", { level: 1, name: /events/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/mock workspace/i)).toBeInTheDocument();
    expect(
      screen.getByText(/this canvas is ready for the events page view/i),
    ).toBeInTheDocument();
  });

  it("shows a route access error when no mock role is signed in", async () => {
    renderRoute("/consumer/profile-details");

    expect(
      await screen.findByRole("heading", {
        name: /this page is not available for your role/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/no mock user is signed in/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /go to login/i })).toHaveAttribute(
      "href",
      "/login",
    );
  });

  it("shows a role access error when the saved mock role opens another portal", async () => {
    window.localStorage.setItem(MOCK_ROLE_STORAGE_KEY, "consumer");
    renderRoute("/admin/dashboard");

    expect(
      await screen.findByRole("heading", {
        name: /this page is not available for your role/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/signed in as consumer/i)).toBeInTheDocument();
    expect(screen.getByText(/admin workspace/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 1, name: /dashboard/i }),
    ).not.toBeInTheDocument();
  });

  it("shows a role access error when a role opens an unassigned section under its own portal", async () => {
    window.localStorage.setItem(MOCK_ROLE_STORAGE_KEY, "consumer");
    renderRoute("/consumer/readings");

    expect(
      await screen.findByRole("heading", {
        name: /this page is not available for your role/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/signed in as consumer/i)).toBeInTheDocument();
    expect(screen.queryByText(/mock workspace/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open my portal/i })).toHaveAttribute(
      "href",
      "/consumer/profile-details",
    );
  });

  it("lets the user return to their allowed portal from the route access error", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(MOCK_ROLE_STORAGE_KEY, "meter-reader");
    renderRoute("/consumer/profile-details");

    await user.click(await screen.findByRole("link", { name: /open my portal/i }));

    expect(
      await screen.findByRole("heading", { level: 1, name: /readings entry/i }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/meter-reader/readings-entry");
  });

  it("renders the consumer billing ledger route", async () => {
    window.localStorage.setItem(MOCK_ROLE_STORAGE_KEY, "consumer");
    renderRoute("/consumer/billing-ledger");

    expect(
      await screen.findByRole("heading", { level: 1, name: /billing ledger/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("current-billing-card")).toBeInTheDocument();
    expect(screen.getByTestId("billing-history-table")).toBeInTheDocument();
  });

  it("renders the consumer usage metrics route", async () => {
    window.localStorage.setItem(MOCK_ROLE_STORAGE_KEY, "consumer");
    renderRoute("/consumer/usage-metrics");

    expect(
      await screen.findByRole("heading", { level: 1, name: /usage metrics/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("analytics-grid")).toBeInTheDocument();
    expect(screen.getByTestId("trend-graph-container")).toBeInTheDocument();
  });
});
