export default function sitemap() {
  const baseUrl = 'https://shubh-deep-labs.vercel.app';
  
  const routes = [
    '',
    '/web-dev',
    '/order',
    '/offers',
    '/notes-summarizer',
    '/mtech',
    '/iot',
    '/hospital-desk',
    '/face-attendance',
    '/expense-tracker',
    '/engineering',
    '/diploma',
    '/chatbot',
    '/bca-mca',
    '/android',
    '/ai-ml'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
