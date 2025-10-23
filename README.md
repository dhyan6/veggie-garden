# 3D Veggie Garden

An interactive 3D vegetable garden game built with Three.js where you control a character to collect vegetables and save your shopping list via GitHub Actions email automation.

## Features

- **3D Interactive Environment**: Beautiful garden scene with lighting and shadows
- **Character Control**: Move around with WASD keys
- **Vegetable Collection**: Collect vegetables with collision detection
- **Shopping List UI**: Real-time display of collected vegetables
- **GitHub Integration**: Save list directly to your repository
- **Email Automation**: Automatic email sending via GitHub Actions
- **No Backend Required**: Fully frontend-based using GitHub as the backend

## Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/YOUR_USERNAME/veggie-garden.git
cd veggie-garden
```

### 2. Add Vegetable Models (Optional)

Download free CC0 vegetable models and place them in the `/models` directory:

**Recommended Free CC0 Vegetable Model Sources:**

1. **Poly Pizza** (CC0 models)
   - https://poly.pizza/search/vegetable
   - Search for: carrot, tomato, broccoli, onion, eggplant, pepper, cucumber

2. **Quaternius** (CC0 Ultimate Food Pack)
   - https://quaternius.com/packs/ultimatefood.html
   - Includes many vegetable models

3. **Kay Lousberg on Sketchfab**
   - https://sketchfab.com/kaylousberg
   - Search for "vegetables" - many CC0 low-poly food models

4. **Kenney.nl Assets**
   - https://kenney.nl/assets/food-kit
   - CC0 food models including vegetables

5. **OpenGameArt.org**
   - https://opengameart.org/art-search?keys=vegetable

**Note:** The app works perfectly with colorful placeholder spheres if you don't add models!

### 3. Configure GitHub Integration

Edit `main.js` and update the configuration:

```javascript
const CONFIG = {
    github: {
        owner: 'YOUR_GITHUB_USERNAME',
        repo: 'veggie-garden',
        token: 'YOUR_GITHUB_TOKEN'
    },
    // ...
};
```

**Creating a GitHub Personal Access Token:**

1. Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Veggie Garden App"
4. Select scopes: `repo` (full control of private repositories)
5. Generate and copy the token
6. Paste it in `main.js` (or use environment variables for production)

**Security Note:** For production, consider using GitHub's OAuth flow or environment variables instead of hardcoding tokens.

### 4. Setup Email Automation

Configure GitHub Secrets for Gmail email functionality:

1. **Enable 2-Step Verification** in your Google Account
   - Go to [https://myaccount.google.com/security](https://myaccount.google.com/security)
   - Enable "2-Step Verification"

2. **Create a Gmail App Password**
   - Go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select app: "Mail"
   - Select device: "Other" → type "Veggie Garden"
   - Click "Generate"
   - Copy the 16-character password

3. **Add GitHub Secrets**
   - Go to your repository: Settings > Secrets and variables > Actions
   - Click "New repository secret" and add these 3 secrets:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `GMAIL_USERNAME` | Your Gmail address | `your-email@gmail.com` |
| `GMAIL_APP_PASSWORD` | The 16-char app password | `abcd efgh ijkl mnop` |
| `EMAIL_TO` | Where to send the shopping list | `recipient@example.com` |

That's it! Just 3 secrets needed.

## Deployment

### Deploy to Netlify

1. **Via Netlify UI:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect to GitHub and select your repository
   - Build settings: Leave empty (static site)
   - Click "Deploy site"

2. **Via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

### Deploy to Vercel

1. **Via Vercel UI:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" > "Project"
   - Import your GitHub repository
   - Click "Deploy"

2. **Via Vercel CLI:**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

### Deploy to GitHub Pages

1. Go to repository Settings > Pages
2. Source: Deploy from a branch
3. Branch: `main` / `root`
4. Save

Your site will be available at: `https://YOUR_USERNAME.github.io/veggie-garden/`

## How It Works

### Game Flow

1. **Scene Loads**: Three.js initializes the 3D garden with vegetables
2. **Player Controls**: Use WASD to move your character around
3. **Collection**: Walk near vegetables to collect them
4. **Shopping List**: Collected items appear in the UI
5. **Save & Email**: Click the button to save and email your list

### GitHub Integration Flow

```
User clicks "Save & Email"
    ↓
Frontend calls GitHub REST API
    ↓
Commits shopping-list.json to /data/
    ↓
GitHub detects commit to data/shopping-list.json
    ↓
Triggers GitHub Action workflow
    ↓
Action reads the JSON file
    ↓
Sends email via SMTP
    ↓
User receives shopping list email
```

## Project Structure

```
veggie-garden/
├── index.html              # Main HTML file
├── main.js                 # Three.js game logic & GitHub integration
├── styles.css              # UI styling
├── netlify.toml            # Netlify configuration
├── vercel.json             # Vercel configuration
├── .github/
│   └── workflows/
│       └── email.yml       # GitHub Actions workflow
├── models/                 # 3D vegetable models (.glb files)
│   ├── carrot.glb
│   ├── tomato.glb
│   └── ...
└── data/
    └── shopping-list.json  # Generated shopping list (created on save)
```

## Customization

### Adding More Vegetables

Edit the `CONFIG.vegetables` array in `main.js`:

```javascript
vegetables: [
    { name: 'Carrot', file: 'carrot.glb', position: { x: -3, z: 2 } },
    { name: 'Your Veggie', file: 'veggie.glb', position: { x: 5, z: 5 } }
]
```

### Changing Character Speed

```javascript
character: {
    speed: 0.1,  // Increase for faster movement
    size: 0.5,
    collectionRadius: 1.5  // Increase for easier collection
}
```

### Styling the UI

Edit `styles.css` to customize colors, fonts, and layout.

## Troubleshooting

### Models Not Loading

- Check that model files are in `/models` directory
- Verify file names match the configuration
- Models must be `.glb` or `.gltf` format
- App works with placeholder spheres if models are missing

### GitHub Commit Failing

- Verify your GitHub token has `repo` scope
- Check that owner and repo names are correct
- Ensure token is not expired

### Email Not Sending

- Verify all GitHub Secrets are set correctly
- Check GitHub Actions tab for error logs
- Test SMTP credentials separately
- Ensure 2FA and app passwords are configured (for Gmail)

### CORS Errors

- GitHub API should work from any domain
- If issues persist, check browser console for details

## Development

To test locally:

```bash
# Simple HTTP server
python3 -m http.server 8000

# Or use Node.js
npx http-server

# Or use VS Code Live Server extension
```

Visit `http://localhost:8000`

## Technologies Used

- **Three.js** - 3D graphics library
- **GLTFLoader** - 3D model loading
- **GitHub REST API** - File commits
- **GitHub Actions** - Email automation
- **Vanilla JavaScript** - No frameworks needed

## License

This project is open source and available under the MIT License.

## Credits

- Three.js library by Three.js authors
- Vegetable models from various CC0 sources (see links above)
- Email automation via GitHub Actions

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review GitHub Actions logs
3. Open an issue on GitHub

---

Built with Three.js | No backend required | Powered by GitHub Actions
