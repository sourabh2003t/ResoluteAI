export default {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false, // Set to false if this is temporary
      },
    ];
  },
};
