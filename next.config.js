/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    // Aumentar el tiempo de espera a 2 minutos
    apiResponseTimeout: 120000
  }
}

module.exports = nextConfig 