# Netlify Setup Guide

## How It Works

The button now works differently depending on where the app is running:

- **On Netlify**: Uses a secure serverless function with environment variables (safe!)
- **Locally**: Uses the token from `main.js` config (for development only)

## Setup Steps for Netlify

### 1. Push Code to GitHub

```bash
git add -A
git commit -m "Add Netlify serverless function for secure GitHub commits"
git push
```

### 2. Configure Netlify Environment Variables

1. Go to your Netlify site dashboard
2. Click **Site configuration** → **Environment variables**
3. Add these 3 environment variables:

| Variable Name | Value | Example |
|---------------|-------|---------|
| `GITHUB_TOKEN` | Your GitHub Personal Access Token | `ghp_xxxxxxxxxxxxxxxxxxxx` |
| `GITHUB_OWNER` | Your GitHub username | `dhyan6` |
| `GITHUB_REPO` | Your repository name | `veggie-garden` |

### 3. Redeploy Your Site

After adding the environment variables:
- Go to **Deploys** tab
- Click **Trigger deploy** → **Deploy site**

### 4. Test It!

1. Open your Netlify site
2. Play the game and collect some vegetables
3. Click "Send to WhatsApp"
4. Check your WhatsApp for the message!

---

## For Local Development

To test locally with the token:

1. **Add your token** to `main.js` line 11:
   ```javascript
   token: 'YOUR_GITHUB_TOKEN_HERE'
   ```

2. **Run local server**:
   ```bash
   cd "/Users/dhyanadlerbelendez/Desktop/T564A/Week 2/veggie-garden"
   python3 -m http.server 8080
   ```

3. **Open** http://localhost:8080

4. **IMPORTANT**: Don't commit the token to GitHub! The code is already set up to use empty string by default.

---

## Security Benefits

✅ **Token is never exposed** in the client-side code on Netlify
✅ **Environment variables** are encrypted and secure
✅ **Serverless function** runs server-side, not in the browser
✅ **GitHub won't block** the deployment because the token is in environment variables

---

## Troubleshooting

**Button doesn't work on Netlify?**
- Check that you added all 3 environment variables
- Check that you redeployed after adding them
- Check Netlify function logs: Site configuration → Functions → Logs

**Works locally but not on Netlify?**
- Make sure the code was pushed to GitHub
- Make sure Netlify redeployed with the latest code
- Check that environment variables are set correctly
