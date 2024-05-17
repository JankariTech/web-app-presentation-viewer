const config = {
  // environment
  baseOcisUrl: process.env.OCIS_URL || 'https://localhost:9200',
  assets: './tests/e2e/filesForUpload',
  adminUser: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin',
  // playwright
  slowMo: parseInt(process.env.SLOW_MO) || 0,
  timeout: parseInt(process.env.TIMEOUT) || 60,
  minTimeout: parseInt(process.env.MIN_TIMEOUT) || 5,
  headless: process.env.HEADLESS === 'true'
}

module.exports = config
