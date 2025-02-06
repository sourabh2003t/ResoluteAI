export default {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true, // Set to false if this is temporary
      },
    ];
  },
};
