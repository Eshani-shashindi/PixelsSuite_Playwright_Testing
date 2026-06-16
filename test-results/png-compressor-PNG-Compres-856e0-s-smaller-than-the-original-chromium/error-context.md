# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: png-compressor.spec.ts >> PNG Compressor >> PW-028: Converting a WebP to PNG produces a file that is smaller than the original
- Location: tests\png-compressor.spec.ts:156:7

# Error details

```
Error: expect(received).toBeLessThan(expected)

Expected: < 7768
Received:   201164
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e6]:
      - button "PixelsSuite" [ref=e7] [cursor=pointer]
      - generic [ref=e8]:
        - button "Document Converter ▾" [ref=e10] [cursor=pointer]
        - button "Editor ▾" [ref=e12] [cursor=pointer]
        - button "Resize ▾" [ref=e14] [cursor=pointer]
        - button "Crop ▾" [ref=e16] [cursor=pointer]
        - button "Compress ▾" [ref=e18] [cursor=pointer]
        - button "Image Converter ▾" [ref=e20] [cursor=pointer]
        - button "More ▾" [ref=e22] [cursor=pointer]
    - generic [ref=e23]:
      - generic [ref=e25]:
        - iframe [ref=e27]:
          - iframe [ref=f1e2]:
            - link [ref=f8e3] [cursor=pointer]:
              - /url: https://clicks.pipaffiliates.com/c?c=873073&l=en&p=0
        - iframe [ref=e29]:
          - iframe [ref=f2e2]:
            - link [ref=f6e3] [cursor=pointer]:
              - /url: https://clicks.pipaffiliates.com/c?c=873073&l=en&p=0
      - generic [ref=e31]:
        - generic [ref=e34]:
          - generic [ref=e35]: PNG Compressor
          - generic [ref=e36] [cursor=pointer]:
            - generic [ref=e37]: ⬆️
            - generic [ref=e38]: Drag and drop your file here
            - generic [ref=e39]: or click to browse from your device
            - generic [ref=e40]:
              - button "Select files"
            - generic [ref=e41]: "Supported: PNG, JPG, WEBP • Max 20MB"
          - button "Clear" [ref=e43] [cursor=pointer]
          - generic [ref=e44]:
            - generic [ref=e46]:
              - generic [ref=e48]: Compress
              - generic [ref=e50]:
                - generic [ref=e51]: PNG compression is lossless. Canvas export re-encodes the PNG.
                - button "Download PNG" [active] [ref=e52] [cursor=pointer]
            - generic [ref=e56]: Preview
        - iframe [ref=e61]:
          - iframe [ref=f3e2]:
            - link [ref=f9e3] [cursor=pointer]:
              - /url: https://clicks.pipaffiliates.com/c?c=873073&l=en&p=0
      - generic [ref=e63]:
        - iframe [ref=e65]:
          - iframe [ref=f4e2]:
            - link [ref=f7e3] [cursor=pointer]:
              - /url: https://clicks.pipaffiliates.com/c?c=873073&l=en&p=0
        - iframe [ref=e67]:
          - iframe [ref=f5e2]:
            - link [ref=f10e3] [cursor=pointer]:
              - /url: https://clicks.pipaffiliates.com/c?c=873073&l=en&p=0
  - contentinfo [ref=e68]:
    - generic [ref=e70]:
      - generic [ref=e71]: PixelsSuite ©2026
      - navigation [ref=e72]:
        - link "About Us" [ref=e73] [cursor=pointer]:
          - /url: /about
        - link "Contact" [ref=e74] [cursor=pointer]:
          - /url: /contact
        - link "Privacy Policy" [ref=e75] [cursor=pointer]:
          - /url: /privacy
        - link "Terms of Service" [ref=e76] [cursor=pointer]:
          - /url: /terms
        - link "Disclaimer" [ref=e77] [cursor=pointer]:
          - /url: /disclaimer
```

# Test source

```ts
  80  |     const savePath = path.join(
  81  |       DOWNLOAD_FOLDER,
  82  |       `png-compressed-${Date.now()}.png`,
  83  |     );
  84  |     await download.saveAs(savePath);
  85  |     const compressedSize = fs.statSync(savePath).size;
  86  |     console.log(
  87  |       `PNG → PNG: Original: ${originalSize} bytes → Compressed: ${compressedSize} bytes`,
  88  |     );
  89  | 
  90  |       expect(compressedSize).toBeLessThan(originalSize);
  91  |   });
  92  | 
  93  |   // JPG INPUT
  94  | 
  95  |   test("PW-025: Uploading a JPG converts it and produces a valid PNG download", async ({
  96  |     page,
  97  |   }) => {
  98  |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_JPG);
  99  | 
  100 |     await expect(page.locator("body")).toContainText(
  101 |       /PNG compression is lossless/i,
  102 |       { timeout: 15000 },
  103 |     );
  104 |     await expect(page.getByRole("button", { name: /download/i })).toBeVisible({
  105 |       timeout: 15000,
  106 |     });
  107 | 
  108 |     const downloadPromise = page.waitForEvent("download");
  109 |     await page.getByRole("button", { name: /download/i }).click();
  110 |     const download = await downloadPromise;
  111 | 
  112 |     expect(download.suggestedFilename()).toMatch(/\.png$/i);
  113 |   });
  114 | 
  115 |   test("PW-026: Converting a JPG to PNG produces a file that is smaller than the original", async ({
  116 |     page,
  117 |   }) => {
  118 |     const originalSize = fs.statSync(SAMPLE_JPG).size;
  119 | 
  120 |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_JPG);
  121 |     await expect(page.getByRole("button", { name: /download/i })).toBeVisible({
  122 |       timeout: 15000,
  123 |     });
  124 | 
  125 |     const downloadPromise = page.waitForEvent("download");
  126 |     await page.getByRole("button", { name: /download/i }).click();
  127 |     const download = await downloadPromise;
  128 | 
  129 |     const savePath = path.join(DOWNLOAD_FOLDER, `jpg-to-png-${Date.now()}.png`);
  130 |     await download.saveAs(savePath);
  131 |     const compressedSize = fs.statSync(savePath).size;
  132 |     console.log(
  133 |       `JPG → PNG: Original: ${originalSize} bytes → Compressed: ${compressedSize} bytes`,
  134 |     );
  135 | 
  136 |     expect(compressedSize).toBeLessThan(originalSize);
  137 |   });
  138 | 
  139 |   // WEBP INPUT
  140 | 
  141 |   test("PW-027: Uploading a WebP converts it and produces a valid PNG download", async ({
  142 |     page,
  143 |   }) => {
  144 |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_WEBP);
  145 |     await expect(page.getByRole("button", { name: /download/i })).toBeVisible({
  146 |       timeout: 15000,
  147 |     });
  148 | 
  149 |     const downloadPromise = page.waitForEvent("download");
  150 |     await page.getByRole("button", { name: /download/i }).click();
  151 |     const download = await downloadPromise;
  152 | 
  153 |     expect(download.suggestedFilename()).toMatch(/\.png$/i);
  154 |   });
  155 | 
  156 |   test("PW-028: Converting a WebP to PNG produces a file that is smaller than the original", async ({
  157 |     page,
  158 |   }) => {
  159 |     const originalSize = fs.statSync(SAMPLE_WEBP).size;
  160 | 
  161 |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_WEBP);
  162 |     await expect(page.getByRole("button", { name: /download/i })).toBeVisible({
  163 |       timeout: 15000,
  164 |     });
  165 | 
  166 |     const downloadPromise = page.waitForEvent("download");
  167 |     await page.getByRole("button", { name: /download/i }).click();
  168 |     const download = await downloadPromise;
  169 | 
  170 |     const savePath = path.join(
  171 |       DOWNLOAD_FOLDER,
  172 |       `webp-to-png-${Date.now()}.png`,
  173 |     );
  174 |     await download.saveAs(savePath);
  175 |     const compressedSize = fs.statSync(savePath).size;
  176 |     console.log(
  177 |       `WebP → PNG: Original: ${originalSize} bytes → Compressed: ${compressedSize} bytes`,
  178 |     );
  179 | 
> 180 |     expect(compressedSize).toBeLessThan(originalSize);
      |                            ^ Error: expect(received).toBeLessThan(expected)
  181 |   });
  182 | 
  183 |   // GIF INPUT
  184 | 
  185 |   test("PW-029: Uploading a GIF converts it and produces a valid PNG download", async ({
  186 |     page,
  187 |   }) => {
  188 |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_GIF);
  189 |     await expect(page.getByRole("button", { name: /download/i })).toBeVisible({
  190 |       timeout: 15000,
  191 |     });
  192 | 
  193 |     const downloadPromise = page.waitForEvent("download");
  194 |     await page.getByRole("button", { name: /download/i }).click();
  195 |     const download = await downloadPromise;
  196 | 
  197 |     expect(download.suggestedFilename()).toMatch(/\.png$/i);
  198 |   });
  199 | 
  200 |   test("PW-030: Converting a GIF to PNG produces a file that is smaller than the original", async ({
  201 |     page,
  202 |   }) => {
  203 |     const originalSize = fs.statSync(SAMPLE_GIF).size;
  204 | 
  205 |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_GIF);
  206 |     await expect(page.getByRole("button", { name: /download/i })).toBeVisible({
  207 |       timeout: 15000,
  208 |     });
  209 | 
  210 |     const downloadPromise = page.waitForEvent("download");
  211 |     await page.getByRole("button", { name: /download/i }).click();
  212 |     const download = await downloadPromise;
  213 | 
  214 |     const savePath = path.join(DOWNLOAD_FOLDER, `gif-to-png-${Date.now()}.png`);
  215 |     await download.saveAs(savePath);
  216 |     const compressedSize = fs.statSync(savePath).size;
  217 |     console.log(
  218 |       `GIF → PNG: Original: ${originalSize} bytes → Compressed: ${compressedSize} bytes`,
  219 |     );
  220 | 
  221 |     expect(compressedSize).toBeLessThan(originalSize);
  222 |   });
  223 | 
  224 |   // VALIDATION
  225 | 
  226 |   test("PW-031: Uploading an unsupported file type (PDF) does not show the Download button", async ({
  227 |     page,
  228 |   }) => {
  229 |     await page.locator('input[type="file"]').setInputFiles(SAMPLE_PDF);
  230 | 
  231 |     const downloadBtn = page.getByRole("button", { name: /download/i });
  232 |     const isVisible = await downloadBtn.isVisible();
  233 |     console.log("Download button visible for PDF upload:", isVisible);
  234 | 
  235 |     await expect(downloadBtn).not.toBeVisible();
  236 |   });
  237 | });
  238 | 
```