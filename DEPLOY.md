# Deployment Checklist

Use this checklist to ensure everything is configured before deploying.

## Pre-Deployment Checklist

### 1. Code Configuration

- [ ] Update `main.js` with your GitHub username
- [ ] Update `main.js` with your repository name
- [ ] Update `main.js` with your GitHub personal access token
- [ ] Update `package.json` repository URL (optional)

### 2. GitHub Repository

- [ ] Repository is created on GitHub
- [ ] Code is pushed to `main` branch
- [ ] Repository is public (or private with proper access)

### 3. GitHub Secrets (for Email)

Go to: `https://github.com/YOUR_USERNAME/veggie-garden/settings/secrets/actions`

Only 3 secrets needed:

- [ ] `GMAIL_USERNAME` - Your Gmail address
- [ ] `GMAIL_APP_PASSWORD` - Your 16-character Gmail app password
- [ ] `EMAIL_TO` - Recipient email address

### 4. Models (Optional)

- [ ] Downloaded vegetable models (or plan to use placeholders)
- [ ] Models placed in `/models/` folder
- [ ] Models renamed correctly (carrot.glb, tomato.glb, etc.)
- [ ] Models committed to repository

### 5. Testing Locally

- [ ] Tested locally with `python3 -m http.server 8000`
- [ ] Character movement works (WASD)
- [ ] Vegetables can be collected
- [ ] Shopping list UI updates correctly
- [ ] No console errors

## Deployment Steps

### Option 1: Netlify

1. Go to https://app.netlify.com
2. Sign in with GitHub
3. Click "Add new site" > "Import an existing project"
4. Choose GitHub provider
5. Select `veggie-garden` repository
6. Build settings: Leave default (no build command needed)
7. Click "Deploy site"
8. Wait 1-2 minutes
9. Site is live!

**Post-deployment:**
- [ ] Visit the Netlify URL
- [ ] Test the game
- [ ] Collect vegetables
- [ ] Click "Save & Email"
- [ ] Check email received
- [ ] Verify GitHub Actions ran successfully

### Option 2: Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." > "Project"
4. Import `veggie-garden` repository
5. Click "Deploy"
6. Wait 1-2 minutes
7. Site is live!

**Post-deployment:**
- [ ] Visit the Vercel URL
- [ ] Test the game
- [ ] Collect vegetables
- [ ] Click "Save & Email"
- [ ] Check email received
- [ ] Verify GitHub Actions ran successfully

### Option 3: GitHub Pages

1. Go to repository settings: `https://github.com/YOUR_USERNAME/veggie-garden/settings/pages`
2. Under "Build and deployment":
   - Source: "Deploy from a branch"
   - Branch: `main`
   - Folder: `/ (root)`
3. Click "Save"
4. Wait 2-3 minutes
5. Site is live at: `https://YOUR_USERNAME.github.io/veggie-garden/`

**Post-deployment:**
- [ ] Visit the GitHub Pages URL
- [ ] Test the game
- [ ] Collect vegetables
- [ ] Click "Save & Email"
- [ ] Check email received
- [ ] Verify GitHub Actions ran successfully

## Post-Deployment Verification

### Test the Full Flow

1. **Load the game:**
   - [ ] Page loads without errors
   - [ ] 3D scene appears
   - [ ] Character is visible
   - [ ] Vegetables are visible (or placeholders)

2. **Test controls:**
   - [ ] W key moves forward
   - [ ] A key moves left
   - [ ] S key moves backward
   - [ ] D key moves right
   - [ ] Camera follows character

3. **Test collection:**
   - [ ] Walk into a vegetable
   - [ ] Vegetable disappears
   - [ ] Vegetable appears in shopping list UI
   - [ ] Animation plays

4. **Test save & email:**
   - [ ] Collect at least one vegetable
   - [ ] Click "Save & Email My Veggie List"
   - [ ] Status message shows "Saving..."
   - [ ] Status message shows "Success"
   - [ ] No error messages

5. **Verify GitHub:**
   - [ ] Go to `https://github.com/YOUR_USERNAME/veggie-garden`
   - [ ] Navigate to `/data/shopping-list.json`
   - [ ] File exists and contains correct data
   - [ ] Go to "Actions" tab
   - [ ] See "Email Shopping List" workflow
   - [ ] Workflow shows green checkmark
   - [ ] No errors in workflow logs

6. **Verify Email:**
   - [ ] Check email inbox
   - [ ] Email received (check spam if not in inbox)
   - [ ] Email contains shopping list
   - [ ] Shopping list data is correct

## Troubleshooting

### Deployment Failed

**Netlify/Vercel:**
- Check build logs for errors
- Ensure all files are committed
- Try redeploying

**GitHub Pages:**
- Wait a few minutes (can be slow)
- Check Actions tab for build errors
- Ensure Pages is enabled in settings

### Game Not Working After Deploy

**Check browser console (F12):**
- Look for red errors
- Common issues:
  - CORS errors (usually not an issue with Three.js CDN)
  - 404 errors for models (OK if using placeholders)
  - GitHub API errors (check token)

### Save & Email Not Working

**GitHub commit fails:**
- Verify token in `main.js`
- Check token has `repo` scope
- Ensure username and repo are correct
- Check token is not expired

**Email not received:**
- Check GitHub Actions logs
- Verify all secrets are set
- Check spam folder
- Verify SMTP credentials
- Test with a different email address

### Models Not Loading

**This is expected if you haven't added models!**
- Game uses colorful placeholders
- To add models, see SETUP.md

**If you added models but they don't show:**
- Check file names match exactly
- Check files are in `/models/` folder
- Check browser console for 404 errors
- Try with smaller model files

## Security Reminders

- [ ] **Never commit GitHub token to public repositories**
- [ ] Consider using environment variables for production
- [ ] Use app-specific passwords for email (never regular passwords)
- [ ] Set token expiration dates
- [ ] Rotate tokens regularly

## Share Your Game!

Once everything is working:

- [ ] Copy your deployment URL
- [ ] Share with friends and family
- [ ] Post on social media
- [ ] Add to your portfolio

**Your URLs:**
- Netlify: `https://______________.netlify.app`
- Vercel: `https://______________.vercel.app`
- GitHub Pages: `https://______________.github.io/veggie-garden/`

---

## Need Help?

- See [README.md](README.md) for detailed documentation
- See [SETUP.md](SETUP.md) for setup instructions
- Check browser console for errors
- Check GitHub Actions logs for email issues
- Verify all secrets are configured correctly

Good luck! 🚀🌱
