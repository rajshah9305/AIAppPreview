# Deploying RAJAI to Vercel

## Prerequisites

Before deploying, ensure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your project to GitHub
3. **Database**: Set up a PostgreSQL database (recommended: [Neon](https://neon.tech))

## Environment Variables

Set these environment variables in your Vercel dashboard:

### Required for Database
- `DATABASE_URL`: Your PostgreSQL connection string
- `PGHOST`: Database host
- `PGDATABASE`: Database name
- `PGUSER`: Database username
- `PGPASSWORD`: Database password
- `PGPORT`: Database port (usually 5432)

### Optional for Enhanced Features
- `NODE_ENV`: Set to "production"

## Deployment Steps

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the framework

3. **Configure Environment Variables**:
   - In the Vercel dashboard, go to your project
   - Navigate to Settings → Environment Variables
   - Add all required environment variables listed above

4. **Deploy**:
   - Vercel will automatically build and deploy
   - Your app will be available at `https://your-project-name.vercel.app`

### Method 2: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add DATABASE_URL
   vercel env add PGHOST
   vercel env add PGDATABASE
   vercel env add PGUSER
   vercel env add PGPASSWORD
   vercel env add PGPORT
   ```

## Database Setup

### Using Neon (Recommended)

1. **Create Neon Account**: Go to [neon.tech](https://neon.tech)
2. **Create Database**: Follow the setup wizard
3. **Get Connection String**: Copy the connection URL
4. **Set Environment Variables**: Add the DATABASE_URL to Vercel

### Using Other PostgreSQL Providers

RAJAI works with any PostgreSQL database. Popular options:
- **Supabase**: [supabase.com](https://supabase.com)
- **Railway**: [railway.app](https://railway.app)
- **PlanetScale**: [planetscale.com](https://planetscale.com)
- **Heroku Postgres**: [heroku.com](https://heroku.com)

## Post-Deployment

1. **Run Database Migrations**:
   - The app will automatically create tables on first run
   - Or manually run: `npm run db:push` from your local environment

2. **Test the Application**:
   - Visit your deployed URL
   - Test code generation with a Cerebras API key
   - Verify all features work correctly

3. **Custom Domain** (Optional):
   - In Vercel dashboard, go to Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

## Build Configuration

The project includes these optimized build settings:

- **Frontend**: Built with Vite for optimal performance
- **Backend**: Bundled with esbuild for fast serverless functions
- **Static Assets**: Served directly by Vercel's CDN
- **TypeScript**: Full type checking during build

## Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check Node.js version (use Node 18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection Errors**:
   - Verify DATABASE_URL is correct
   - Ensure database allows external connections
   - Check firewall settings

3. **Environment Variables Not Working**:
   - Redeploy after adding environment variables
   - Verify variable names match exactly
   - Check for typos in values

### Performance Optimization

- **Cold Starts**: Vercel functions may have cold starts
- **Database Connections**: Use connection pooling
- **Static Assets**: Automatically optimized by Vercel
- **Caching**: Configure appropriate cache headers

## Security Considerations

- **API Keys**: Store securely in environment variables
- **Database**: Use SSL connections
- **CORS**: Configured for your domain
- **Content Security Policy**: Enabled for generated code

## Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Function Logs**: Available in Vercel dashboard
- **Error Tracking**: Monitor function errors
- **Usage Metrics**: Track bandwidth and function invocations

Your RAJAI platform is now ready for production use on Vercel!