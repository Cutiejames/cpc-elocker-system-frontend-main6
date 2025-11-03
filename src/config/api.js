// API Configuration
// Set VUE_APP_API_URL in .env file or use default localhost
// For LAN: Create .env.development.local with: VUE_APP_API_URL=http://YOUR_LAN_IP:3001
// Example: VUE_APP_API_URL=http://192.168.0.23:3001

export const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001'

