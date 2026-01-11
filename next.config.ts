/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000', // Porta da API do MinIO
        pathname: '/**',
      },
      // Se for produção (AWS S3), adicione aqui também:
      // {
      //   protocol: 'https',
      //   hostname: 'seu-bucket.s3.us-east-1.amazonaws.com',
      // }
    ],
  },
};

export default nextConfig;