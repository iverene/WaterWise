import { expect, test } from "@playwright/test";

test.describe("Consumer portal end-to-end journey", () => {
  test("signs in, reviews billing and receipts, then explores consumption charts", async ({
    page,
  }) => {
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Select your role" })).toBeVisible();

    await page.getByRole("button", { name: /^Consumer/ }).click();
    await page.getByLabel("Email or username").fill("tenant@gmail.com");
    await page.getByLabel("Password").fill("tenant123");

    const historyResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/consumption") && response.status() === 200,
    );

    await page.getByRole("button", { name: "Sign in as Consumer" }).click();
    await expect(page).toHaveURL(/\/consumer\/usage-metrics$/);
    await historyResponse;

    await expect(page.getByRole("heading", { name: "Usage Metrics" })).toBeVisible();
    await expect(page.getByTestId("analytics-grid")).toBeVisible();
    await expect(page.getByTestId("trend-graph-container")).toBeVisible();
    await expect(page.getByTestId("graph-node")).toHaveCount(7);

    await page.getByRole("link", { name: "Billing Ledger" }).click();
    await expect(page).toHaveURL(/\/consumer\/billing-ledger$/);
    await expect(page.getByRole("heading", { name: "Billing Ledger" })).toBeVisible();

    await expect(page.getByTestId("current-billing-card")).toBeVisible();
    await expect(page.getByTestId("outstanding-balance")).toContainText("450.00");
    await expect(page.getByTestId("due-date")).toHaveText("July 25, 2026");
    await expect(page.getByTestId("billing-history-table")).toBeVisible();
    await expect(page.getByTestId("history-row")).toHaveCount(3);
    await expect(page.getByTestId("view-receipt-INV-2026-006")).toBeDisabled();

    await page.getByTestId("view-receipt-INV-2026-005").click();
    await expect(page.getByTestId("receipt-modal-content")).toBeVisible();
    await expect(page.getByTestId("receipt-invoice")).toHaveText("INV-2026-005");
    await expect(page.getByTestId("receipt-diff")).toContainText("22.1");
    await expect(page.getByTestId("receipt-total-payable")).toContainText("390.00");
    await page.getByRole("button", { name: "Close receipt" }).click();
    await expect(page.getByTestId("receipt-modal-content")).toBeHidden();

    await page.getByRole("button", { name: "View Official Receipt" }).click();
    await expect(page).toHaveURL(/\/consumer\/billing-ledger\?receipt=official$/);
    await expect(
      page.getByRole("heading", { name: "Sucol Water System Official Receipt" }),
    ).toBeVisible();
    await expect(page.getByTestId("receipt-meter-name")).toHaveText("SWS-MTR-0412");
    await expect(page.getByTestId("receipt-final-total")).toContainText("450.00");
    await page.getByRole("button", { name: "Close official receipt" }).click();
    await expect(page).toHaveURL(/\/consumer\/billing-ledger$/);

    const refreshedHistoryResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/consumption") && response.status() === 200,
    );
    await page.getByRole("link", { name: "Usage Metrics" }).click();
    await refreshedHistoryResponse;
    await expect(page).toHaveURL(/\/consumer\/usage-metrics$/);

    const yearFilter = page.getByTestId("year-filter");
    await expect(yearFilter.locator("option")).toHaveText(["2025", "2026"]);
    await yearFilter.selectOption("2025");
    await expect(page.getByTestId("graph-node")).toHaveCount(12);
    await expect(page.getByTestId("axis-month-label").first()).toHaveText("January 2025");
    await expect(page.getByTestId("axis-month-label").last()).toHaveText("December 2025");

    await yearFilter.selectOption("2026");
    await expect(page.getByTestId("graph-node")).toHaveCount(7);
    await expect(page.getByTestId("axis-month-label").last()).toHaveText("July 2026");
    expect(pageErrors).toEqual([]);
  });
});
