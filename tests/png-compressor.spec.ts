import { test, expect } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

const SAMPLE_JPG = path.join(__dirname, "../test-data/image (6).jpg");
const SAMPLE_PNG = path.join(__dirname, "../test-data/11mb.png");
const SAMPLE_WEBP = path.join(__dirname, "../test-data/image.webp");
const SAMPLE_GIF = path.join(__dirname, "../test-data/sample.gif");
const SAMPLE_PDF = path.join(__dirname, "../test-data/sample.pdf");
const DOWNLOAD_FOLDER = path.join(__dirname, "../test-results/downloads");

if (!fs.existsSync(DOWNLOAD_FOLDER)) {
  fs.mkdirSync(DOWNLOAD_FOLDER, { recursive: true });
}

test.describe("PNG Compressor", () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Compress" }).first().click();
    await page.getByRole("button", { name: "PNG Compressor" }).click();
    await page.waitForLoadState("networkidle");
  });

  // UI BEHAVIOR

  test("PW-020: PNG compressor page loads with the file upload area and Select Files button visible", async ({
    page,
  }) => {
    await expect(page.locator('input[type="file"]')).toBeAttached();
    await expect(
      page.getByRole("button", { name: "Select files" }),
    ).toBeVisible();
  });

  test("PW-021: File input is configured to accept any image format", async ({
    page,
  }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
    const accept = await fileInput.getAttribute("accept");
    expect(accept).toBe("image/*");
  });

  test("PW-023: Clicking Clear after an upload resets the page to its initial empty state", async ({
    page,
  }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_PNG);
    await page.getByRole("button", { name: "Clear" }).click();
    await expect(
      page.getByRole("button", { name: "Select files" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /download/i })).toBeHidden();
  });

  // PNG INPUT

  test("PW-024: Verify PNG Compress — upload a PNG and check file size reduction", async ({
    page,
    browserName,
  }) => {
    const originalSize = fs.statSync(SAMPLE_PNG).size;

    await page.locator('input[type="file"]').setInputFiles(SAMPLE_PNG);

    await expect(page.getByRole("button", { name: /download/i })).toBeVisible({
      timeout: 15000,
    });

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /download/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.png$/i);

    const savePath = path.join(
      DOWNLOAD_FOLDER,
      `png-compressed-${Date.now()}.png`,
    );
    await download.saveAs(savePath);
    const compressedSize = fs.statSync(savePath).size;
    console.log(
      `PNG → PNG: Original: ${originalSize} bytes → Compressed: ${compressedSize} bytes`,
    );

    expect(compressedSize).toBeLessThan(originalSize);
  });

  // JPG INPUT

  test("PW-025: Uploading a JPG converts it and produces a valid PNG download", async ({
    page,
  }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_JPG);

    await expect(page.locator("body")).toContainText(
      /PNG compression is lossless/i,
      { timeout: 15000 },
    );
    await expect(page.getByRole("button", { name: /download/i })).toBeVisible({
      timeout: 15000,
    });

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /download/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.png$/i);
  });

  test("PW-026: Converting a JPG to PNG produces a file that is smaller than the original", async ({
    page,
  }) => {
    const originalSize = fs.statSync(SAMPLE_JPG).size;

    await page.locator('input[type="file"]').setInputFiles(SAMPLE_JPG);
    await expect(page.getByRole("button", { name: /download/i })).toBeVisible({
      timeout: 15000,
    });

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /download/i }).click();
    const download = await downloadPromise;

    const savePath = path.join(DOWNLOAD_FOLDER, `jpg-to-png-${Date.now()}.png`);
    await download.saveAs(savePath);
    const compressedSize = fs.statSync(savePath).size;
    console.log(
      `JPG → PNG: Original: ${originalSize} bytes → Compressed: ${compressedSize} bytes`,
    );

    expect(compressedSize).toBeLessThan(originalSize);
  });

  // WEBP INPUT

  test("PW-027: Uploading a WebP converts it and produces a valid PNG download", async ({
    page,
  }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_WEBP);
    await expect(page.getByRole("button", { name: /download/i })).toBeVisible({
      timeout: 15000,
    });

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /download/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.png$/i);
  });

  test("PW-028: Converting a WebP to PNG produces a file that is smaller than the original", async ({
    page,
  }) => {
    const originalSize = fs.statSync(SAMPLE_WEBP).size;

    await page.locator('input[type="file"]').setInputFiles(SAMPLE_WEBP);
    await expect(page.getByRole("button", { name: /download/i })).toBeVisible({
      timeout: 15000,
    });

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /download/i }).click();
    const download = await downloadPromise;

    const savePath = path.join(
      DOWNLOAD_FOLDER,
      `webp-to-png-${Date.now()}.png`,
    );
    await download.saveAs(savePath);
    const compressedSize = fs.statSync(savePath).size;
    console.log(
      `WebP → PNG: Original: ${originalSize} bytes → Compressed: ${compressedSize} bytes`,
    );

    expect(compressedSize).toBeLessThan(originalSize);
  });

  // GIF INPUT

  test("PW-029: Uploading a GIF converts it and produces a valid PNG download", async ({
    page,
  }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_GIF);
    await expect(page.getByRole("button", { name: /download/i })).toBeVisible({
      timeout: 15000,
    });

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /download/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.png$/i);
  });

  test("PW-030: Converting a GIF to PNG produces a file that is smaller than the original", async ({
    page,
  }) => {
    const originalSize = fs.statSync(SAMPLE_GIF).size;

    await page.locator('input[type="file"]').setInputFiles(SAMPLE_GIF);
    await expect(page.getByRole("button", { name: /download/i })).toBeVisible({
      timeout: 15000,
    });

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /download/i }).click();
    const download = await downloadPromise;

    const savePath = path.join(DOWNLOAD_FOLDER, `gif-to-png-${Date.now()}.png`);
    await download.saveAs(savePath);
    const compressedSize = fs.statSync(savePath).size;
    console.log(
      `GIF → PNG: Original: ${originalSize} bytes → Compressed: ${compressedSize} bytes`,
    );

    expect(compressedSize).toBeLessThan(originalSize);
  });

  // VALIDATION

  test("PW-031: Uploading an unsupported file type (PDF) does not show the Download button", async ({
    page,
  }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_PDF);

    const downloadBtn = page.getByRole("button", { name: /download/i });
    const isVisible = await downloadBtn.isVisible();
    console.log("Download button visible for PDF upload:", isVisible);

    await expect(downloadBtn).not.toBeVisible();
  });
});
