export default function sitemap() {
  const baseUrl = 'https://shubh-deep-labs.vercel.app';
  
  const serviceRoutes = [
    '/services/website-development',
    '/services/software-development',
    '/services/custom-software-development',
    '/services/mobile-app-development',
    '/services/ai-development',
    '/services/ecommerce-development',
    '/services/ui-ux-design',
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

  const allRoutes = [...publicRoutes, ...serviceRoutes];

  return allRoutes.map((route) => {
    const isHome = route === '';
    const isService = route.startsWith('/services/');
    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: isHome ? 'daily' : isService ? 'weekly' : 'monthly',
      priority: isHome ? 1.0 : isService ? 0.9 : 0.7,
    };
  });
}
