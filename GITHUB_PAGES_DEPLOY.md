# Deploy Birthday Card to GitHub Pages

## 🚀 Quick GitHub Pages Deployment

### Prerequisites
1. Your code must be pushed to a GitHub repository
2. GitHub Pages must be enabled for your repository

### Step 1: Enable GitHub Pages
1. Go to your GitHub repository
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. Click **Save**

### Step 2: Trigger Deployment
The deployment will automatically start when you push changes to the `main` branch, or you can manually trigger it:

1. Go to **Actions** tab in your GitHub repository
2. Click **Deploy to GitHub Pages** workflow
3. Click **Run workflow** button
4. Select the `main` branch and click **Run workflow**

### Step 3: Access Your Birthday Card
Once deployment is complete (usually 2-3 minutes), your birthday card will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/
```

The birthday card specifically will be at:
```
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/birthday-card
```

### What's Included
- ✅ Full birthday card with confetti, fireworks, and animations
- ✅ Mobile-optimized responsive design
- ✅ Sound effects and interactive elements
- ✅ Optimized for fast loading on GitHub Pages

### Troubleshooting

**Build fails with database errors:**
The birthday card is designed to work as a standalone static page without database dependencies. If you see database-related errors, they won't affect the birthday card functionality.

**Assets not loading:**
Make sure all birthday card assets in `public/birthday-card/` are committed to your repository.

**404 errors:**
Ensure GitHub Pages is set to deploy from GitHub Actions (not from a branch).

### Development
To test locally before deploying:
```bash
npm run dev
```
Then visit `http://localhost:3000/birthday-card`

---

## Need Help?
If you encounter issues, check the **Actions** tab in your GitHub repository for detailed error logs from the deployment workflow.
