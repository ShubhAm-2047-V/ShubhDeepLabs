export default function sitemap() {
  const baseUrl = 'https://shubh-deep-labs.vercel.app';
  
  const ecosystemRoutes = [
    '/services',
    '/services/website-development',
    '/services/software-development',
    '/services/custom-software-development',
    '/services/mobile-app-development',
    '/services/ai-development',
    '/services/ecommerce-development',
    '/services/ui-ux-design',
    '/products',
    '/products/expense-tracker',
    '/products/hospital-desk',
    '/products/face-attendance',
    '/products/notes-summarizer',
    '/products/chatbot',
    '/portfolio',
    '/case-studies',
    '/pricing',
    '/about',
    '/contact',
    '/blog',
    '/chat',
    '/dashboard',
    '/api-docs',
  ];

  const publicRoutes = [
    '',
    '/order',
    '/offers',
    '/chatbot',
    '/notes-summarizer',
    '/hospital-desk',
    '/face-attendance',
    '/expense-tracker',
  ];

  const allRoutes = Array.from(new Set([...publicRoutes, ...ecosystemRoutes]));

  return allRoutes.map((route) => {
    const isHome = route === '';
    const isPrimaryHub = route === '/services' || route === '/products' || route.startsWith('/services/') || route.startsWith('/products/');
    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: isHome ? 'daily' : isPrimaryHub ? 'weekly' : 'monthly',
      priority: isHome ? 1.0 : isPrimaryHub ? 0.9 : 0.8,
    };
  });
}
