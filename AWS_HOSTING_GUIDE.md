# ☁️ AWS Cloud Hosting Guide for E-Waste Collection Tracker

This project is now structured as a **Unified Single-Server Application**. 
Running `npm start` serves **both** the React frontend and the Express backend on the same port, completely eliminating CORS errors, separate domain issues, and complex multi-server setups.

---

## 🚀 Recommended Method 1: AWS App Runner (Easiest & Fastest — 5 Minutes)

**AWS App Runner** is a fully managed service that automatically builds, deploys, and scales containerized or Node.js web applications directly from GitHub, providing a free HTTPS domain with zero server setup.

### Step-by-Step Instructions:
1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for AWS deployment"
   git branch -M main
   git remote add origin https://github.com/<your-username>/e-waste-tracker.git
   git push -u origin main
   ```

2. **Open AWS Console:**
   * Go to **[AWS Management Console](https://console.aws.amazon.com/)** and search for **App Runner**.
   * Click **Create an App Runner service**.

3. **Configure Source Code Repository:**
   * Under **Repository type**, choose **Source code repository**.
   * Connect your GitHub account and select the `e-waste-tracker` repository.
   * Select branch: `main`.
   * Deployment trigger: choose **Automatic** (deploys whenever you push changes).

4. **Configure Build Settings:**
   * Runtime: choose **Nodejs 18** or **Nodejs 20**.
   * **Build command:**
     ```bash
     npm install && npm run build
     ```
   * **Start command:**
     ```bash
     npm start
     ```
   * **Port:** `5000`

5. **Deploy:**
   * Click **Next**, review settings, and click **Create & Deploy**.
   * Within 2–3 minutes, AWS will provision your app and provide a live public HTTPS URL (e.g., `https://xxxxxx.us-east-1.awsapprunner.com`).

---

## 🏢 Recommended Method 2: AWS Elastic Beanstalk (Standard Academic PaaS)

If your faculty specifically asks for **AWS Elastic Beanstalk (PaaS)**, follow these steps:

### Step 1: Create a Deployment ZIP File
Create a `.zip` archive of the project folder containing:
* `server/`
* `src/`
* `public/`
* `index.html`
* `package.json`
* `package-lock.json`
* `vite.config.js`
*(⚠️ **Do NOT include `node_modules`** — AWS will automatically install dependencies during deployment).*

In PowerShell, you can create the zip with one command:
```powershell
Compress-Archive -Path server, src, public, index.html, package.json, package-lock.json, vite.config.js -DestinationPath ewaste-tracker-aws.zip -Force
```

### Step 2: Deploy to Elastic Beanstalk
1. In the **AWS Management Console**, search for **Elastic Beanstalk**.
2. Click **Create application**.
3. **Application name:** `ewaste-collection-tracker`
4. **Platform:** Select **Node.js** (Node.js 18 or 20 on Linux).
5. **Application code:** Select **Upload your code** and upload `ewaste-tracker-aws.zip`.
6. Click **Create app**.
7. AWS will automatically run `npm install`, build the application, start it on port 5000, and give you an active environment URL (e.g., `http://ewaste-tracker.eba-xxxx.us-east-1.elasticbeanstalk.com`).

---

## 🖥️ Method 3: AWS EC2 / Lightsail (Classic Virtual Server)

If you want to demonstrate an **IaaS (Infrastructure as a Service)** Linux server:

1. **Launch an EC2 Instance:**
   * Choose **Ubuntu Server 24.04 LTS** (t2.micro / t3.micro — Free Tier eligible).
   * In Security Group, add inbound rules for:
     * **HTTP (Port 80)**
     * **Custom TCP (Port 5000)**
     * **SSH (Port 22)**

2. **SSH into your server and run:**
   ```bash
   # Update system & install Node.js
   sudo apt update -y
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs git

   # Clone your repository
   git clone https://github.com/<your-username>/e-waste-tracker.git
   cd e-waste-tracker

   # Install & Build
   npm install
   npm run build

   # Install PM2 process manager to keep server running 24/7
   sudo npm install -g pm2
   pm2 start server/server.js --name "ewaste-tracker"
   pm2 startup
   pm2 save
   ```

3. **Access Your Application:**
   * Open your browser and navigate to: `http://<YOUR-EC2-PUBLIC-IP>:5000`

---

## 🧪 Verifying the Deployment
Once hosted on any AWS option, test the following:
1. **Frontend UI:** Open the URL — the full Citizen Portal should load with photos, forms, and tracking.
2. **REST API Health Check:** Open `/api/health` — it should return:
   ```json
   {
     "status": "online",
     "system": "E-Waste Collection Tracker - Node.js Express Backend",
     "recordsCount": 3
   }
   ```
3. **Admin Panel:** Sign in with `admin@ewaste.gov` / `admin123` to test live status updates on AWS.
