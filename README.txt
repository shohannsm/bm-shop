BM Shop
- index.html  = the shop website
- api/ and lib/ = the payment server (SSLCommerz)
Secret keys are NOT in these files. They go into Vercel settings:
  SSL_STORE_ID, SSL_STORE_PASSWORD, and (only when going live) SSL_SANDBOX=false
