# Alta Gracia Missions — Complete Setup & Azure Deployment Guide

## Overview
This guide covers three things:
1. Claiming your $2,000 Microsoft Azure Nonprofit Grant
2. Setting up Claude Code to develop the website locally
3. Deploying to Azure Static Web Apps (free tier for nonprofits)

---

## PART 1: Claim Your $2,000 Azure Nonprofit Grant

### Step 1 — Verify your Microsoft Nonprofit account
1. Go to: https://nonprofit.microsoft.com
2. Sign in with the Microsoft account linked to your nonprofit
3. Confirm your organization is approved (status: "Active")

### Step 2 — Activate the Azure grant
1. From the nonprofit portal, click **"Azure"** in the product list
2. Click **"Activate $2,000 Azure credit"**
3. You'll be redirected to create a new Azure Subscription
4. Choose subscription name: `Alta Gracia Missions - Nonprofit`
5. The $2,000 credit will appear within 24–48 hours

### Step 3 — Set up your Azure Portal
1. Go to: https://portal.azure.com
2. Sign in with your Microsoft account
3. Click **"Subscriptions"** → verify your nonprofit subscription appears
4. Click **"Cost Management"** to monitor your grant spending

### Monthly cost estimate for your website:
| Service                  | Monthly Cost |
|--------------------------|-------------|
| Azure Static Web Apps    | FREE ($0)   |
| Azure DNS Zone           | ~$0.50      |
| Azure CDN (if needed)    | ~$2–5       |
| **Total**                | **~$3–6/month** |

Your $2,000 grant = **27+ years** of website hosting at this rate! ✓

---

## PART 2: Set Up Claude Code

### Step 1 — Install Claude Code
Open your terminal (Mac/Linux) or PowerShell (Windows) and run:

```bash
npm install -g @anthropic-ai/claude-code
```

Requirements: Node.js 18 or higher. Check with: `node --version`
If you don't have Node.js: https://nodejs.org/en/download

### Step 2 — Authenticate Claude Code
```bash
claude
```
On first run, it will open a browser to authenticate with your Anthropic account.

### Step 3 — Open your project folder
```bash
cd path/to/alta-gracia
claude .
```
This opens Claude Code in your project directory.

### Step 4 — Example Claude Code commands to develop the site

Inside Claude Code, you can type natural language commands:

```
"Add a photo gallery section showing mission trip photos"
"Make the hero section use a real background image from /images/hero.jpg"
"Add a newsletter signup form that connects to Mailchimp"
"Create a prayer request form that sends email notifications"
"Make the donate button link to PayPal for nonprofits"
"Add a Spanish language toggle for the site"
"Optimize all images for faster loading"
```

### Step 5 — Preview locally
```bash
# Install a simple local server
npm install -g live-server

# Run from your project folder
live-server alta-gracia
```
Open http://localhost:8080 to see your site.

---

## PART 3: Deploy to Azure Static Web Apps

### Step 1 — Install Azure CLI
```bash
# Mac
brew install azure-cli

# Windows (PowerShell as Admin)
winget install -e --id Microsoft.AzureCLI

# Linux
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### Step 2 — Login to Azure
```bash
az login
```
A browser window will open — sign in with your Microsoft nonprofit account.

### Step 3 — Create a Resource Group
```bash
az group create \
  --name alta-gracia-rg \
  --location eastus
```

### Step 4 — Create Azure Static Web App
```bash
az staticwebapp create \
  --name alta-gracia-missions \
  --resource-group alta-gracia-rg \
  --location eastus2 \
  --sku Free
```

### Step 5 — Deploy your website files
```bash
# Install Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Deploy from your project folder
cd alta-gracia
swa deploy . \
  --app-name alta-gracia-missions \
  --resource-group alta-gracia-rg
```

### Step 6 — Connect your custom domain (altagraciamissions.org)
1. In Azure Portal → **Static Web Apps** → `alta-gracia-missions`
2. Click **"Custom domains"** → **"Add"**
3. Enter: `altagraciamissions.org`
4. Azure will give you a CNAME or TXT record
5. Log in to your domain registrar (GoDaddy, Namecheap, etc.)
6. Add the DNS record Azure provides
7. Wait 10–30 minutes for DNS to propagate
8. Azure automatically provisions a FREE SSL certificate

### Step 7 — Set up GitHub for automatic deployments (recommended)
```bash
# Initialize git in your project
cd alta-gracia
git init
git add .
git commit -m "Initial Alta Gracia Missions website"

# Create a GitHub repo at github.com/new
# Then push:
git remote add origin https://github.com/YOUR-USERNAME/alta-gracia.git
git push -u origin main
```

Then in Azure Portal → Static Web App → **"GitHub Actions"** to link your repo.
Every time you push to GitHub, your site auto-deploys! ✓

---

## PART 4: Recommended Next Steps

### Add contact form functionality
Use **Azure Communication Services** (covered by your grant):
```bash
az communication create \
  --name alta-gracia-comms \
  --resource-group alta-gracia-rg \
  --data-location UnitedStates
```

### Add a donation payment system
- **PayPal Giving Fund** — free for nonprofits, no transaction fees
  https://www.paypal.com/givingfund
- **Stripe** — 0.7% discounted rate for verified nonprofits
  https://stripe.com/nonprofits

### Track site visitors (free)
Azure Application Insights — add this to your HTML `<head>`:
```html
<script>
// Add your Application Insights connection string from Azure Portal
</script>
```

---

## Your File Structure

```
alta-gracia/
├── index.html          ← Main website
├── css/
│   └── style.css       ← All styles
├── js/
│   └── main.js         ← Interactions
├── images/             ← Add your photos here
│   ├── hero.jpg
│   ├── mission-1.jpg
│   └── ...
└── staticwebapp.config.json  ← Azure routing config
```

### Create staticwebapp.config.json
```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

---

## Support Resources

| Resource | URL |
|---|---|
| Azure Nonprofit Portal | https://nonprofit.microsoft.com |
| Azure Portal | https://portal.azure.com |
| Azure Static Web Apps Docs | https://docs.microsoft.com/azure/static-web-apps |
| Claude Code Docs | https://docs.claude.ai/claude-code |
| Azure CLI Docs | https://docs.microsoft.com/cli/azure |

---

*Guide prepared for Alta Gracia Missions — altagraciamissions.org*
*Hosted on Microsoft Azure · Nonprofit Technology Grant*
