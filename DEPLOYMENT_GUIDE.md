# 🚀 Production Deployment Guide

This guide walks you through deploying Habucho School Management System to production.

---

## 📋 Pre-Deployment Checklist

Before deploying, verify:

- ✅ All tests pass
- ✅ No console errors in browser
- ✅ JWT_SECRET is strong and random
- ✅ Database backups exist
- ✅ Environment variables are configured
- ✅ All API endpoints are tested
- ✅ Database has production data
- ✅ CORS is configured for production domain

---

## 🔐 Security Configuration

### 1. Update `.env` for Production

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database (Use strong credentials)
DATABASE_URL=postgresql://prod_user:very_strong_password@prod-db-host:5432/habucho_school

# JWT Secret (Generate a strong random string)
JWT_SECRET=your_very_long_random_secret_key_at_least_32_characters_long

# CORS (Only allow your domain)
CORS_ORIGIN=https://yourdomain.com
```

### 2. Generate Strong JWT Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Create Database User for Production

```sql
-- Don't use 'postgres' user in production!
CREATE USER habucho_user WITH PASSWORD 'very_strong_password';
CREATE DATABASE habucho_school OWNER habucho_user;
GRANT ALL PRIVILEGES ON DATABASE habucho_school TO habucho_user;

-- Connect as new user
\c habucho_school habucho_user
-- Run migrations
```

---

## 📦 Backend Deployment (Node.js Server)

### Option 1: Deploy to Heroku

#### 1. Install Heroku CLI
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
heroku --version
```

#### 2. Login to Heroku
```bash
heroku login
```

#### 3. Create Heroku App
```bash
cd server
heroku create habucho-school-api
```

#### 4. Add PostgreSQL Add-on
```bash
heroku addons:create heroku-postgresql:hobby-dev -a habucho-school-api
```

#### 5. Set Environment Variables
```bash
heroku config:set NODE_ENV=production -a habucho-school-api
heroku config:set JWT_SECRET=your_super_secret_key -a habucho-school-api
```

#### 6. Deploy
```bash
git push heroku main
```

#### 7. Run Migrations on Heroku
```bash
heroku run npm run migrate -a habucho-school-api
heroku run npm run seed -a habucho-school-api
```

#### 8. Verify
```bash
heroku logs --tail -a habucho-school-api
```

Backend is now at: `https://habucho-school-api.herokuapp.com/api`

---

### Option 2: Deploy to DigitalOcean or AWS

#### 1. Create Server
- Create Ubuntu 22.04 droplet
- SSH into server
- Install Node.js, PostgreSQL

#### 2. Set Up Application
```bash
# Clone repository
git clone <your-repo> /home/ubuntu/habucho-school
cd /home/ubuntu/habucho-school/server

# Install dependencies
npm install --production

# Set environment variables
nano .env
# Add production config
```

#### 3. Set Up PM2 (Process Manager)
```bash
npm install -g pm2

# Start application
pm2 start server.js --name "habucho-api"

# Auto-restart on reboot
pm2 startup
pm2 save
```

#### 4. Set Up Nginx (Reverse Proxy)
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/habucho
```

Add:
```nginx
server {
    listen 80;
    server_name api.habucho.edu;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/habucho /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Enable SSL (HTTPS)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.habucho.edu
```

---

## 🌐 Frontend Deployment (React App)

### Option 1: Deploy to Vercel

#### 1. Build React App
```bash
cd client
npm run build
```

This creates a `dist/` folder ready for deployment.

#### 2. Install Vercel CLI
```bash
npm i -g vercel
```

#### 3. Deploy
```bash
vercel
```

#### 4. Configure Environment
In Vercel dashboard:
- Go to Settings → Environment Variables
- Add: `VITE_API_URL=https://api.habucho.edu/api`

Frontend is now at: `https://habucho-school.vercel.app`

---

### Option 2: Deploy to Netlify

#### 1. Build React App
```bash
cd client
npm run build
```

#### 2. Connect GitHub Repository
- Go to https://netlify.com
- Click "Connect GitHub"
- Select your repository

#### 3. Configure Build
```
Build command: npm run build
Publish directory: dist
```

#### 4. Add Environment Variables
In Netlify dashboard:
- Settings → Build & Deploy → Environment
- Add: `VITE_API_URL=https://api.habucho.edu/api`

#### 5. Deploy
Netlify auto-deploys on push!

---

### Option 3: Deploy to AWS S3 + CloudFront

#### 1. Build App
```bash
cd client
npm run build
```

#### 2. Create S3 Bucket
```bash
# Via AWS CLI
aws s3 mb s3://habucho-school-app --region us-east-1
```

#### 3. Upload Build Files
```bash
aws s3 sync dist/ s3://habucho-school-app/ --delete
```

#### 4. Enable Static Website Hosting
```bash
aws s3 website s3://habucho-school-app/ \
  --index-document index.html \
  --error-document index.html
```

#### 5. Set Up CloudFront CDN
- Go to AWS CloudFront
- Create distribution
- Point to S3 bucket
- Add custom domain (CNAME)
- Enable HTTPS

---

## 🔄 Continuous Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      
      - name: Build Frontend
        run: |
          cd client
          npm install
          npm run build
      
      - name: Deploy Frontend
        run: |
          # Deploy to your hosting
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
      
      - name: Test Backend
        run: |
          cd ../server
          npm install
          npm test
      
      - name: Deploy Backend
        run: |
          # Deploy to your hosting
          git push heroku main
```

---

## 📊 Monitoring & Logging

### Application Monitoring

```bash
# On server
pm2 monit           # Monitor CPU/Memory
pm2 logs            # View logs
pm2 logs --err      # View error logs
```

### Database Monitoring

```sql
-- Check active connections
SELECT datname, usename, COUNT(*) 
FROM pg_stat_activity 
GROUP BY datname, usename;

-- Find slow queries
SELECT query, calls, mean_exec_time 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC LIMIT 10;
```

### Set Up Logging Service

Consider services like:
- **Sentry** — Error tracking
- **Loggly** — Log aggregation
- **DataDog** — Performance monitoring
- **New Relic** — APM

---

## 🔄 Database Backups

### Automated Backup (Production)

```bash
# Daily backup script (cron job)
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DB_NAME="habucho_school"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

pg_dump -U habucho_user $DB_NAME > $BACKUP_DIR/habucho_$TIMESTAMP.sql

# Keep only last 30 days
find $BACKUP_DIR -name "habucho_*.sql" -mtime +30 -delete
```

Add to crontab:
```bash
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup.sh
```

### Manual Backup

```bash
# Backup database
pg_dump -U postgres habucho_school > habucho_backup.sql

# Restore from backup
psql -U postgres habucho_school < habucho_backup.sql
```

---

## 🔍 Performance Optimization

### Frontend Optimization

```bash
# Analyze bundle size
cd client
npm install -g @vitejs/plugin-visualizer

# Build and analyze
npm run build
npm run preview
```

### Backend Optimization

1. **Enable database indexes:**
```sql
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_grade_student ON grades(student_id);
CREATE INDEX idx_announcement_created ON announcements(created_at);
```

2. **Enable caching:**
```javascript
// app.js
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});
```

3. **Enable gzip compression:**
```bash
npm install compression
// In app.js
import compression from 'compression';
app.use(compression());
```

---

## 📝 Domain & SSL Setup

### 1. Buy Domain
- GoDaddy, Namecheap, or similar

### 2. Point to Hosting

**For Vercel:**
- Add A record: `76.76.19.33`
- Add CNAME: `cname.vercel-dns.com`

**For Heroku:**
- Add CNAME: `<app>.herokuapp.com`

**For DigitalOcean:**
- Add A record: Your server IP

### 3. Enable SSL/TLS

```bash
# Using Let's Encrypt (free)
sudo certbot certonly --standalone -d yourdomain.com
```

### 4. Configure Email

Set up email notifications for alerts:
- Send Welcome email on registration
- Send password reset links
- Send grade update notifications

---

## ✅ Post-Deployment

### Test All Features

- [ ] Login works
- [ ] Create user
- [ ] Create announcement
- [ ] Create schedule
- [ ] Create grade
- [ ] Export PDF
- [ ] Offline mode works
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] PWA installable

### Monitor Logs

```bash
# Check for errors
tail -f /var/log/nginx/error.log

# Check API health
curl https://api.yourdomain.com/api/health
```

### Set Up Alerts

- Email on application error
- SMS on database failure
- Uptime monitoring (UptimeRobot, Pingdom)

---

## 🔧 Troubleshooting Production

### Issue: "Cannot connect to database"
- Check DATABASE_URL is correct
- Verify database user has permissions
- Check firewall rules

### Issue: "CORS errors"
- Update CORS_ORIGIN in .env
- Verify frontend and backend domains

### Issue: "Static files return 404"
- Check build files exist in `dist/`
- Verify upload to CDN/S3
- Clear CDN cache

### Issue: "Application crashes after deploy"
- Check logs: `pm2 logs`
- Verify environment variables
- Run migrations: `npm run migrate`

---

## 📞 Support

For deployment issues:
1. Check logs
2. Verify environment variables
3. Test API endpoints manually
4. Check database connection
5. Restart services

---

**Ready to go live! 🚀**
