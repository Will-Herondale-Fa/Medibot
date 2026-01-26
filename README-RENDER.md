# Deploying to Render

This guide explains how to deploy the Medibot application to Render.

## Prerequisites

- GitHub account with this repository pushed
- Render account (https://render.com)

## Deployment Steps

### 1. Connect Repository to Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Select the repository containing this project

### 2. Configure the Service

The `render.yaml` file contains the default configuration. You can also configure directly in the Render dashboard:

**Build Settings:**
- Build Command: `npm run build`
- Start Command: `npm start`

**Environment Variables:**

Add the following environment variables in the Render dashboard:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=<your_database_url>
API_URL=<your_api_url>
JWT_SECRET=<your_jwt_secret>
JITSI_DOMAIN=meet.jit.si
```

### 3. Deploy

1. Click "Create Web Service"
2. Render will automatically deploy when you push to your main branch
3. Monitor deployment progress in the Render dashboard

## Important Notes

- **Free Plan Limits**: Free tier services spin down after 15 minutes of inactivity
- **Build Time**: First deployment may take 5-10 minutes
- **Node Version**: Uses Node 18+ by default
- **Port**: Application listens on port 3000 (mapped to 80/443 by Render)

## Automatic Deployments

Once connected, Render will automatically redeploy when you:
- Push to the main branch
- Update environment variables
- Manually trigger a redeploy

## Troubleshooting

**Build Failures:**
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

**Runtime Errors:**
- Check application logs in Render dashboard
- Verify all required environment variables are set
- Ensure database connections work from Render's infrastructure

**Performance:**
- Use caching strategies for static content
- Optimize database queries
- Consider upgrading to paid plan for better performance

For more help, visit [Render Documentation](https://render.com/docs)
