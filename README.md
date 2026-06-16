# PixelsSuite Image Tools Automation

This is an automated testing suite for the PixelsSuite web application (https://www.pixelssuite.com/). The project is built using **Playwright** and **TypeScript** to verify the core functionalities of the Image Compression, GIF Compression, and PNG Compression tools.

## Project Structure

```text
pixelsuite-testing/
├── playwright.config.ts      # Playwright runner and browser settings
├── package.json              # NPM dependencies and script entry points
├── tsconfig.json             # TypeScript compiler rules and Node types configuration
├── README.md                 # Project instructions and documentation
├── test-data/                # Sample files used for uploads during tests
│   ├── image (6).jpg         # Sample JPG file
│   ├── image (15).png        # Sample PNG file
│   ├── image.webp            # Sample WebP file
│   ├── compressed (4).gif    # Sample GIF file
│   └── sample.pdf            # Sample unsupported PDF file
└── tests/                    # Automation specifications
    ├── compress-image.spec.ts # Tests for the general Image Compressor
    ├── gif-compressor.spec.ts # Tests for the GIF Compressor tool
    └── png-compressor.spec.ts # Tests for the PNG Compressor tool
```

## Prerequisites

Ensure you have **Node.js** (v18 or higher) installed on your system.

## Setup and Installation

1. Navigate to the project directory:
   
   cd pixelsuite-testing
  

2. Install the required NPM packages:
 
   npm install
 

3. Install the Playwright browser binaries:
 
   npx playwright install
 

## Running the Tests

You can execute the automated test suites using the following commands:

* **Run all tests (Headless mode)**
  
  npx playwright test
  

* **Run tests in Playwright Interactive UI Mode**
  ```bash
  npx playwright test --ui
  ```

* **Run by Test Name**
  
  npx playwright test -g "PW-020"
 


* **Run a Specific File**
 
  npx playwright test tests/gif-compressor.spec.ts
 

* **Run tests in headed mode (visible browsers)**
  
  npx playwright test --headed


## Reports and Artifacts

* **HTML Report**: After tests complete, an HTML report is generated automatically in the `playwright-report/` folder. To view it, run:

  npx playwright show-report

* **Screenshots**: Screenshots are taken automatically after each test execution. They are named according to the Test Case ID (e.g., `PW-001.png`) and saved as flat files in the following directory:
  `test-results/screenshots/`
  
* **Downloads**: During testing, files compressed and downloaded by Playwright are temporarily saved to `test-results/downloads/` for size validation assertions.
