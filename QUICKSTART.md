# 3D Veggie Garden - Quick Start

## 30-Second Setup

1. **Edit `main.js`** (lines 12-14):
   ```javascript
   owner: 'your-github-username',
   repo: 'veggie-garden',
   token: 'your_github_token_here'
   ```

2. **Set GitHub Secrets** (for email):
   - Go to: Settings > Secrets > Actions
   - Add: `SMTP_SERVER`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `EMAIL_FROM`, `EMAIL_TO`

3. **Deploy**:
   - Netlify: Connect repo, click Deploy
   - Vercel: Import project, click Deploy
   - GitHub Pages: Settings > Pages > Enable

Done! 🎉

## Free Vegetable Models (CC0)

1. **Poly Pizza**: https://poly.pizza/search/vegetable
2. **Quaternius**: https://quaternius.com/packs/ultimatefood.html
3. **Kenney**: https://kenney.nl/assets/food-kit
4. **Kay Lousberg**: https://sketchfab.com/kaylousberg (search: vegetables)
5. **OpenGameArt**: https://opengameart.org/art-search?keys=vegetable

Download GLB files, place in `/models/` folder.

## Controls

- **W** - Move forward
- **A** - Move left
- **S** - Move backward
- **D** - Move right

Walk into vegetables to collect them!

## GitHub Token Setup

1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scope: `repo`
4. Copy token
5. Paste in `main.js`

## Gmail SMTP Setup

1. Enable 2-Step Verification
2. Create App Password: https://myaccount.google.com/apppasswords
3. Add to GitHub Secrets:
   - `SMTP_SERVER`: `smtp.gmail.com`
   - `SMTP_PORT`: `587`
   - `SMTP_USERNAME`: `your-email@gmail.com`
   - `SMTP_PASSWORD`: `your-app-password`
   - `EMAIL_FROM`: `your-email@gmail.com`
   - `EMAIL_TO`: `recipient@example.com`

## File Structure

```
veggie-garden/
├── index.html          ← Main page
├── main.js             ← Game code (EDIT THIS)
├── styles.css          ← Styling
├── models/             ← Add .glb files here
├── data/               ← Shopping lists saved here
└── .github/workflows/  ← Email automation
```

## Testing Locally

```bash
python3 -m http.server 8000
```

Visit: http://localhost:8000

## Troubleshooting

| Problem | Solution |
|---------|----------|
| GitHub commit fails | Check token has `repo` scope |
| Email not received | Verify all GitHub Secrets |
| Models not loading | Use placeholders or check file names |
| Page won't load | Check browser console (F12) |

## Full Documentation

- [README.md](README.md) - Complete documentation
- [SETUP.md](SETUP.md) - Detailed setup guide
- [DEPLOY.md](DEPLOY.md) - Deployment checklist

---

**Need help?** Check the full README.md or open an issue on GitHub.

**Working?** Share your deployed URL! 🌱🥕🍅
