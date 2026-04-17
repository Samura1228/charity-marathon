# 🏃 Limassol Charity Run — Setup Guide

This guide walks you through connecting the registration form on the website to Google Sheets, and setting up the admin dashboard to securely view registrations.

**Time required:** ~15 minutes  
**Difficulty:** Easy (no coding experience needed)

---

## Table of Contents

1. [Create the Google Sheet](#part-1-create-the-google-sheet)
2. [Create the Google Apps Script](#part-2-create-the-google-apps-script)
3. [Connect the Website](#part-3-connect-the-website)
4. [Connect the Admin Dashboard](#part-4-connect-the-admin-dashboard)
5. [Test Everything](#part-5-test-everything)
6. [Change the Admin Password](#part-6-change-the-admin-password)
7. [Troubleshooting](#troubleshooting)

---

## Part 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and sign in with your Google account.

2. Click the **"+"** button (or **"Blank spreadsheet"**) to create a new spreadsheet.

3. Click on **"Untitled spreadsheet"** at the top-left and rename it to:
   ```
   Limassol Charity Run - Registrations
   ```

4. In **Row 1**, add the following column headers **exactly as written** — each one in its own cell, going horizontally across the row:

   | A1 | B1 | C1 | D1 | E1 | F1 | G1 | H1 | I1 | J1 |
   |---|---|---|---|---|---|---|---|---|---|
   | `firstName` | `lastName` | `email` | `phone` | `distance` | `tshirtSize` | `emergencyName` | `emergencyPhone` | `registrationDate` | `language` |

   > ⚠️ **Important:** The headers are case-sensitive. Type them exactly as shown — one per cell, all in Row 1. Row 2 and below should be empty.

5. Your spreadsheet should now look like this:

   ```
   A: firstName | B: lastName | C: email | D: phone | E: distance | F: tshirtSize | G: emergencyName | H: emergencyPhone | I: registrationDate | J: language
   ```

6. **Keep this tab open** — you'll need it for the next steps.

---

## Part 2: Create the Google Apps Script

This script does two things:
- **Receives** registration data from the website and saves it to your Google Sheet
- **Serves** registration data securely to the admin dashboard (protected by a secret key)

### Steps:

1. In your Google Sheet, click on **Extensions** (Расширения) → **Apps Script** in the top menu bar.

   > A new tab will open with the Google Apps Script editor.

2. **Delete** any existing code in the editor (select all with `Ctrl+A` / `Cmd+A`, then delete).

3. **Copy and paste** the following code into the editor:

   ```javascript
   /**
    * Limassol Charity Run — Registration Handler & Data API
    * 
    * This script:
    * 1. Receives form submissions (POST) and saves them to the spreadsheet
    * 2. Serves registration data (GET) to the admin dashboard (protected by secret key)
    */

   // ⚠️ CHANGE THIS to a random secret string of your choice!
   // Must match the API_SECRET_KEY in admin.js
   var API_SECRET_KEY = 'lcr-admin-secret-2026';

   /**
    * Handle POST requests — save new registrations
    */
   function doPost(e) {
     try {
       var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
       var data = JSON.parse(e.postData.contents);

       sheet.appendRow([
         data.firstName,
         data.lastName,
         data.email,
         data.phone,
         data.distance,
         data.tshirtSize,
         data.emergencyName,
         data.emergencyPhone,
         data.registrationDate,
         data.language
       ]);

       return ContentService
         .createTextOutput(JSON.stringify({ status: 'success' }))
         .setMimeType(ContentService.MimeType.JSON);
     } catch (error) {
       return ContentService
         .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
         .setMimeType(ContentService.MimeType.JSON);
     }
   }

   /**
    * Handle GET requests — return data for admin dashboard + fallback registration
    */
   function doGet(e) {
     var params = e.parameter;

     // If no action specified, return status
     if (!params.action) {
       return ContentService
         .createTextOutput(JSON.stringify({ status: 'active', message: 'Limassol Charity Run endpoint is active.' }))
         .setMimeType(ContentService.MimeType.JSON);
     }

     // Handle register action via GET (fallback for environments where POST fails)
     if (params.action === 'register') {
       try {
         var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
         sheet.appendRow([
           params.firstName || '',
           params.lastName || '',
           params.email || '',
           params.phone || '',
           params.distance || '',
           params.tshirtSize || '',
           params.emergencyName || '',
           params.emergencyPhone || '',
           params.registrationDate || '',
           params.language || ''
         ]);

         return ContentService
           .createTextOutput(JSON.stringify({ status: 'success' }))
           .setMimeType(ContentService.MimeType.JSON);
       } catch (error) {
         return ContentService
           .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
           .setMimeType(ContentService.MimeType.JSON);
       }
     }

     // Handle getData action — return all registrations
     if (params.action === 'getData') {
       // Verify secret key
       if (params.key !== API_SECRET_KEY) {
         return ContentService
           .createTextOutput(JSON.stringify({ status: 'unauthorized', message: 'Invalid secret key.' }))
           .setMimeType(ContentService.MimeType.JSON);
       }

       try {
         var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
         var data = sheet.getDataRange().getValues();

         if (data.length < 2) {
           return ContentService
             .createTextOutput(JSON.stringify({ status: 'success', data: [] }))
             .setMimeType(ContentService.MimeType.JSON);
         }

         var headers = data[0];
         var result = [];

         for (var i = 1; i < data.length; i++) {
           var row = {};
           for (var j = 0; j < headers.length; j++) {
             row[headers[j]] = data[i][j];
           }
           // Only include rows that have at least a first name or email
           if (row.firstName || row.email) {
             result.push(row);
           }
         }

         return ContentService
           .createTextOutput(JSON.stringify({ status: 'success', data: result }))
           .setMimeType(ContentService.MimeType.JSON);
       } catch (error) {
         return ContentService
           .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
           .setMimeType(ContentService.MimeType.JSON);
       }
     }

     return ContentService
       .createTextOutput(JSON.stringify({ status: 'error', message: 'Unknown action.' }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

4. Click the **floppy disk icon** (💾) or press `Ctrl+S` / `Cmd+S` to **save** the script.

5. When prompted, name the project:
   ```
   Limassol Charity Run Registration
   ```

6. Click **"Deploy"** → **"New deployment"** (blue button at the top-right).

7. In the deployment dialog:
   - Click the **gear icon** ⚙️ next to "Select type" and choose **"Web app"**
   - Fill in the settings:
     - **Description:** `Limassol Charity Run Registration`
     - **Execute as:** `Me` (your email)
     - **Who has access:** `Anyone`

8. Click **"Deploy"**.

9. Google will ask you to **authorize** the app:
   - Click **"Authorize access"**
   - Choose your Google account
   - If you see "Google hasn't verified this app", click **"Advanced"** → **"Go to Limassol Charity Run Registration (unsafe)"**
   - Click **"Allow"**

10. After deployment, you'll see a **Web App URL**. It looks something like:
    ```
    https://script.google.com/macros/s/AKfycbx.../exec
    ```

11. **Copy this URL** — you'll need it in the next steps.

    > 💡 **Tip:** Click the "Copy" button next to the URL to copy it to your clipboard.

---

## Part 3: Connect the Website

The registration form sends data through a **Netlify serverless function** (`netlify/functions/register.js`), which then forwards it to your Google Apps Script via POST. This avoids CORS issues on all browsers and devices.

1. Open the file `netlify/functions/register.js` in a text editor (e.g., VS Code, Notepad, TextEdit).

2. Find this line near the top of the file (around line 8):
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
   ```

3. Replace `YOUR_GOOGLE_SCRIPT_URL_HERE` with the Web App URL you copied in the previous step. For example:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
   ```

   > ⚠️ **Important:** Keep the single quotes around the URL. Only replace the text between the quotes.

4. **Save** the file.

   > 💡 **Note:** The website must be deployed on Netlify for the serverless function to work. If testing locally, you can use `npx netlify-cli dev` to run the Netlify dev server.

---

## Part 4: Connect the Admin Dashboard

The admin dashboard reads data securely from your Google Sheet through the same Apps Script URL, protected by a secret key.

> ✅ **No need to "Publish to web"!** Your data stays private. Only requests with the correct secret key can read the data.

1. Open the file `admin.js` in a text editor.

2. Find this line near the top (around line 17):
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
   ```

3. Replace `YOUR_GOOGLE_SCRIPT_URL_HERE` with the **same** Web App URL you used in Part 3. For example:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
   ```

4. **(Optional but recommended)** Change the secret key for extra security. Find this line (around line 21):
   ```javascript
   const API_SECRET_KEY = 'lcr-admin-secret-2026';
   ```

   Change it to any random string you like, for example:
   ```javascript
   const API_SECRET_KEY = 'my-custom-secret-key-12345';
   ```

   > ⚠️ **Important:** If you change the secret key in `admin.js`, you **must also change it** in the Google Apps Script code (the `API_SECRET_KEY` variable at the top). After changing it in Apps Script, you need to **redeploy**:
   > - Go to Apps Script → **Deploy** → **Manage deployments** → click the ✏️ pencil icon → set version to **"New version"** → **Deploy**

5. **Save** the file.

---

## Part 5: Test Everything

### Test the Registration Form

1. Open `index.html` in a web browser (double-click the file, or drag it into your browser).

2. Scroll down to the **registration form**.

3. Fill out all the fields with test data and click **"Register"**.

4. You should see a **success message** on the website.

5. Go to your **Google Sheet** — the test registration should appear as a new row! 🎉

   > ⚠️ **Note:** It may take a few seconds for the data to appear. Refresh the Google Sheet page if needed.

### Test the Admin Dashboard

1. Open `admin.html` in a web browser.

2. Enter the password: `admin2026`

3. Click **"Login"**.

4. You should see the **dashboard** with your test registration data.

5. Try the features:
   - **Search** for a name or email
   - **Filter** by distance or t-shirt size
   - **Sort** by clicking column headers
   - **Export CSV** to download the data
   - **Refresh Data** to reload from Google Sheets

---

## Part 6: Change the Admin Password

The default password is `admin2026`. To change it:

1. Open `admin.js` in a text editor.

2. Find this line near the top (around line 13):
   ```javascript
   const ADMIN_PASSWORD = 'admin2026';
   ```

3. Replace `admin2026` with your desired password. For example:
   ```javascript
   const ADMIN_PASSWORD = 'mySecurePassword123';
   ```

4. **Save** the file.

> ⚠️ **Note:** This is a basic client-side password protection. It's not meant for high-security applications. It simply prevents casual access to the dashboard. For production use with sensitive data, consider implementing server-side authentication.

---

## Troubleshooting

### ❌ "Form submission failed" error on the website

**Possible causes:**
- The Google Apps Script URL in `script.js` is incorrect or still set to the placeholder
- The Google Apps Script hasn't been deployed correctly

**Solutions:**
1. Double-check that the URL in `script.js` matches the one from your Apps Script deployment
2. Make sure you deployed as a **Web app** with access set to **"Anyone"**
3. Try redeploying: In Apps Script, go to **Deploy** → **Manage deployments** → click the pencil icon → set version to **"New version"** → **Deploy**

---

### ❌ Admin dashboard shows "Demo Mode" even after setting up the Google Sheet

**Possible causes:**
- The Google Apps Script URL in `admin.js` is incorrect or still set to the placeholder
- The secret key in `admin.js` doesn't match the one in the Apps Script

**Solutions:**
1. Verify the URL in `admin.js` is the same Web App URL from your deployment
2. Make sure `API_SECRET_KEY` in `admin.js` matches `API_SECRET_KEY` in the Apps Script code
3. If you changed the secret key in Apps Script, make sure you **redeployed** (Deploy → Manage deployments → pencil icon → New version → Deploy)

---

### ❌ Admin dashboard shows no data (but Google Sheet has data)

**Possible causes:**
- The column headers in the Google Sheet don't match exactly
- The secret key doesn't match
- Browser cache issue

**Solutions:**
1. Check that Row 1 headers match exactly: `firstName`, `lastName`, `email`, `phone`, `distance`, `tshirtSize`, `emergencyName`, `emergencyPhone`, `registrationDate`, `language`
2. Check the browser console (F12 → Console tab) for error messages
3. Try a hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

---

### ❌ "Google hasn't verified this app" warning during authorization

This is normal for personal Apps Scripts. It appears because the script hasn't gone through Google's verification process.

**Solution:**
1. Click **"Advanced"** at the bottom-left of the warning
2. Click **"Go to Limassol Charity Run Registration (unsafe)"**
3. Click **"Allow"**

This is safe because you wrote the script yourself and it only accesses your own spreadsheet.

---

### ❌ Data appears in Google Sheet but with wrong columns

**Possible cause:** The column headers in Row 1 don't match the expected field names.

**Solution:** Make sure the headers are exactly (one per cell, all in Row 1):
```
firstName | lastName | email | phone | distance | tshirtSize | emergencyName | emergencyPhone | registrationDate | language
```

---

### ❌ CSV export has garbled characters (non-English text)

The CSV export includes a UTF-8 BOM (Byte Order Mark) for compatibility. If you still see garbled characters:

**Solution:**
1. Open the CSV file in Google Sheets instead of Excel
2. Or in Excel: **Data** → **From Text/CSV** → select the file → choose **UTF-8** encoding

---

### ❌ After changing Apps Script code, changes don't take effect

**Cause:** You need to create a new deployment version after code changes.

**Solution:**
1. In Apps Script, go to **Deploy** → **Manage deployments**
2. Click the ✏️ **pencil icon** on your deployment
3. Under "Version", select **"New version"**
4. Click **Deploy**

---

## 📁 File Overview

| File | Purpose |
|------|---------|
| `index.html` | Main website with registration form |
| `styles.css` | Main website styles |
| `script.js` | Main website JavaScript (countdown, language toggle, form submission) |
| `admin.html` | Admin dashboard page |
| `admin.css` | Admin dashboard styles |
| `admin.js` | Admin dashboard JavaScript (reads data securely from Google Sheets) |
| `netlify.toml` | Netlify deployment configuration |
| `netlify/functions/register.js` | Serverless function that forwards registrations to Google Sheets |
| `_headers` | Netlify cache-control headers |
| `SETUP_GUIDE.md` | This setup guide |

---

## 🔒 Security Notes

- **Registration data is private:** The admin dashboard reads data through your Google Apps Script, protected by a secret key. No need to publish your Google Sheet publicly.
- **The admin password** is stored in plain text in `admin.js`. This provides basic access control but is not secure against determined users who inspect the source code.
- **The secret key** (`API_SECRET_KEY`) adds a layer of protection — only requests with the correct key can read data. However, it's also visible in the source code.
- **The Google Apps Script URL** accepts POST requests from anyone (required for the registration form to work), but GET requests for data require the secret key.
- For a production environment with sensitive data, consider:
  - Hosting the site on a web server with proper server-side authentication
  - Using environment variables for sensitive configuration
  - Implementing proper authentication (e.g., Firebase Auth, Auth0)

---

## 🎉 You're All Set!

Your Limassol Charity Run website is now fully connected:

1. ✅ Visitors register through the website → data goes to Google Sheets
2. ✅ Admin dashboard securely reads from Google Sheets → you can view and manage registrations
3. ✅ Export participant lists as CSV for printing or further processing
4. ✅ Your Google Sheet data is NOT publicly accessible

If you need help, check the [Troubleshooting](#troubleshooting) section above.

**Good luck with the charity run! 🏃‍♂️🏃‍♀️**