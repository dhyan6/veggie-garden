# Quick Setup Guide

Follow these steps to get your 3D Veggie Garden up and running!

## Step 1: Download Vegetable Models (Optional)

The app works with colorful placeholders, but 3D models make it more fun!

### Recommended Download Links:

1. **Poly Pizza (Easiest - CC0)**
   - Visit: https://poly.pizza/
   - Search for each vegetable: "carrot", "tomato", "broccoli", "onion", "eggplant", "pepper", "cucumber"
   - Download as GLB format
   - Rename files to match: `carrot.glb`, `tomato.glb`, etc.

2. **Quaternius Food Pack (Best Quality - CC0)**
   - Visit: https://quaternius.com/packs/ultimatefood.html
   - Download the entire pack
   - Extract and find vegetable models
   - Copy to `/models` folder

3. **Kenney Food Kit (Good Alternative - CC0)**
   - Visit: https://kenney.nl/assets/food-kit
   - Download the pack
   - Extract vegetables
   - Convert to GLB if needed (use Blender or online converters)

### Quick Model Conversion

If you have `.fbx` or `.obj` files:
- Use online converter: https://products.aspose.app/3d/conversion/fbx-to-glb
- Or use Blender: Import > Export as GLB

## Step 2: Configure GitHub Token

### Create Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" > "Generate new token (classic)"
3. Name: `veggie-garden-app`
4. Expiration: Choose your preference (90 days recommended for testing)
5. Select scopes:
   - ✓ `repo` (Full control of private repositories)
6. Click "Generate token"
7. **COPY THE TOKEN NOW** (you won't see it again!)

### Add Token to Your Code:

Edit `main.js` around line 12:

```javascript
const CONFIG = {
    github: {
        owner: 'YOUR_GITHUB_USERNAME',     // e.g., 'johndoe'
        repo: 'veggie-garden',              // your repository name
        token: 'ghp_xxxxxxxxxxxxxxxxxxxx'   // paste your token here
    },
    // ...
}
```

**Warning:** Don't commit your token to a public repository! For production:
- Use environment variables
- Use GitHub OAuth
- Use a GitHub App

## Step 3: Setup Email (GitHub Secrets)

This project uses **Gmail with App Password** for sending emails.

1. **Enable 2-Step Verification:**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Create App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other" → type "Veggie Garden"
   - Click "Generate"
   - Copy the 16-character password (looks like: `abcd efgh ijkl mnop`)

3. **Add GitHub Secrets:**
   - Go to your repo: `https://github.com/YOUR_USERNAME/veggie-garden/settings/secrets/actions`
   - Click "New repository secret" and add these **3 secrets**:

   | Secret Name | Value |
   |-------------|-------|
   | `GMAIL_USERNAME` | `your-email@gmail.com` |
   | `GMAIL_APP_PASSWORD` | `abcd efgh ijkl mnop` (your 16-char app password) |
   | `EMAIL_TO` | `recipient@example.com` (where to send the list) |

**That's it!** Just 3 secrets. The workflow is pre-configured for Gmail.

## Step 4: Deploy Your Site

### Option A: Netlify (Recommended)

1. **Create Netlify Account:**
   - Go to: https://app.netlify.com/signup
   - Sign up with GitHub

2. **Deploy:**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Select `veggie-garden` repository
   - Build settings: Leave blank
   - Click "Deploy site"

3. **Done!**
   - Your site will be live at: `https://random-name-12345.netlify.app`
   - You can customize the domain name in site settings

### Option B: Vercel

1. **Create Vercel Account:**
   - Go to: https://vercel.com/signup
   - Sign up with GitHub

2. **Deploy:**
   - Click "Add New..." → "Project"
   - Import `veggie-garden` repository
   - Click "Deploy"

3. **Done!**
   - Your site will be live at: `https://veggie-garden.vercel.app`

### Option C: GitHub Pages

1. **Enable GitHub Pages:**
   - Go to: `https://github.com/YOUR_USERNAME/veggie-garden/settings/pages`
   - Source: "Deploy from a branch"
   - Branch: `main` / folder: `/ (root)`
   - Click "Save"

2. **Wait 1-2 minutes**

3. **Done!**
   - Your site will be live at: `https://YOUR_USERNAME.github.io/veggie-garden/`

## Step 5: Test Everything

1. **Visit your deployed URL**
2. **Use WASD to move** your character
3. **Collect vegetables** by walking into them
4. **Click "Save & Email My Veggie List"**
5. **Check your email** (might take 30-60 seconds)

### Verify GitHub Actions:

1. Go to: `https://github.com/YOUR_USERNAME/veggie-garden/actions`
2. You should see a workflow run called "Email Shopping List"
3. Click on it to see the logs
4. Green checkmark = success!

## Troubleshooting

### "Failed to commit to GitHub" Error

**Check:**
- Is your GitHub token correct?
- Does your token have `repo` scope?
- Is your username and repo name correct in `main.js`?
- Is your token expired?

**Fix:**
- Generate a new token with correct permissions
- Update `main.js` with new token

### Email Not Received

**Check:**
1. GitHub Actions tab - did the workflow run?
2. Click on the workflow run - any errors in logs?
3. Check spam folder
4. Verify all secrets are set correctly

**Common Issues:**
- **Gmail blocking:** Make sure you used App Password, not regular password
- **Wrong SMTP settings:** Double-check server and port
- **Secrets typo:** Secret names must match exactly (case-sensitive)

### Models Not Showing

**This is OK!** The app uses colorful placeholder spheres if models aren't found.

**To fix:**
- Check file names match exactly: `carrot.glb`, `tomato.glb`, etc.
- Models must be in `/models/` folder
- Check browser console for loading errors
- Try different model sources

### Page Won't Load

**Check:**
- Browser console for errors (F12)
- Make sure you're using a modern browser (Chrome, Firefox, Safari, Edge)
- Try incognito/private mode
- Clear browser cache

## Next Steps

### Share Your Game!

Send your deployed URL to friends:
- Netlify: `https://your-app.netlify.app`
- Vercel: `https://your-app.vercel.app`
- GitHub Pages: `https://username.github.io/veggie-garden/`

### Customize It!

- Change vegetable positions in `main.js`
- Add more vegetables
- Modify colors in `styles.css`
- Adjust character speed
- Change the garden size

### Make It Your Own!

- Replace vegetable theme with fruits, flowers, or anything else!
- Add sound effects
- Create multiple levels
- Add a timer or score system
- Change the character model

---

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review browser console for error messages
- Check GitHub Actions logs for email issues
- Make sure all secrets are set correctly

Happy gardening! 🌱🥕🍅
