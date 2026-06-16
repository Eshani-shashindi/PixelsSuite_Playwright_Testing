import { test, expect } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

const SAMPLE_GIF = path.join(__dirname, "../test-data/sample.gif");
const DOWNLOAD_FOLDER = path.join(__dirname, "../test-results/downloads");

if (!fs.existsSync(DOWNLOAD_FOLDER)) {
  fs.mkdirSync(DOWNLOAD_FOLDER, { recursive: true });
}

test.describe("GIF Compressor Feature", () => {
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByText("To GIF").first().click();
    await expect(page).toHaveURL(/gif-compressor/);
  });



  // UI BEHAVIOR

  test("PW-014: GIF compressor page loads with Select GIF button and file input visible", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", { name: "Select GIF" }),
    ).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeAttached();
  });

  test("PW-015: Compress and Download buttons are hidden before any file is uploaded", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", { name: "Compress", exact: true }),
    ).not.toBeVisible();
    await expect(
      page
        .locator("a[download], button")
        .filter({ hasText: /download/i })
        .first(),
    ).not.toBeVisible();
  });

  test("PW-016: Uploading a GIF shows a preview image and reveals the Compress button", async ({
    page,
  }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_GIF);

    await expect(page.locator("img").first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Compress", exact: true }),
    ).toBeVisible();
  });

  test("PW-017: Clicking Clear resets the page back to its initial empty state", async ({
    page,
  }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_GIF);
    await expect(page.getByRole("button", { name: "Clear" })).toBeVisible();

    await page.getByRole("button", { name: "Clear" }).click();

    await expect(
      page.getByRole("button", { name: "Select GIF" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Compress", exact: true }),
    ).not.toBeVisible();
    await expect(page.locator("img").first()).not.toBeVisible();
  });

  test("PW-018: Download button only appears after compression has completed successfully", async ({
    page,
  }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_GIF);

    const downloadBtn = page
      .locator("a[download], button")
      .filter({ hasText: /download/i })
      .first();

    await expect(downloadBtn).not.toBeVisible();

    await page.getByRole("button", { name: "Compress", exact: true }).click();

    await expect(downloadBtn).toBeVisible({ timeout: 15000 });
  });

  // CORE FLOW

  test("PW-019:Verify Gift Compress — upload a GIF, compress it, and verify the downloaded file is smaller", async ({
    page,
  }) => {
    const originalSize = fs.statSync(SAMPLE_GIF).size;

    await page.locator('input[type="file"]').setInputFiles(SAMPLE_GIF);
    await expect(page.locator("img").first()).toBeVisible();

    const compressBtn = page.getByRole("button", {
      name: "Compress",
      exact: true,
    });
    await expect(compressBtn).toBeVisible();
    await compressBtn.click();

    const downloadBtn = page
      .locator("a[download], button")
      .filter({ hasText: /download/i })
      .first();

    await expect(downloadBtn).toBeVisible({ timeout: 15000 });

    const downloadPromise = page.waitForEvent("download");
    await downloadBtn.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename().endsWith(".gif")).toBe(true);

    const savePath = path.join(
      DOWNLOAD_FOLDER,
      `gif-core-flow-${Date.now()}.gif`,
    );

    await download.saveAs(savePath);
    const compressedSize = fs.statSync(savePath).size;

    console.log(
      `Original: ${originalSize} bytes → Compressed: ${compressedSize} bytes`,
    );

    expect(compressedSize).toBeGreaterThan(0);
    expect(compressedSize).toBeLessThan(originalSize);

    fs.unlinkSync(savePath);
  });
});
