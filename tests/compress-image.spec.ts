import { test, expect } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

const SAMPLE_JPG = path.join(__dirname, "../test-data/image (6).jpg");
const SAMPLE_PNG = path.join(__dirname, "../test-data/image (11).png");
const SAMPLE_WEBP = path.join(__dirname, "../test-data/image.webp");
const SAMPLE_GIF = path.join(__dirname, "../test-data/sample.gif");
const SAMPLE_PDF = path.join(__dirname, "../test-data/sample.pdf");
const DOWNLOAD_FOLDER = path.join(__dirname, "../test-results/downloads");

if (!fs.existsSync(DOWNLOAD_FOLDER)) {
  fs.mkdirSync(DOWNLOAD_FOLDER, { recursive: true });
}

test.describe("Image Compressor Feature", () => {
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Compress" }).first().click();
    await page.getByText("Compress Image").first().click();
    await page.waitForLoadState("networkidle");
  });



  // PAGE LOAD

  test("PW-001: Page loads with correct URL and upload area visible", async ({
    page,
  }) => {
    await expect(page).toHaveURL(/compress-image/);
    await expect(page.locator('input[type="file"]')).toBeAttached();
    await expect(page.getByText("Select files")).toBeVisible();
  });

  test("PW-002: Download button is hidden before any file is uploaded", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", { name: /download/i }),
    ).not.toBeVisible();
  });

  // UPLOAD & UI OPTIONS

  test("PW-003: Uploading an image reveals quality slider, format selector and download button", async ({
    page,
  }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_JPG);

    await expect(page.locator('input[type="range"]')).toBeVisible();
    await expect(page.locator("select").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /download/i })).toBeVisible();
  });

  // CLEAR BUTTON

  test("PW-004: Clear button resets the page to its initial state", async ({
    page,
  }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_PNG);
    await page.getByRole("button", { name: "Clear" }).click();

    await expect(page.getByText("Select files")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /download/i }),
    ).not.toBeVisible();
  });

  // CROSS-FORMAT CONVERSION

  test("PW-005: Converting PNG to JPG reduces file size", async ({ page }) => {
    const originalSize = fs.statSync(SAMPLE_PNG).size;
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_PNG);
    await page.locator("select").first().selectOption("image/jpeg");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /download/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename().endsWith(".jpg")).toBe(true);

    const savePath = path.join(DOWNLOAD_FOLDER, `png-to-jpg-${Date.now()}.jpg`);
    await download.saveAs(savePath);
    const compressedSize = fs.statSync(savePath).size;
    console.log(
      `Size: Original: ${originalSize} bytes -> Compressed: ${compressedSize} bytes`,
    );

    expect(compressedSize).toBeLessThan(originalSize);
  });

  test("PW-006: Converting PNG to WEBP reduces file size", async ({ page }) => {
    const originalSize = fs.statSync(SAMPLE_PNG).size;
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_PNG);
    await page.locator("select").first().selectOption("image/webp");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /download/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename().endsWith(".webp")).toBe(true);

    const savePath = path.join(
      DOWNLOAD_FOLDER,
      `png-to-webp-${Date.now()}.webp`,
    );
    await download.saveAs(savePath);
    const compressedSize = fs.statSync(savePath).size;
    console.log(
      `Size: Original: ${originalSize} bytes -> Compressed: ${compressedSize} bytes`,
    );

    expect(compressedSize).toBeLessThan(originalSize);
  });

  test("PW-007: Converting JPG to WEBP reduces file size", async ({ page }) => {
    const originalSize = fs.statSync(SAMPLE_JPG).size;
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_JPG);
    await page.locator("select").first().selectOption("image/webp");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /download/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename().endsWith(".webp")).toBe(true);

    const savePath = path.join(
      DOWNLOAD_FOLDER,
      `jpg-to-webp-${Date.now()}.webp`,
    );
    await download.saveAs(savePath);
    const compressedSize = fs.statSync(savePath).size;
    console.log(
      `Size: Original: ${originalSize} bytes -> Compressed: ${compressedSize} bytes`,
    );

    expect(compressedSize).toBeLessThan(originalSize);
  });

  test("PW-008: Converting WEBP to JPG produces a valid output file", async ({
    page,
  }) => {
    const originalSize = fs.statSync(SAMPLE_WEBP).size;
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_WEBP);
    await page.locator("select").first().selectOption("image/jpeg");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /download/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename().endsWith(".jpg")).toBe(true);

    const savePath = path.join(
      DOWNLOAD_FOLDER,
      `webp-to-jpg-${Date.now()}.jpg`,
    );
    await download.saveAs(savePath);
    const compressedSize = fs.statSync(savePath).size;
    console.log(
      `Size: Original: ${originalSize} bytes -> Compressed: ${compressedSize} bytes`,
    );

    expect(compressedSize).toBeGreaterThan(0);
  });

  test("PW-009: Converting GIF to JPG reduces file size", async ({ page }) => {
    const originalSize = fs.statSync(SAMPLE_GIF).size;
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_GIF);
    await page.locator("select").first().selectOption("image/jpeg");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /download/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename().endsWith(".jpg")).toBe(true);

    const savePath = path.join(DOWNLOAD_FOLDER, `gif-to-jpg-${Date.now()}.jpg`);
    await download.saveAs(savePath);
    const compressedSize = fs.statSync(savePath).size;
    console.log(
      `Size: Original: ${originalSize} bytes -> Compressed: ${compressedSize} bytes`,
    );

    expect(compressedSize).toBeLessThan(originalSize);
  });

  test("PW-010: Converting GIF to WEBP reduces file size", async ({ page }) => {
    const originalSize = fs.statSync(SAMPLE_GIF).size;
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_GIF);
    await page.locator("select").first().selectOption("image/webp");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /download/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename().endsWith(".webp")).toBe(true);

    const savePath = path.join(
      DOWNLOAD_FOLDER,
      `gif-to-webp-${Date.now()}.webp`,
    );
    await download.saveAs(savePath);
    const compressedSize = fs.statSync(savePath).size;
    console.log(
      `Size: Original: ${originalSize} bytes -> Compressed: ${compressedSize} bytes`,
    );

    expect(compressedSize).toBeLessThan(originalSize);
  });

  // SAME-FORMAT COMPRESSION

  test("PW-011: JPG to JPG compression reduces file size", async ({ page }) => {
    const originalSize = fs.statSync(SAMPLE_JPG).size;
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_JPG);
    await page.locator("select").first().selectOption("image/jpeg");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /download/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename().endsWith(".jpg")).toBe(true);

    const savePath = path.join(DOWNLOAD_FOLDER, `jpg-to-jpg-${Date.now()}.jpg`);
    await download.saveAs(savePath);
    const compressedSize = fs.statSync(savePath).size;
    console.log(
      `Size: Original: ${originalSize} bytes -> Compressed: ${compressedSize} bytes`,
    );

    expect(compressedSize).toBeLessThan(originalSize);
  });

  test("PW-012: WEBP to WEBP compression produces a valid output file", async ({
    page,
  }) => {
    const originalSize = fs.statSync(SAMPLE_WEBP).size;
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_WEBP);
    await page.locator("select").first().selectOption("image/webp");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /download/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename().endsWith(".webp")).toBe(true);

    const savePath = path.join(
      DOWNLOAD_FOLDER,
      `webp-to-webp-${Date.now()}.webp`,
    );
    await download.saveAs(savePath);
    const compressedSize = fs.statSync(savePath).size;
    console.log(
      `Size: Original: ${originalSize} bytes -> Compressed: ${compressedSize} bytes`,
    );

    expect(compressedSize).toBeGreaterThan(0);
  });

  // UNSUPPORTED FILE TYPE
  test("PW-013: PDF upload is rejected and no download is generated", async ({
    page,
  }) => {
    await page.locator('input[type="file"]').setInputFiles(SAMPLE_PDF);

    const downloadBtn = page.getByRole("button", {
      name: /download/i,
    });

    await expect(downloadBtn).toBeHidden();
  });
});
