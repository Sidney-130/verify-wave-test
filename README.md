# TrustScan

TrustScan is a web app that checks whether a video or image is real or AI-generated (a deepfake). You upload a file, the app analyses it, and gives you a score showing how likely it is to be fake, along with a breakdown of what was found.

## Features

1. Upload videos or images (MP4, MOV, JPG, PNG) by dragging them in or browsing your files
2. See a live progress bar while the file is being scanned
3. Get a result with a confidence score and a breakdown of the findings
4. A dashboard showing how many files you've scanned and how many were fake
5. A history page where you can review past scans
6. A profile page and settings

## Tools Used

| Tool                         | What it does                                                       |
| ---------------------------- | ------------------------------------------------------------------ |
| **React 19** with TypeScript | Builds the user interface                                          |
| **Vite**                     | Runs and builds the app fast during development                    |
| **React Router v7**          | Handles switching between pages                                    |
| **Zustand**                  | Stores and manages data across the app                             |
| **TanStack Query**           | Handles the scan request and tracks whether it's loading or failed |
| **Tailwind CSS v4**          | Handles all the styling                                            |

## Folder Structure

```
src/
├── App.tsx                  # Sets up the pages and their URLs
├── main.tsx                 # Starting point of the app
├── components/
│   ├── Layout.tsx           # The outer frame shared by all pages (sidebar + top bar)
│   ├── Navbar.tsx           # Top navigation bar
│   ├── Sidebar.tsx          # Side navigation menu
│   ├── UploadZone.tsx       # Where the user drops or selects a file to scan
│   ├── FilePreview.tsx      # Shows a preview of the uploaded file
│   ├── ResultModal.tsx      # Pop-up showing the scan result
│   ├── pages/
│   │   ├── Dashboard.tsx    # Home page — upload a file and see recent scans
│   │   ├── Results.tsx      # Full result page for a specific scan
│   │   ├── History.tsx      # List of all past scans with search and filter
│   │   ├── Settings.tsx     # App settings
│   │   └── Profile.tsx      # Your profile and scan stats
│   └── ui/
│       └── button.tsx       # A reusable button used across the app
├── store/
│   ├── dashboardStore.ts    # Keeps track of recent scans and summary numbers
│   ├── scanStore.ts         # Keeps the full list of all scans
│   ├── settingsStore.ts     # Saves your app settings
│   ├── uiStore.ts           # Tracks small UI things like notification count
│   └── userStore.ts         # Saves your profile info
├── lib/
│   ├── mockApi.ts           # Pretends to be a real scan server (for development)
│   ├── fileUtils.ts         # Checks the file is valid and creates a thumbnail
│   └── utils.ts             # Small helper functions used across the app
└── types/
    └── index.ts             # Describes the shape of data used throughout the app
```

## Pages and URLs

Every page shares the same sidebar and top bar. The content in the middle changes depending on the URL.

| URL         | Page      | What it does                                       |
| ----------- | --------- | -------------------------------------------------- |
| `/`         | Dashboard | The home page — upload a file and see recent scans |
| `/results`  | Results   | Shows the full result for one specific scan        |
| `/history`  | History   | Lists all past scans, can be filtered and searched |
| `/settings` | Settings  | Change your app preferences                        |
| `/profile`  | Profile   | View your profile and scan statistics              |

## How Data is Stored

The app uses five separate "stores" to hold data. Think of each store as a dedicated place for one type of information. Most of them save their data to the browser so it's still there when you refresh.

| Store            | What it holds                                         | Saved after refresh? |
| ---------------- | ----------------------------------------------------- | -------------------- |
| `dashboardStore` | Recent scans and the summary numbers on the dashboard | Yes                  |
| `scanStore`      | The full list of every scan ever done                 | Yes                  |
| `settingsStore`  | Your app settings                                     | Yes                  |
| `userStore`      | Your profile info                                     | Yes                  |
| `uiStore`        | Small temporary things like notification count        | No                   |

## What Happens When You Scan a File

1. You drop or select a file in the upload area
2. The app sends the file to the scan function and shows a loading state
3. While it's scanning, a placeholder entry appears on the dashboard immediately
4. When the scan finishes, the placeholder is updated with the real result and saved to history
5. A pop-up appears showing you the full result

## Why We Made Certain Choices

**Why Zustand and not Redux?**
Redux requires a lot of setup code for what is ultimately a small app. Zustand does the same job with far less code and is easier to follow. It also has a built-in way to save data to the browser, which we use for history and settings.

**Why TanStack Query only for the scan?**
All the data in this app lives in the stores, there's nothing being loaded from a server right now. TanStack Query is used just for the scan action because it cleanly tracks whether the scan is in progress, done, or failed, without us having to write that tracking code ourselves.

**Why is the scan result faked?**
The app doesn't have a real AI backend yet. The file in `lib/mockApi.ts` pretends to be one, it waits 2–3 seconds and returns a result based on the file's content. This keeps the app fully usable and testable while the real backend is being built.

**Why Vite and not Next.js?**
This app only runs in the browser, there's no server-side rendering or backend logic needed. Vite is lighter and faster for this kind of app.
