
import { Language, Service, ServiceType, BlogPost, Branch, FAQ, WebDemo, Testimonial } from './types';

// Helper to get base translations
const baseEn = {
  brandName: "ZabahSoft",
  home: "Home",
  services: "Solutions",
  dashboard: "Dashboard",
  blog: "Blog",
  contactNav: "Contact",
  login: "Sign In",
  logout: "Sign out",
  
  // Auth Specifics
  register: "Sign up",
  createAccount: "Create account",
  confirmPassword: "Confirm password",
  alreadyHaveAccount: "Already have an account?",
  dontHaveAccount: "New to ZabahSoft?",
  termsAgree: "By creating an account, you agree to the",
  authTitle: "Sign in to ZabahSoft",
  authDesc: "Manage your hosting, emails, and enterprise solutions.",
  passForgot: "Forgot password?",
  authFooterTerms: "Terms",
  authFooterPrivacy: "Privacy",
  authFooterSecurity: "Security",
  authFooterContact: "Contact Support",
  
  // New Nav Specifics
  navWeb: "Web Solutions",
  navHosting: "Hosting",
  navEmails: "Official Emails",
  navSolutions: "Products",

  heroTitle: "The AI-powered platform for Afghanistan's digital future",
  heroSubtitle: "ZabahSoft empowers public institutions and private companies with secure hosting, official email services, and enterprise web solutions in Kabul.",
  exploreServices: "Start building",
  clientPortal: "Client Login",
  trustedBy: "Trusted by forward-thinking companies in the region",
  
  // Sections
  sec1Title: "Web Infrastructure & Hosting",
  sec1Desc: "Deploy globally scalable applications and professional email systems with our optimized stacks.",
  sec2Title: "Secure Databases",
  sec2Desc: "Enterprise-grade data consistency with automated replication and backups.",
  sec3Title: "Bot Automation",
  sec3Desc: "Streamline customer support with intelligent Telegram & WhatsApp agents.",
  
  // UI
  readyToUpgrade: "Ready to accelerate your business?",
  joinHundreds: "Join the organizations transforming their operations today.",
  contactSales: "Contact Sales",
  search: "Search...",
  
  // Services Page
  solutions: "Marketplace",
  choosePackage: "Select a solution to deploy to your organization.",
  startingAt: "Starting at",
  purchaseNow: "Deploy Now",
  checkout: "Checkout",
  total: "Total Due",
  selectPayment: "Payment Method",
  
  // Payment & Auth Modal (New)
  accountRequired: "Account Required",
  loginToOrder: "To manage licenses and track this order, please sign in or create an account.",
  hessabPayDesc: "Instant AFN Payment",
  stripeDesc: "Secure Global Payment",
  sslSecure: "SSL Encrypted & Secure",

  // Dashboard
  welcomeBack: "Welcome back",
  activeServices: "Deployments",
  recentOrders: "Billing History",
  spendingOverview: "Usage & Cost",
  openTickets: "Support Requests",
  totalSpent: "Total Investment",
  status: "State",
  action: "Controls",
  viewKey: "Reveal Secret",
  orderId: "Order ID",
  
  email: "Email address",
  password: "Password",
  signIn: "Sign in",
  contact: "Contact Sales",
  integrations: "API Docs",
  
  // Chat
  chatSuggestions: "Suggestions:",
  sugPricing: "Pricing?",
  sugSupport: "Support",
  sugServices: "Services",
  chatContact: "Contact us via:",
  chatDisclaimer: "Powered by AI. Verify critical info.",
  typeMessage: "Type a message...",

  // Web Solutions Page
  webHeroTitle: "Create Your Website Now",
  webHeroSubtitle: "From high-performance corporate sites to complex web applications, we build solutions that drive growth. Get started today with our all-in-one packages.",
  webDemosTitle: "Featured Projects & Demos",
  webDemosDesc: "Explore our recent work. Click 'View Live Demo' to interact with the actual website inside the simulator.",
  webProcess: "Our Development Process",
  webFormTitle: "Start Your Project",
  webFormSubtitle: "Tell us about your goals. We'll get back to you with a proposal within 24 hours.",
  viewDemo: "View Live Demo",
  closeDemo: "Close Preview",
  
  // Web Stats
  statClients: "Enterprise Clients",
  statUptime: "Uptime Guarantee",
  statDelivery: "Avg. Delivery",
  statSupport: "Support",

  // Web Packages
  webPackagesTitle: "All-in-One Web Packages",
  webPackagesDesc: "Everything you need to get online. Includes Hosting, Domain, and Official Emails.",
  pkgStarter: "Starter Kit",
  pkgBusiness: "Professional",
  pkgEnterprise: "Enterprise",
  pkgIncluded: "Everything Included:",
  
  // Official Emails Page
  officialHeroTitle: "Secure Your Digital Identity",
  officialHeroSubtitle: "Professional email addresses (you@yourcompany.com) and domain registration services for Afghan businesses.",
  officialBtnCheck: "Check Availability",
  officialBtnPlans: "View Plans",
  domainCheckTitle: "Find Your Perfect Domain",
  domainCheckDesc: "Search for .com, .af, .net, and more. Instant registration available.",
  domainPlaceholder: "example.com",
  domainAvailable: "is available!",
  domainTaken: "is already taken.",
  domainSearch: "Search",
  planStarter: "Starter",
  planPro: "Professional",
  planEnterprise: "Enterprise",
  planBtn: "Select Plan",
  emailPlansTitle: "Email Hosting Packages",
  claimNow: "Claim Now",
  
  // Hosting Page
  hostingHeroTitle: "High-Performance Cloud Hosting",
  hostingHeroSubtitle: "Reliable, secure, and fast hosting solutions for your business. Starting at just $59/year.",
  hostingBtnPlans: "View Hosting Plans",
  hostingFeature1Title: "99.9% Uptime",
  hostingFeature1Desc: "We guarantee your site stays online.",
  hostingFeature2Title: "Free SSL",
  hostingFeature2Desc: "Secure your site and boost SEO rankings.",
  hostingFeature3Title: "24/7 Support",
  hostingFeature3Desc: "Our expert team is always here to help.",
  hostingPlanBasic: "Basic Hosting",
  hostingPlanBusiness: "Business Hosting",
  hostingPlanPremium: "Premium Cloud",
  secureHosting: "Secure Your Hosting",
  setupMsg: "Instant setup after payment verification",
  domainOptional: "Domain Name (Optional)",
  completeOrder: "Complete Order",
  processing: "Processing...",
  
  // Common Features (for Plans)
  featStorage: "Storage",
  featEmails: "Email Accounts",
  featWebsites: "Websites",
  featSSL: "Free SSL Certificate",
  featSupport: "24/7 Support",
  featBackups: "Daily Backups",
  featPrioritySupport: "Priority Support",
  featNVMe: "Unlimited NVMe Storage",
  featDedIP: "Dedicated IP",
  featSecurity: "Advanced Security",
  featSpam: "Spam Protection",
  featWebmail: "Webmail Access",
  featDomain: "Free Domain (.com)",
  featDesign: "Responsive Design",
  featSEO: "Basic SEO",
  
  bestValue: "Best Value",
  mostPopular: "Most Popular",
  
  // Order Success
  orderReceived: "Order Received!",
  orderReceivedMsg: "We have received your request. Our team will contact you shortly.",
  submitAnother: "Submit another request",
  newOrder: "New Order",
  
  // Form Labels
  lblFullName: "Full Name",
  lblCompany: "Company Name",
  lblEmail: "Email Address",
  lblPhone: "Phone Number",
  lblProjectType: "Project Type",
  lblBudget: "Estimated Budget",
  lblDescription: "Project Details",
  lblSubject: "Subject",
  lblMessage: "Message",
  btnSubmit: "Request Quote",
  btnSendMessage: "Send Message",
  
  // Form Options
  optEcommerce: "E-Commerce Store",
  optCorporate: "Corporate Website",
  optWebApp: "Web Application / SaaS",
  optLanding: "Landing Page",
  optOther: "Other / Custom",
  
  // Budgets
  budgetLow: "Less than $1,000",
  budgetMedium: "$1,000 - $5,000",
  budgetHigh: "$5,000 - $10,000",
  budgetEnterprise: "$10,000+",

  // Blog
  blogHeroTitle: "Insights & Updates",
  blogHeroSubtitle: "The latest news, technologies, and resources from the ZabahSoft engineering team.",
  readMore: "Read Article",
  featuredPost: "Featured",
  latestPosts: "Latest Articles",
  relatedPosts: "Related Articles",
  sharePost: "Share this article",
  writtenBy: "Written by",
  backToBlog: "Back to Blog",

  // Contact Page
  contactHeroTitle: "Let's Build Something Great",
  contactHeroSubtitle: "Whether you need a custom enterprise solution, official emails, or technical support, our team is here to help.",
  ourOffices: "Our Offices",
  hq: "Headquarters",
  regionalHub: "Regional Hub",
  globalOffice: "Global Office",
  getInTouch: "Get in Touch",
  supportEmail: "Support Email",
  generalInquiry: "General Inquiry",
  callUs: "Call Us",
  whatsappUs: "WhatsApp Us",
  workingHours: "Working Hours",
  hoursDesc: "Sat - Thu, 8:00 AM - 5:00 PM",
  viewOnMap: "View on Map",
  faqTitle: "Frequently Asked Questions",

  // New Sections: Testimonials & Partners
  partnersTitle: "Strategic Collaborations",
  partnersDesc: "Powering the digital infrastructure of Afghanistan's leading institutions.",
  testimonialsTitle: "What Our Clients Say",
  testimonialsSubtitle: "Trusted by over 500+ businesses, from startups to government ministries.",

  // Theme
  theme: "Theme",
  light: "Light",
  dark: "Dark",

  // Footer
  ftProduct: "Product",
  ftPlatform: "Platform",
  ftSupport: "Support",
  ftCompany: "Company",
  ftFeatures: "Features",
  ftSecurity: "Security",
  ftTeam: "Team",
  ftAPI: "Developer API",
  ftPartners: "Partners",
  ftDocs: "Documentation",
  ftCommunity: "Community",
  ftAbout: "About Us",
  ftCareers: "Careers",
  ftTerms: "Terms",
  ftPrivacy: "Privacy",
  ftSitemap: "Sitemap",
};

// Data Collections for English
const servicesEn: Service[] = [
  {
    id: 1,
    name: "Corporate Website Package",
    description: "A professional, responsive website designed to establish a strong digital presence for your business.",
    type: ServiceType.WEB,
    price_afn: 25000,
    price_usd: 350,
    features: ["Responsive Design", "CMS Integration", "SEO Optimization", "1 Year Hosting", "Official Corporate Emails"],
    icon: "fas fa-laptop-code",
    specs: [
      { label: "Stack", value: "React / Laravel" },
      { label: "Delivery", value: "2 Weeks" },
      { label: "Emails", value: "Unlimited Accounts" },
      { label: "Storage", value: "10 GB SSD" }
    ]
  },
  {
    id: 2,
    name: "E-Commerce Platform",
    description: "Full-featured online store with payment gateways, inventory management, and analytics.",
    type: ServiceType.WEB,
    price_afn: 60000,
    price_usd: 850,
    features: ["Product Management", "HessabPay & Stripe", "Inventory System", "Admin Panel"],
    icon: "fas fa-shopping-cart",
    badge: "Best Seller",
    specs: [
      { label: "Products", value: "Unlimited" },
      { label: "Gateway", value: "Visa/Mastercard/Local" },
      { label: "Security", value: "SSL Included" },
      { label: "Analytics", value: "Real-time Dashboard" }
    ]
  },
  {
    id: 3,
    name: "Enterprise Database Cluster",
    description: "High-availability MySQL/PostgreSQL setup designed for data-intensive applications.",
    type: ServiceType.DB,
    price_afn: 100000,
    price_usd: 1400,
    features: ["Master-Slave Replication", "Daily Backups", "Performance Tuning", "Monitoring Dashboard"],
    icon: "fas fa-server",
    specs: [
      { label: "Engine", value: "MySQL 8.0 / PostgreSQL 15" },
      { label: "Uptime", value: "99.99% SLA" },
      { label: "Backup", value: "Automated Hourly" },
      { label: "Nodes", value: "3 (1 Primary, 2 Replicas)" }
    ]
  },
  {
    id: 4,
    name: "POS Software License",
    description: "Offline-first Point of Sale system for retail shops, pharmacies, and supermarkets.",
    type: ServiceType.SOFT,
    price_afn: 15000,
    price_usd: 200,
    features: ["Barcode Scanning", "Inventory Tracking", "Sales Reports", "Multi-user"],
    icon: "fas fa-cash-register",
    specs: [
      { label: "OS", value: "Windows / Android" },
      { label: "Mode", value: "Offline & Online Sync" },
      { label: "License", value: "Lifetime Per Device" },
      { label: "Hardware", value: "Printer/Scanner Support" }
    ]
  },
  {
    id: 5,
    name: "Telegram/WhatsApp Bot",
    description: "AI-powered chatbots to automate customer support and order taking 24/7.",
    type: ServiceType.SOFT,
    price_afn: 30000,
    price_usd: 450,
    features: ["Auto-reply", "Order Integration", "AI Logic", "Broadcast Messages"],
    icon: "fas fa-robot",
    specs: [
      { label: "Platform", value: "Telegram & WhatsApp API" },
      { label: "AI Model", value: "Gemini / GPT-4" },
      { label: "Language", value: "Multi-lingual Support" },
      { label: "Users", value: "Unlimited Conversations" }
    ]
  }
];

const testimonialsEn: Testimonial[] = [
  { id: 1, name: "Jamshid Alokozay", role: "CEO", company: "Alokozay Group", content: "ZabahSoft transformed our digital infrastructure. Their hosting is rock-solid and the support is unmatched in Kabul.", avatar: "https://ui-avatars.com/api/?name=Jamshid+Alokozay&background=0D8ABC&color=fff", rating: 5 },
  { id: 2, name: "Mariam Wafa", role: "IT Director", company: "Kabul University", content: "The official email solution provided by ZabahSoft gave our faculty the professional identity we needed to collaborate internationally.", avatar: "https://ui-avatars.com/api/?name=Mariam+Wafa&background=e91e63&color=fff", rating: 5 },
  { id: 3, name: "Faisal Nuri", role: "Founder", company: "Nuri Supermarkets", content: "The POS system is intuitive and works perfectly offline. It has streamlined our inventory management across 5 branches.", avatar: "https://ui-avatars.com/api/?name=Faisal+Nuri&background=10b981&color=fff", rating: 4 }
];

const postsEn: BlogPost[] = [
  {
    id: "1",
    slug: "fintech-afghanistan-hessabpay",
    title: "The Rise of Fintech in Afghanistan: How Digital Payments are Changing Business",
    excerpt: "Exploring the integration of HessabPay and Stripe in local commerce, and how ZabahSoft bridges the gap for international trade.",
    content: `<p class="mb-4">Afghanistan's financial landscape is undergoing a rapid transformation. With the adoption of mobile money solutions like <strong>HessabPay</strong>, small businesses are moving away from cash-only operations to digital record-keeping.</p><h2 class="text-2xl font-bold mb-4 mt-8 text-gray-900 dark:text-white">Why Digital?</h2><p class="mb-4">Digital transactions offer security, traceability, and ease of access. For a long time, the lack of banking infrastructure hindered growth. Now, APIs allow developers to integrate payment gateways directly into websites.</p><p class="mb-4">At ZabahSoft, we have integrated HessabPay into our <em>E-Commerce Package</em>, allowing vendors to accept AFN payments instantly.</p>`,
    coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1200",
    author: { name: "Ahmad Fawad", avatar: "https://ui-avatars.com/api/?name=Ahmad+Fawad&background=0D8ABC&color=fff", role: "Lead Engineer" },
    category: "Tech",
    tags: ["Fintech", "HessabPay", "E-Commerce"],
    publishedAt: "Oct 24, 2023",
    readTime: "5 min read",
    featured: true
  },
  {
    id: "2",
    slug: "react-vs-laravel-stack",
    title: "React vs Laravel: Choosing the Right Stack for Your Enterprise",
    excerpt: "A deep dive into monolithic vs headless architectures. When should you decouple your frontend?",
    content: `<p class="mb-4">The debate between traditional server-side rendering and modern SPAs (Single Page Applications) is common.</p>`,
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200",
    author: { name: "Sarah Karimi", avatar: "https://ui-avatars.com/api/?name=Sarah+Karimi&background=e91e63&color=fff", role: "Frontend Architect" },
    category: "Tutorial",
    tags: ["React", "Laravel", "Architecture"],
    publishedAt: "Nov 02, 2023",
    readTime: "8 min read"
  },
  {
    id: "3",
    slug: "ai-support-bots",
    title: "Automating Customer Support with Gemini & WhatsApp",
    excerpt: "How we reduced support ticket resolution time by 60% using AI-powered chatbots integrated with standard messaging apps.",
    content: "<p>Chatbots are no longer just simple decision trees...</p>",
    coverImage: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=1200",
    author: { name: "ZabahSoft Team", avatar: "https://ui-avatars.com/api/?name=Zabah+Soft&background=10b981&color=fff", role: "Product" },
    category: "Business",
    tags: ["AI", "Gemini", "Automation"],
    publishedAt: "Nov 15, 2023",
    readTime: "4 min read"
  }
];

const faqsEn: FAQ[] = [
  { q: "Do you provide technical support after project delivery?", a: "Yes, all our enterprise packages come with 3 to 12 months of free technical support and maintenance." },
  { q: "How does the HessabPay integration work?", a: "We use the official HessabPay API to generate secure payment tokens. Funds are transferred directly to your merchant wallet instantly." },
  { q: "Can I upgrade my hosting plan later?", a: "Absolutely. Our cloud infrastructure is scalable, meaning you can add more resources (CPU, RAM, Storage) as your traffic grows." },
  { q: "Do you have a physical office I can visit?", a: "Yes, you can visit any of our branches listed above during working hours (Sat-Thu, 8am-5pm)." }
];

const branchesEn: Branch[] = [
  { id: 'kabul', nameKey: 'hq', city: 'Kabul, Afghanistan', address: 'Shahr-e-Naw, Ansari Square, Business Tower, 4th Floor', phone: '+93 799 000 000', email: 'kabul@zabahsoft.com', mapQuery: 'Shahr-e-Naw,Kabul,Afghanistan' },
  { id: 'herat', nameKey: 'regionalHub', city: 'Herat, Afghanistan', address: 'Jada-e-Bank Khoon, IT Center, Office #202', phone: '+93 700 111 222', email: 'herat@zabahsoft.com', mapQuery: 'Herat,Afghanistan' },
  { id: 'dubai', nameKey: 'globalOffice', city: 'Dubai, UAE', address: 'Business Bay, The Binary Tower, Office 1204', phone: '+971 50 123 4567', email: 'uae@zabahsoft.com', mapQuery: 'Business+Bay,Dubai' }
];

const demosEn: WebDemo[] = [
  { id: 1, title: "Afghan-Mart E-Commerce", category: "E-Commerce", image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", previewUrl: "https://demo.ecom.zabahsoft.com", tags: ["React", "Laravel", "HessabPay"], description: "A complete multi-vendor marketplace tailored for the Afghan market. Features include SMS notifications, HessabPay integration, and a dedicated vendor dashboard.", client: "Afghan-Mart Group", year: "2023" },
  { id: 2, title: "Kabul Logistics Corp", category: "Corporate", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", previewUrl: "https://demo.logistics.zabahsoft.com", tags: ["Next.js", "Tailwind", "SEO"], description: "Modern corporate identity for a logistics giant. Optimized for high SEO ranking with a shipment tracking portal.", client: "Kabul Logistics", year: "2022" },
  { id: 3, title: "MedTech Hospital Portal", category: "Web App", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", previewUrl: "https://demo.medtech.zabahsoft.com", tags: ["React", "Node.js", "PostgreSQL"], description: "Secure patient management system with role-based access for doctors, nurses, and administrators.", client: "City Hospital", year: "2023" }
];

// Farsi Data (Sample Translations)
const servicesFa: Service[] = [
  {
    id: 1,
    name: "بسته وب‌سایت شرکتی",
    description: "یک وب‌سایت حرفه‌ای و ریسپانسیو برای ایجاد حضور دیجیتال قوی برای کسب‌وکار شما.",
    type: ServiceType.WEB,
    price_afn: 25000,
    price_usd: 350,
    features: ["طراحی واکنش‌گرا", "اتصال به سیستم مدیریت محتوا", "بهینه‌سازی سئو", "میزبانی ۱ ساله", "ایمیل‌های رسمی شرکتی"],
    icon: "fas fa-laptop-code",
    specs: [
      { label: "تکنولوژی", value: "React / Laravel" },
      { label: "تحویل", value: "۲ هفته" },
      { label: "ایمیل", value: "نامحدود" },
      { label: "فضا", value: "۱۰ گیگابایت SSD" }
    ]
  },
  {
    id: 2,
    name: "پلتفرم فروشگاه آنلاین",
    description: "فروشگاه آنلاین با امکانات کامل، درگاه‌های پرداخت، مدیریت موجودی و تحلیل داده.",
    type: ServiceType.WEB,
    price_afn: 60000,
    price_usd: 850,
    features: ["مدیریت محصول", "حساب‌پی و استرایپ", "سیستم انبارداری", "پنل مدیریت"],
    icon: "fas fa-shopping-cart",
    badge: "پرفروش‌ترین",
    specs: [
      { label: "محصولات", value: "نامحدود" },
      { label: "درگاه", value: "ویزا/مستر/داخلی" },
      { label: "امنیت", value: "شامل SSL" },
      { label: "آمار", value: "داشبورد لحظه‌ای" }
    ]
  },
  {
    id: 3,
    name: "کلاستر پایگاه داده سازمانی",
    description: "راه‌اندازی MySQL/PostgreSQL با دسترسی بالا برای اپلیکیشن‌های داده‌محور.",
    type: ServiceType.DB,
    price_afn: 100000,
    price_usd: 1400,
    features: ["رپلیکیشن Master-Slave", "بک‌آپ روزانه", "بهینه‌سازی عملکرد", "داشبورد مانیتورینگ"],
    icon: "fas fa-server",
    specs: [
      { label: "موتور", value: "MySQL 8.0 / PG 15" },
      { label: "آپ‌تایم", value: "99.99% SLA" },
      { label: "بک‌آپ", value: "خودکار ساعتی" },
      { label: "نودها", value: "۳ (۱ اصلی، ۲ کپی)" }
    ]
  },
  {
    id: 4,
    name: "لایسنس نرم‌افزار فروش (POS)",
    description: "سیستم فروش آفلاین برای فروشگاه‌ها، داروخانه‌ها و سوپرمارکت‌ها.",
    type: ServiceType.SOFT,
    price_afn: 15000,
    price_usd: 200,
    features: ["اسکن بارکد", "رهگیری موجودی", "گزارش فروش", "چند کاربره"],
    icon: "fas fa-cash-register",
    specs: [
      { label: "سیستم عامل", value: "ویندوز / اندروید" },
      { label: "حالت", value: "سینک آفلاین و آنلاین" },
      { label: "لایسنس", value: "مادام‌العمر هر دستگاه" },
      { label: "سخت‌افزار", value: "پشتیبانی پرینتر/اسکنر" }
    ]
  },
  {
    id: 5,
    name: "ربات تلگرام و واتس‌اپ",
    description: "چت‌بات‌های هوشمند برای اتوماسیون پشتیبانی مشتریان و ثبت سفارش ۲۴/۷.",
    type: ServiceType.SOFT,
    price_afn: 30000,
    price_usd: 450,
    features: ["پاسخ خودکار", "اتصال به سفارشات", "منطق هوش مصنوعی", "پیام‌های گروهی"],
    icon: "fas fa-robot",
    specs: [
      { label: "پلتفرم", value: "API تلگرام و واتس‌اپ" },
      { label: "مدل هوش مصنوعی", value: "Gemini / GPT-4" },
      { label: "زبان", value: "پشتیبانی چندزبانه" },
      { label: "کاربران", value: "مکالمات نامحدود" }
    ]
  }
];

const testimonialsFa: Testimonial[] = [
  { id: 1, name: "جمشید الکوزی", role: "مدیر عامل", company: "گروه الکوزی", content: "ظبه سافت زیرساخت دیجیتال ما را متحول کرد. میزبانی وب آنها بسیار پایدار است و پشتیبانی فنی در کابل بی‌نظیر است.", avatar: "https://ui-avatars.com/api/?name=Jamshid+Alokozay&background=0D8ABC&color=fff", rating: 5 },
  { id: 2, name: "مریم وفا", role: "مدیر فناوری اطلاعات", company: "دانشگاه کابل", content: "راهکار ایمیل رسمی ارائه شده توسط ظبه سافت به اساتید ما هویت حرفه‌ای مورد نیاز برای همکاری‌های بین‌المللی را داد.", avatar: "https://ui-avatars.com/api/?name=Mariam+Wafa&background=e91e63&color=fff", rating: 5 },
  { id: 3, name: "فیصل نوری", role: "بنیانگذار", company: "سوپرمارکت‌های نوری", content: "سیستم فروش بسیار روان است و به صورت آفلاین عالی کار می‌کند. مدیریت موجودی ما در ۵ شعبه بسیار ساده شده است.", avatar: "https://ui-avatars.com/api/?name=Faisal+Nuri&background=10b981&color=fff", rating: 4 }
];

const postsFa: BlogPost[] = [
  {
    id: "1",
    slug: "fintech-afghanistan-hessabpay",
    title: "ظهور فین‌تک در افغانستان: پرداخت‌های دیجیتال چگونه کسب‌وکارهای محلی را تغییر می‌دهند",
    excerpt: "بررسی ادغام حساب‌پی و استرایپ در تجارت محلی و نقش ظبه سافت در پر کردن شکاف تجارت بین‌المللی.",
    content: `<p class="mb-4">چشم‌انداز مالی افغانستان به سرعت در حال تغییر است...</p>`,
    coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1200",
    author: { name: "احمد فواد", avatar: "https://ui-avatars.com/api/?name=Ahmad+Fawad&background=0D8ABC&color=fff", role: "مهندس ارشد" },
    category: "Tech",
    tags: ["فین‌تک", "حساب‌پی", "تجارت الکترونیک"],
    publishedAt: "۲ عقرب ۱۴۰۲",
    readTime: "۵ دقیقه مطالعه",
    featured: true
  },
  {
    id: "2",
    slug: "react-vs-laravel-stack",
    title: "React در برابر Laravel: انتخاب استک مناسب برای سازمان شما",
    excerpt: "بررسی عمیق معماری‌های یکپارچه در مقابل بدون سر (Headless). چه زمانی باید فرانت‌اند را جدا کنید؟",
    content: `<p class="mb-4">بحث بین رندر سمت سرور سنتی و SPA مدرن رایج است...</p>`,
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200",
    author: { name: "سارا کریمی", avatar: "https://ui-avatars.com/api/?name=Sarah+Karimi&background=e91e63&color=fff", role: "معمار فرانت‌اند" },
    category: "Tutorial",
    tags: ["React", "Laravel", "معماری"],
    publishedAt: "۱۱ عقرب ۱۴۰۲",
    readTime: "۸ دقیقه مطالعه"
  },
  {
    id: "3",
    slug: "ai-support-bots",
    title: "اتوماسیون پشتیبانی مشتریان با Gemini و واتس‌اپ",
    excerpt: "چگونه زمان حل تیکت‌های پشتیبانی را با استفاده از چت‌بات‌های هوشمند ۶۰٪ کاهش دادیم.",
    content: "<p>چت‌بات‌ها دیگر فقط درخت‌های تصمیم ساده نیستند...</p>",
    coverImage: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=1200",
    author: { name: "تیم ظبه سافت", avatar: "https://ui-avatars.com/api/?name=Zabah+Soft&background=10b981&color=fff", role: "محصول" },
    category: "Business",
    tags: ["هوش مصنوعی", "Gemini", "اتوماسیون"],
    publishedAt: "۲۴ عقرب ۱۴۰۲",
    readTime: "۴ دقیقه مطالعه"
  }
];

const faqsFa: FAQ[] = [
  { q: "آیا پس از تحویل پروژه پشتیبانی فنی ارائه می‌دهید؟", a: "بله، تمام بسته‌های سازمانی ما شامل ۳ تا ۱۲ ماه پشتیبانی فنی و نگهداری رایگان هستند." },
  { q: "ادغام حساب‌پی چگونه کار می‌کند؟", a: "ما از API رسمی حساب‌پی برای تولید توکن‌های پرداخت امن استفاده می‌کنیم. وجوه مستقیماً و بلافاصله به کیف پول تجاری شما منتقل می‌شود." },
  { q: "آیا می‌توانم بعداً پلن میزبانی خود را ارتقا دهم؟", a: "قطعاً. زیرساخت ابری ما مقیاس‌پذیر است، به این معنی که با رشد ترافیک شما می‌توانید منابع بیشتری (CPU، RAM، فضا) اضافه کنید." },
  { q: "آیا دفتر فیزیکی دارید که بتوانم مراجعه کنم؟", a: "بله، می‌توانید در ساعات کاری (شنبه تا پنجشنبه، ۸ صبح تا ۵ عصر) به هر یک از شعب ما که در بالا لیست شده مراجعه کنید." }
];

const branchesFa: Branch[] = [
  { id: 'kabul', nameKey: 'hq', city: 'کابل، افغانستان', address: 'شهر نو، چهارراهی انصاری، برج تجارت، طبقه ۴', phone: '+93 799 000 000', email: 'kabul@zabahsoft.com', mapQuery: 'Shahr-e-Naw,Kabul,Afghanistan' },
  { id: 'herat', nameKey: 'regionalHub', city: 'هرات، افغانستان', address: 'جاده بانک خون، مرکز IT، دفتر ۲۰۲', phone: '+93 700 111 222', email: 'herat@zabahsoft.com', mapQuery: 'Herat,Afghanistan' },
  { id: 'dubai', nameKey: 'globalOffice', city: 'دبی، امارات', address: 'بیزنس بی، برج باینری، دفتر ۱۲۰۴', phone: '+971 50 123 4567', email: 'uae@zabahsoft.com', mapQuery: 'Business+Bay,Dubai' }
];

const demosFa: WebDemo[] = [
  { id: 1, title: "فروشگاه افغان‌مارت", category: "فروشگاه آنلاین", image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", previewUrl: "https://demo.ecom.zabahsoft.com", tags: ["React", "Laravel", "HessabPay"], description: "یک بازار چندفروشنده کامل که برای بازار افغانستان طراحی شده است. شامل اعلان‌های پیامکی، ادغام حساب‌پی و داشبورد اختصاصی فروشنده.", client: "گروه افغان‌مارت", year: "۱۴۰۲" },
  { id: 2, title: "لجستیک کابل کورپ", category: "شرکتی", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", previewUrl: "https://demo.logistics.zabahsoft.com", tags: ["Next.js", "Tailwind", "SEO"], description: "هویت شرکتی مدرن برای یک غول لجستیک. بهینه‌شده برای رتبه‌بندی بالای سئو با پورتال رهگیری مرسولات.", client: "لجستیک کابل", year: "۱۴۰۱" },
  { id: 3, title: "پورتال بیمارستان مد‌تک", category: "وب‌اپلیکیشن", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", previewUrl: "https://demo.medtech.zabahsoft.com", tags: ["React", "Node.js", "PostgreSQL"], description: "سیستم مدیریت بیمار امن با دسترسی نقش‌محور برای پزشکان، پرستاران و مدیران.", client: "شفاخانه شهر", year: "۱۴۰۲" }
];

// Pashto Data
const servicesPs: Service[] = [
  {
    id: 1,
    name: "د کارپوریټ ویب پاڼې کڅوړه",
    description: "یوه مسلکي، ځواب ویونکې ویب پاڼه چې ستاسو د سوداګرۍ لپاره قوي ډیجیټل شتون رامینځته کولو لپاره ډیزاین شوې.",
    type: ServiceType.WEB,
    price_afn: 25000,
    price_usd: 350,
    features: ["ځواب ویونکی ډیزاین", "CMS ادغام", "SEO اصلاح کول", "۱ کال کوربه توب", "رسمي کارپوریټ بریښنالیکونه"],
    icon: "fas fa-laptop-code",
    specs: [
      { label: "ټیکنالوژي", value: "React / Laravel" },
      { label: "تحویل", value: "۲ اونۍ" },
      { label: "بریښنالیکونه", value: "لامحدود" },
      { label: "ذخیره", value: "۱۰ GB SSD" }
    ]
  },
  {
    id: 2,
    name: "د ای-کامرس پلیټ فارم",
    description: "د تادیې دروازې، د موجودیت مدیریت، او تحلیلونو سره بشپړ آنلاین پلورنځی.",
    type: ServiceType.WEB,
    price_afn: 60000,
    price_usd: 850,
    features: ["د محصول مدیریت", "حساب‌پی او سټراپ", "د موجودیت سیسټم", "د مدیریت پینل"],
    icon: "fas fa-shopping-cart",
    badge: "غوره پلورونکی",
    specs: [
      { label: "محصولات", value: "لامحدود" },
      { label: "دروازه", value: "ویزا/مستر/ځایي" },
      { label: "امنیت", value: "SSL شامل دی" },
      { label: "تحلیلونه", value: "ریښتیني وخت ډشبورډ" }
    ]
  },
  {
    id: 3,
    name: "د تشبث ډیټابیس کلسټر",
    description: "د ډیټا متمرکز غوښتنلیکونو لپاره د لوړ شتون MySQL/PostgreSQL تنظیم.",
    type: ServiceType.DB,
    price_afn: 100000,
    price_usd: 1400,
    features: ["Master-Slave نقل", "ورځنی بیک اپ", "د فعالیت ښه کول", "د څارنې ډشبورډ"],
    icon: "fas fa-server",
    specs: [
      { label: "ماشین", value: "MySQL 8.0 / PG 15" },
      { label: "فعال وخت", value: "99.99% SLA" },
      { label: "بک اپ", value: "په اتوماتیک ډول ساعت" },
      { label: "نوډونه", value: "۳ (۱ لومړنی، ۲ نقل)" }
    ]
  },
  {
    id: 4,
    name: "د POS سافټویر جواز",
    description: "د پرچون پلورنځیو، درملتونونو، او سوپر مارکیټونو لپاره آفلاین د پلور سیسټم.",
    type: ServiceType.SOFT,
    price_afn: 15000,
    price_usd: 200,
    features: ["بارکوډ سکین کول", "د موجودیت تعقیب", "د پلور راپورونه", "څو کاروونکي"],
    icon: "fas fa-cash-register",
    specs: [
      { label: "سیستم", value: "Windows / Android" },
      { label: "موډ", value: "آفلاین او آنلاین همغږي" },
      { label: "جواز", value: "د هرې وسیلې لپاره د ژوند وخت" },
      { label: "هارډویر", value: "د پرنټر/سکینر ملاتړ" }
    ]
  },
  {
    id: 5,
    name: "ټیلیګرام/واټس اپ بوټ",
    description: "د AI ځواک لرونکي چیټ بوټونه د پیرودونکي ملاتړ اتومات کولو او امر اخیستلو لپاره 24/7.",
    type: ServiceType.SOFT,
    price_afn: 30000,
    price_usd: 450,
    features: ["آټو ځواب", "د امر ادغام", "AI منطق", "خپرونې پیغامونه"],
    icon: "fas fa-robot",
    specs: [
      { label: "پلیټ فارم", value: "API ټیلیګرام او واټس اپ" },
      { label: "ماډل", value: "Gemini / GPT-4" },
      { label: "ژبه", value: "څو ژبنی ملاتړ" },
      { label: "کاروونکي", value: "لامحدود خبرې" }
    ]
  }
];

const testimonialsPs: Testimonial[] = [
  { id: 1, name: "جمشید الکوزی", role: "اجراییه رییس", company: "الکوزی ګروپ", content: "ظبه سافت زموږ ډیجیټل زیربنا بدله کړه. د دوی کوربه توب خورا باثباته دی او په کابل کې ملاتړ بې ساري دی.", avatar: "https://ui-avatars.com/api/?name=Jamshid+Alokozay&background=0D8ABC&color=fff", rating: 5 },
  { id: 2, name: "مریم وفا", role: "IT رییسه", company: "د کابل پوهنتون", content: "د ظبه سافت لخوا چمتو شوی رسمي بریښنالیک حل زموږ پوهنځي ته مسلکي پیژندنه ورکړه چې موږ ورته اړتیا درلوده.", avatar: "https://ui-avatars.com/api/?name=Mariam+Wafa&background=e91e63&color=fff", rating: 5 },
  { id: 3, name: "فیصل نوري", role: "بنسټ ایښودونکی", company: "نوري سوپر مارکیټونه", content: "د POS سیسټم خورا روان دی او په آفلاین ډول عالي کار کوي. زموږ د 5 څانګو کې د موجودیت مدیریت خورا ساده شوی دی.", avatar: "https://ui-avatars.com/api/?name=Faisal+Nuri&background=10b981&color=fff", rating: 4 }
];

const postsPs: BlogPost[] = [
  {
    id: "1",
    slug: "fintech-afghanistan-hessabpay",
    title: "په افغانستان کې د فینټیک وده: ډیجیټل تادیات څنګه سوداګرۍ بدلوي",
    excerpt: "په محلي سوداګرۍ کې د حساب‌پی او سټراپ ادغام سپړنه، او څنګه ظبه سافت د نړیوالې سوداګرۍ لپاره واټن کموي.",
    content: `<p class="mb-4">د افغانستان مالي منظره د چټک بدلون په حال کې ده...</p>`,
    coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1200",
    author: { name: "احمد فواد", avatar: "https://ui-avatars.com/api/?name=Ahmad+Fawad&background=0D8ABC&color=fff", role: "مخکښ انجنیر" },
    category: "Tech",
    tags: ["فینټیک", "حساب‌پی", "ای-کامرس"],
    publishedAt: "۲ لړم ۱۴۰۲",
    readTime: "۵ دقیقې لوستل",
    featured: true
  },
  {
    id: "2",
    slug: "react-vs-laravel-stack",
    title: "React د Laravel په وړاندې: ستاسو د سازمان لپاره د سم سټیک غوره کول",
    excerpt: "د یو ځایي جوړښتونو په مقابل کې د بې سرې (Headless) جوړښتونو ژور تحلیل. کله باید خپل فرنټ انډ جلا کړئ؟",
    content: `<p class="mb-4">بحث د دودیز سرور اړخ رینډرینګ او عصري SPA ترمنځ عام دی...</p>`,
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200",
    author: { name: "سارا کریمي", avatar: "https://ui-avatars.com/api/?name=Sarah+Karimi&background=e91e63&color=fff", role: "فرنټ انډ معمار" },
    category: "Tutorial",
    tags: ["React", "Laravel", "معمارۍ"],
    publishedAt: "۱۱ لړم ۱۴۰۲",
    readTime: "۸ دقیقې لوستل"
  },
  {
    id: "3",
    slug: "ai-support-bots",
    title: "د Gemini او واټس اپ سره د پیرودونکي ملاتړ اتومات کول",
    excerpt: "موږ څنګه د هوښیار چیټ بوټونو په کارولو سره د ملاتړ ټیکټ حل وخت ۶۰٪ کم کړ.",
    content: "<p>چیټ بوټونه نور یوازې د پریکړې ساده ونې ندي...</p>",
    coverImage: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=1200",
    author: { name: "د ظبه سافت ټیم", avatar: "https://ui-avatars.com/api/?name=Zabah+Soft&background=10b981&color=fff", role: "محصول" },
    category: "Business",
    tags: ["AI", "Gemini", "اتومات کول"],
    publishedAt: "۲۴ لړم ۱۴۰۲",
    readTime: "۴ دقیقې لوستل"
  }
];

const faqsPs: FAQ[] = [
  { q: "ایا تاسو د پروژې تحویل وروسته تخنیکي ملاتړ چمتو کوئ؟", a: "هو، زموږ ټولې کارپوریټ کڅوړې د ۳ څخه تر ۱۲ میاشتو وړیا تخنیکي ملاتړ او ساتنې سره راځي." },
  { q: "د حساب‌پی ادغام څنګه کار کوي؟", a: "موږ د خوندي تادیې ټوکنونو رامینځته کولو لپاره رسمي حساب‌پی API کاروو. فنډونه په سمدستي توګه ستاسو سوداګریز والټ ته لیږدول کیږي." },
  { q: "ایا زه کولی شم وروسته خپل کوربه توب پلان لوړ کړم؟", a: "بالکل. زموږ کلاوډ زیربنا د توزیع وړ ده، پدې معنی چې تاسو کولی شئ ډیرې سرچینې (CPU، RAM، ذخیره) اضافه کړئ لکه څنګه چې ستاسو ترافیک وده کوي." },
  { q: "ایا تاسو فزیکي دفتر لرئ چې زه ورشم؟", a: "هو، تاسو کولی شئ زموږ هرې څانګې ته چې پورته لیست شوي د کاري ساعتونو (شنبې - پنجشنبه، د سهار ۸ بجو څخه د مازدیګر ۵ بجو پورې) په جریان کې ورشئ." }
];

const branchesPs: Branch[] = [
  { id: 'kabul', nameKey: 'hq', city: 'کابل، افغانستان', address: 'شهر نو، انصاري څلور لارې، سوداګریز برج، څلورم پوړ', phone: '+93 799 000 000', email: 'kabul@zabahsoft.com', mapQuery: 'Shahr-e-Naw,Kabul,Afghanistan' },
  { id: 'herat', nameKey: 'regionalHub', city: 'هرات، افغانستان', address: 'د وینې بانک سړک، IT مرکز، ۲۰۲ دفتر', phone: '+93 700 111 222', email: 'herat@zabahsoft.com', mapQuery: 'Herat,Afghanistan' },
  { id: 'dubai', nameKey: 'globalOffice', city: 'دوبۍ، متحده عربي امارات', address: 'بیزنس خلیج، بائنری ټاور، ۱۲۰۴ دفتر', phone: '+971 50 123 4567', email: 'uae@zabahsoft.com', mapQuery: 'Business+Bay,Dubai' }
];

const demosPs: WebDemo[] = [
  { id: 1, title: "افغان مارټ پلورنځی", category: "آنلاین پلورنځی", image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", previewUrl: "https://demo.ecom.zabahsoft.com", tags: ["React", "Laravel", "HessabPay"], description: "یو بشپړ څو پلورونکی بازار چې د افغان بازار لپاره ډیزاین شوی. د SMS خبرتیاوې، د حساب‌پی ادغام، او د پلورونکي وقف شوی ډشبورډ شامل دي.", client: "افغان مارټ ګروپ", year: "۱۴۰۲" },
  { id: 2, title: "کابل لوژستیک کارپوریشن", category: "کارپوریټ", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", previewUrl: "https://demo.logistics.zabahsoft.com", tags: ["Next.js", "Tailwind", "SEO"], description: "د لوژستیک لوی لپاره عصري کارپوریټ هویت. د بار وړلو تعقیب پورټل سره د لوړ SEO درجه بندي لپاره مطلوب.", client: "کابل لوژستیک", year: "۱۴۰۱" },
  { id: 3, title: "میډټیک روغتون پورټل", category: "ویب غوښتنلیک", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", previewUrl: "https://demo.medtech.zabahsoft.com", tags: ["React", "Node.js", "PostgreSQL"], description: "د ډاکټرانو، نرسانو، او مدیرانو لپاره د رول پراساس لاسرسي سره د ناروغ مدیریت خوندي سیسټم.", client: "ښار روغتون", year: "۱۴۰۲" }
];

export const translations = {
  en: {
    ...baseEn,
    
    // Updated Web Solutions Translations
    webHeroTitle: "Create Your Website Now",
    webHeroSubtitle: "From high-performance corporate sites to complex web applications, we build solutions that drive growth. Get started today with our all-in-one packages.",
    
    // Stats
    statClients: "Enterprise Clients",
    statUptime: "Uptime Guarantee",
    statDelivery: "Avg. Delivery",
    statSupport: "Support",

    // Packages
    webPackagesTitle: "All-in-One Web Packages",
    webPackagesDesc: "Everything you need to get online. Includes Hosting, Domain, and Official Emails.",
    pkgStarter: "Starter Kit",
    pkgBusiness: "Professional",
    pkgEnterprise: "Enterprise",
    pkgIncluded: "Everything Included:",

    servicesList: servicesEn,
    blogPosts: postsEn,
    contactFaqs: faqsEn,
    branches: branchesEn,
    webDemos: demosEn,
    testimonialsList: testimonialsEn
  },
  fa: {
    ...baseEn,
    brandName: "ظبه سافت",
    home: "خانه",
    services: "راهکارها",
    dashboard: "داشبورد",
    blog: "وبلاگ",
    contactNav: "تماس",
    login: "ورود به سیستم",
    logout: "خروج",
    
    // ... (previous fa translations)
    
    // Updated Web Solutions Translations
    webHeroTitle: "همین حالا وب‌سایت خود را بسازید",
    webHeroSubtitle: "از سایت‌های شرکتی پرسرعت تا وب‌اپلیکیشن‌های پیچیده، ما راهکارهایی می‌سازیم که باعث رشد می‌شوند. امروز با بسته‌های کامل ما شروع کنید.",
    
    // Stats
    statClients: "مشتریان سازمانی",
    statUptime: "تضمین آپ‌تایم",
    statDelivery: "میانگین تحویل",
    statSupport: "پشتیبانی",

    // Packages
    webPackagesTitle: "بسته‌های کامل طراحی وب",
    webPackagesDesc: "هر آنچه برای آنلاین شدن نیاز دارید. شامل میزبانی، دامنه و ایمیل‌های رسمی.",
    pkgStarter: "بسته شروع",
    pkgBusiness: "بسته حرفه‌ای",
    pkgEnterprise: "راهکار سازمانی",
    pkgIncluded: "همه‌چیز شامل:",

    // ... (rest of fa translations)
    register: "ثبت‌نام",
    createAccount: "ایجاد حساب کاربری",
    confirmPassword: "تکرار رمز عبور",
    alreadyHaveAccount: "حساب کاربری دارید؟",
    dontHaveAccount: "تازه‌وارد هستید؟",
    termsAgree: "با ایجاد حساب، شما موافقت می‌کنید با",
    authTitle: "ورود به ظبه سافت",
    authDesc: "مدیریت میزبانی وب، ایمیل‌ها و راهکارهای سازمانی.",
    passForgot: "رمز عبور را فراموش کردید؟",
    authFooterTerms: "قوانین",
    authFooterPrivacy: "حریم خصوصی",
    authFooterSecurity: "امنیت",
    authFooterContact: "تماس با پشتیبانی",
    
    navWeb: "طراحی وب",
    navHosting: "میزبانی وب",
    navEmails: "ایمیل رسمی",
    navSolutions: "محصولات",

    heroTitle: "پلتفرم هوشمند برای آینده دیجیتال افغانستان",
    heroSubtitle: "ظبه سافت موسسات دولتی و شرکت‌های خصوصی را با میزبانی امن وب، ایمیل‌های رسمی و راهکارهای وب سازمانی توانمند می‌سازد.",
    exploreServices: "شروع ساخت",
    clientPortal: "ورود مشتریان",
    trustedBy: "مورد اعتماد شرکت‌های پیشرو در منطقه",
    
    sec1Title: "زیرساخت وب و میزبانی",
    sec1Desc: "اپلیکیشن‌های مقیاس‌پذیر جهانی و سیستم‌های ایمیل رسمی را با استک‌های بهینه‌شده ما مستقر کنید.",
    sec2Title: "پایگاه داده امن",
    sec2Desc: "ثبات داده‌های سازمانی با همانندسازی و پشتیبان‌گیری خودکار.",
    sec3Title: "اتوماسیون ربات",
    sec3Desc: "پشتیبانی مشتریان را با نمایندگان هوشمند تلگرام و واتس‌اپ ساده کنید.",
    
    readyToUpgrade: "آیا برای سرعت بخشیدن به کسب‌وکار خود آماده‌اید؟",
    joinHundreds: "امروز به سازمان‌هایی بپیوندید که عملیات خود را متحول می‌کنند.",
    contactSales: "تماس با فروش",
    search: "جستجو...",
    
    solutions: "بازارچه خدمات",
    choosePackage: "یک راهکار برای استقرار در سازمان خود انتخاب کنید.",
    startingAt: "شروع از",
    purchaseNow: "استقرار اکنون",
    checkout: "پرداخت",
    total: "مبلغ قابل پرداخت",
    selectPayment: "روش پرداخت",
    
    accountRequired: "حساب کاربری الزامی است",
    loginToOrder: "برای مدیریت لایسنس‌ها و پیگیری این سفارش، لطفاً وارد شوید یا حساب کاربری ایجاد کنید.",
    hessabPayDesc: "پرداخت آنی افغانی",
    stripeDesc: "پرداخت امن بین‌المللی",
    sslSecure: "امن و رمزگذاری شده با SSL",

    welcomeBack: "خوش آمدید",
    activeServices: "سرویس‌های فعال",
    recentOrders: "تاریخچه صورتحساب",
    spendingOverview: "مصرف و هزینه",
    openTickets: "درخواست‌های پشتیبانی",
    totalSpent: "کل سرمایه‌گذاری",
    status: "وضعیت",
    action: "کنترل‌ها",
    viewKey: "نمایش کلید",
    orderId: "شناسه سفارش",
    
    email: "آدرس ایمیل",
    password: "رمز عبور",
    signIn: "ورود به پرتال",
    contact: "تماس با فروش",
    integrations: "مستندات API",

    chatSuggestions: "پیشنهادات:",
    sugPricing: "قیمت‌ها؟",
    sugSupport: "پشتیبانی",
    sugServices: "خدمات",
    chatContact: "تماس از طریق:",
    chatDisclaimer: "هوش مصنوعی. اطلاعات حیاتی را بررسی کنید.",
    typeMessage: "پیام خود را بنویسید...",

    webDemosTitle: "پروژه‌های منتخب و دموها",
    webDemosDesc: "نمونه کارهای اخیر و قالب‌های موجود ما را بررسی کنید. برای مشاهده زنده کلیک کنید.",
    webProcess: "فرآیند توسعه ما",
    webFormTitle: "پروژه خود را شروع کنید",
    webFormSubtitle: "درباره اهداف خود به ما بگویید. ما ظرف ۲۴ ساعت با یک پروپوزال با شما تماس خواهیم گرفت.",
    viewDemo: "مشاهده دمو زنده",
    closeDemo: "بستن پیش‌نمایش",
    
    officialHeroTitle: "هویت دیجیتال خود را امن کنید",
    officialHeroSubtitle: "آدرس‌های ایمیل رسمی (شما@شرکت‌شما.com) و خدمات ثبت دامنه برای کسب‌وکارهای افغان.",
    officialBtnCheck: "بررسی موجودی",
    officialBtnPlans: "مشاهده پلن‌ها",
    domainCheckTitle: "دامنه ایده‌آل خود را پیدا کنید",
    domainCheckDesc: "جستجو برای .com، .af، .net و بیشتر. ثبت آنی در دسترس است.",
    domainPlaceholder: "example.com",
    domainAvailable: "در دسترس است!",
    domainTaken: "قبلاً ثبت شده است.",
    domainSearch: "جستجو",
    planStarter: "شروع",
    planPro: "حرفه‌ای",
    planEnterprise: "سازمانی",
    planBtn: "انتخاب پلن",
    emailPlansTitle: "پکیج‌های میزبانی ایمیل",
    claimNow: "ثبت کنید",

    hostingHeroTitle: "میزبانی ابری پرسرعت",
    hostingHeroSubtitle: "راهکارهای میزبانی مطمئن، امن و سریع برای کسب‌وکار شما. شروع از فقط ۵۹ دلار در سال.",
    hostingBtnPlans: "مشاهده پلن‌های میزبانی",
    hostingFeature1Title: "آپ‌تایم ۹۹.۹٪",
    hostingFeature1Desc: "ما آنلاین ماندن سایت شما را تضمین می‌کنیم.",
    hostingFeature2Title: "SSL رایگان",
    hostingFeature2Desc: "سایت خود را ایمن کنید و رتبه سئو را افزایش دهید.",
    hostingFeature3Title: "پشتیبانی ۲۴/۷",
    hostingFeature3Desc: "تیم متخصص ما همیشه برای کمک آماده است.",
    hostingPlanBasic: "میزبانی پایه",
    hostingPlanBusiness: "میزبانی تجاری",
    hostingPlanPremium: "ابر ویژه",
    secureHosting: "میزبانی خود را ایمن کنید",
    setupMsg: "راه‌اندازی فوری پس از تایید پرداخت",
    domainOptional: "نام دامنه (اختیاری)",
    completeOrder: "تکمیل سفارش",
    processing: "در حال پردازش...",

    featStorage: "فضای ذخیره‌سازی",
    featEmails: "حساب‌های ایمیل",
    featWebsites: "وب‌سایت",
    featSSL: "گواهی SSL رایگان",
    featSupport: "پشتیبانی ۲۴/۷",
    featBackups: "بک‌آپ روزانه",
    featPrioritySupport: "پشتیبانی اولویت‌دار",
    featNVMe: "فضای NVMe نامحدود",
    featDedIP: "آی‌پی اختصاصی",
    featSecurity: "امنیت پیشرفته",
    featSpam: "محافظت ضد اسپم",
    featWebmail: "دسترسی وب‌میل",
    featDomain: "دامنه رایگان (.com)",
    featDesign: "طراحی ریسپانسیو",
    featSEO: "سئو پایه",

    bestValue: "بهترین انتخاب",
    mostPopular: "محبوب‌ترین",

    orderReceived: "سفارش دریافت شد!",
    orderReceivedMsg: "ما درخواست شما را دریافت کردیم. تیم ما به زودی با شما تماس خواهد گرفت.",
    submitAnother: "ثبت درخواست دیگر",
    newOrder: "سفارش جدید",

    lblFullName: "نام و نام خانوادگی",
    lblCompany: "نام شرکت",
    lblEmail: "آدرس ایمیل",
    lblPhone: "شماره تماس",
    lblProjectType: "نوع پروژه",
    lblBudget: "بودجه تخمینی",
    lblDescription: "جزئیات پروژه",
    lblSubject: "موضوع",
    lblMessage: "پیام",
    btnSubmit: "درخواست پیش‌فاکتور",
    btnSendMessage: "ارسال پیام",
    
    optEcommerce: "فروشگاه اینترنتی",
    optCorporate: "وب‌سایت شرکتی",
    optWebApp: "وب‌اپلیکیشن / SaaS",
    optLanding: "لندینگ پیج",
    optOther: "سایر / سفارشی",

    budgetLow: "کمتر از ۱۰۰۰ دلار",
    budgetMedium: "۱۰۰۰ - ۵۰۰۰ دلار",
    budgetHigh: "۵۰۰۰ - ۱۰,۰۰۰ دلار",
    budgetEnterprise: "بالای ۱۰,۰۰۰ دلار",

    blogHeroTitle: "بینش و اخبار",
    blogHeroSubtitle: "آخرین اخبار، تکنولوژی‌ها و منابع آموزشی از تیم مهندسی ظبه سافت.",
    readMore: "مطالعه مقاله",
    featuredPost: "ویژه",
    latestPosts: "آخرین مقالات",
    relatedPosts: "مقالات مرتبط",
    sharePost: "اشتراک‌گذاری",
    writtenBy: "نویسنده",
    backToBlog: "بازگشت به وبلاگ",

    contactHeroTitle: "بیایید چیزی عالی بسازیم",
    contactHeroSubtitle: "چه به یک راهکار سازمانی سفارشی، ایمیل‌های رسمی یا پشتیبانی فنی نیاز داشته باشید، تیم ما اینجاست.",
    ourOffices: "دفاتر ما",
    hq: "دفتر مرکزی",
    regionalHub: "شعبه منطقه‌ای",
    globalOffice: "دفتر بین‌المللی",
    getInTouch: "در تماس باشید",
    supportEmail: "ایمیل پشتیبانی",
    generalInquiry: "استعلام عمومی",
    callUs: "تماس بگیرید",
    whatsappUs: "واتس‌اپ ما",
    workingHours: "ساعات کاری",
    hoursDesc: "شنبه - پنجشنبه، ۸:۰۰ صبح - ۵:۰۰ عصر",
    viewOnMap: "نمایش روی نقشه",
    faqTitle: "سوالات متداول",

    partnersTitle: "همکاری‌های استراتژیک",
    partnersDesc: "قدرت بخشیدن به زیرساخت‌های دیجیتال موسسات پیشرو افغانستان.",
    testimonialsTitle: "نظرات مشتریان ما",
    testimonialsSubtitle: "مورد اعتماد بیش از ۵۰۰ کسب‌وکار، از استارتاپ‌ها تا وزارتخانه‌های دولتی.",

    theme: "تم",
    light: "روشن",
    dark: "تاریک",

    ftProduct: "محصول",
    ftPlatform: "پلتفرم",
    ftSupport: "پشتیبانی",
    ftCompany: "شرکت",
    ftFeatures: "ویژگی‌ها",
    ftSecurity: "امنیت",
    ftTeam: "تیم",
    ftAPI: "API توسعه‌دهندگان",
    ftPartners: "شرکا",
    ftDocs: "مستندات",
    ftCommunity: "انجمن",
    ftAbout: "درباره ما",
    ftCareers: "فرصت‌های شغلی",
    ftTerms: "قوانین",
    ftPrivacy: "حریم خصوصی",
    ftSitemap: "نقشه سایت",

    // Dynamic Data
    servicesList: servicesFa,
    blogPosts: postsFa,
    contactFaqs: faqsFa,
    branches: branchesFa,
    webDemos: demosFa,
    testimonialsList: testimonialsFa
  },
  ps: {
    ...baseEn,
    brandName: "ظبه سافت",
    home: "کور پاڼه",
    services: "حل لارې",
    dashboard: "ډشبورډ",
    blog: "بلاګ",
    contactNav: "اړیکه",
    login: "سیستم ته ننوتل",
    logout: "وتل",
    
    // ... (previous ps translations)

    // Updated Web Solutions Translations
    webHeroTitle: "خپله ویب پاڼه همدا اوس جوړه کړئ",
    webHeroSubtitle: "د لوړ فعالیت شرکت سایټونو څخه تر پیچلو ویب غوښتنلیکونو پورې، موږ داسې حلونه رامینځته کوو چې وده هڅوي. نن ورځ زموږ د ټولو کڅوړو سره پیل کړئ.",
    
    // Stats
    statClients: "سازمانی پیرودونکي",
    statUptime: "د فعال وخت تضمین",
    statDelivery: "اوسط تحویل",
    statSupport: "ملاتړ",

    // Packages
    webPackagesTitle: "د ویب ټولې کڅوړې",
    webPackagesDesc: "هرڅه چې تاسو آنلاین ترلاسه کولو ته اړتیا لرئ. کوربه توب، ډومین، او رسمي بریښنالیکونه شامل دي.",
    pkgStarter: "د پیل کڅوړه",
    pkgBusiness: "مسلکي کڅوړه",
    pkgEnterprise: "د تشبث حل",
    pkgIncluded: "هرڅه شامل دي:",

    // ... (rest of ps translations)
    register: "نوم لیکنه",
    createAccount: "حساب جوړ کړئ",
    confirmPassword: "پټنوم تایید کړئ",
    alreadyHaveAccount: "حساب لرئ؟",
    dontHaveAccount: "نوی یاست؟",
    termsAgree: "د حساب په جوړولو سره، تاسو موافق یاست",
    authTitle: "ظبه سافت ته ننوتل",
    authDesc: "خپل کوربه توب، بریښنالیکونه او حل لارې اداره کړئ.",
    passForgot: "پټنوم مو هیر شوی؟",
    authFooterTerms: "شرایط",
    authFooterPrivacy: "محرمیت",
    authFooterSecurity: "امنیت",
    authFooterContact: "د ملاتړ سره اړیکه",

    navWeb: "ویب ډیزاین",
    navHosting: "کوربه توب",
    navEmails: "رسمي بریښنالیک",
    navSolutions: "محصولات",

    heroTitle: "د افغانستان د ډیجیټل راتلونکي لپاره هوښیار پلیټ فارم",
    heroSubtitle: "ظبه سافت دولتي ادارې او خصوصي شرکتونه د خوندي کوربه توب، رسمي بریښنالیکونو او ویب حلونو سره پیاوړي کوي.",
    exploreServices: "جوړول پیل کړئ",
    clientPortal: "د پیرودونکي ننوتل",
    trustedBy: "په سیمه کې د مخکښو شرکتونو لخوا باوري",
    
    sec1Title: "د ویب زیربنا او کوربه توب",
    sec1Desc: "د نړیوالې کچې غوښتنلیکونه او مسلکي بریښنالیک سیسټمونه زموږ د مطلوب سیسټمونو سره ځای په ځای کړئ.",
    sec2Title: "خوندي ډیټابیس",
    sec2Desc: "د اتوماتیک نقل او بیک اپ سره د ډیټا ثبات.",
    sec3Title: "د بوټ اتومات کول",
    sec3Desc: "د هوښیار ټیلیګرام او واټس اپ استازو سره د پیرودونکي ملاتړ ساده کړئ.",
    
    readyToUpgrade: "ایا تاسو خپل سوداګرۍ ګړندۍ کولو ته چمتو یاست؟",
    joinHundreds: "نن ورځ د هغه سازمانونو سره یوځای شئ چې خپل فعالیتونه بدلوي.",
    contactSales: "د پلور سره اړیکه",
    search: "لټون...",
    
    solutions: "بازار ځای",
    choosePackage: "ستاسو په سازمان کې د ګمارلو لپاره یوه حل لاره غوره کړئ.",
    startingAt: "پیل له",
    purchaseNow: "اوس ځای په ځای کړئ",
    checkout: "تادیه",
    total: "د تادیې وړ مقدار",
    selectPayment: "د تادیې طریقه",
    
    accountRequired: "حساب ته اړتیا ده",
    loginToOrder: "د جوازونو اداره کولو او د دې امر تعقیب لپاره، مهرباني وکړئ لاسلیک وکړئ یا یو حساب جوړ کړئ.",
    hessabPayDesc: "سمدستي افغانۍ تادیه",
    stripeDesc: "خوندي نړیواله تادیه",
    sslSecure: "د SSL سره خوندي او کوډ شوی",

    welcomeBack: "ښه راغلاست",
    activeServices: "فعال خدمتونه",
    recentOrders: "د بلینګ تاریخ",
    spendingOverview: "کارول او لګښت",
    openTickets: "د ملاتړ غوښتنې",
    totalSpent: "ټوله پانګه اچونه",
    status: "حالت",
    action: "کنټرولونه",
    viewKey: "کیلي ښکاره کړئ",
    orderId: "د امر پیژند",
    
    email: "بریښنالیک پته",
    password: "پټنوم",
    signIn: "پورټل ته ننوتل",
    contact: "د پلور سره اړیکه",
    integrations: "د API اسناد",

    chatSuggestions: "وړاندیزونه:",
    sugPricing: "بیې؟",
    sugSupport: "ملاتړ",
    sugServices: "خدمتونه",
    chatContact: "له لارې اړیکه:",
    chatDisclaimer: "AI ځواکمن. مهم معلومات تایید کړئ.",
    typeMessage: "یو پیغام ولیکئ...",

    webDemosTitle: "ځانګړي شوي پروژې او ډیموګانې",
    webDemosDesc: "زموږ وروستي کار او موجود ټیمپلیټونه وپلټئ.",
    webProcess: "زموږ د پراختیا پروسه",
    webFormTitle: "خپله پروژه پیل کړئ",
    webFormSubtitle: "موږ ته د خپلو اهدافو په اړه ووایاست. موږ به په 24 ساعتونو کې د وړاندیز سره بیرته تاسو ته راشو.",
    viewDemo: "ژوندۍ ډیمو وګورئ",
    closeDemo: "مخکتنه بند کړئ",
    
    officialHeroTitle: "خپل ډیجیټل پیژند خوندي کړئ",
    officialHeroSubtitle: "د افغان سوداګرۍ لپاره مسلکي بریښنالیک پتې (تاسو@ستاسو_شرکت.com) او د ډومین ثبتولو خدمات.",
    officialBtnCheck: "د شتون چیک کول",
    officialBtnPlans: "پلانونه وګورئ",
    domainCheckTitle: "خپل مناسب ډومین ومومئ",
    domainCheckDesc: "د .com, .af, .net او نورو لپاره لټون وکړئ. سمدستي ثبت شتون لري.",
    domainPlaceholder: "example.com",
    domainAvailable: "شتون لري!",
    domainTaken: "دمخه نیول شوی.",
    domainSearch: "لټون",
    planStarter: "پیل کونکی",
    planPro: "مسلکي",
    planEnterprise: "تشبث",
    planBtn: "پلان غوره کړئ",
    emailPlansTitle: "د بریښنالیک کوربه توب کڅوړې",
    claimNow: "اوس ترلاسه کړئ",

    hostingHeroTitle: "د لوړ فعالیت کلاوډ کوربه توب",
    hostingHeroSubtitle: "ستاسو د سوداګرۍ لپاره د اعتماد وړ، خوندي، او ګړندي کوربه توب حلونه. په کال کې یوازې $ 59 ډالرو څخه پیل کیږي.",
    hostingBtnPlans: "د کوربه توب پلانونه وګورئ",
    hostingFeature1Title: "99.9% فعال وخت",
    hostingFeature1Desc: "موږ تضمین کوو چې ستاسو سایټ آنلاین پاتې کیږي.",
    hostingFeature2Title: "وړیا SSL",
    hostingFeature2Desc: "خپل سایټ خوندي کړئ او د SEO درجه بندي ته وده ورکړئ.",
    hostingFeature3Title: "24/7 ملاتړ",
    hostingFeature3Desc: "زموږ مسلکي ټیم تل د مرستې لپاره دلته دی.",
    hostingPlanBasic: "لومړنی کوربه توب",
    hostingPlanBusiness: "د سوداګرۍ کوربه توب",
    hostingPlanPremium: "پریمیم کلاوډ",
    secureHosting: "خپل کوربه توب خوندي کړئ",
    setupMsg: "د تادیې تایید وروسته سمدستي تنظیم",
    domainOptional: "د ډومین نوم (اختیاری)",
    completeOrder: "امر بشپړ کړئ",
    processing: "د پروسس په حال کې...",

    featStorage: "ذخیره کول",
    featEmails: "بریښنالیک حسابونه",
    featWebsites: "ویب پاڼې",
    featSSL: "وړیا SSL سند",
    featSupport: "24/7 ملاتړ",
    featBackups: "ورځنی بیک اپ",
    featPrioritySupport: "لومړیتوب ملاتړ",
    featNVMe: "لامحدود NVMe ذخیره",
    featDedIP: "وقف شوی IP",
    featSecurity: "پرمختللی امنیت",
    featSpam: "د سپیم محافظت",
    featWebmail: "ویب میل لاسرسی",
    featDomain: "وړیا ډومین (.com)",
    featDesign: "ځواب ویونکی ډیزاین",
    featSEO: "لومړنی SEO",

    bestValue: "غوره ارزښت",
    mostPopular: "خورا مشهور",

    orderReceived: "امر ترلاسه شو!",
    orderReceivedMsg: "موږ ستاسو غوښتنه ترلاسه کړې. زموږ ټیم به ژر تاسو سره اړیکه ونیسي.",
    submitAnother: "بله غوښتنه وسپارئ",
    newOrder: "نوی امر",

    lblFullName: "پوره نوم",
    lblCompany: "د شرکت نوم",
    lblEmail: "بریښنالیک پته",
    lblPhone: "د تلیفون شمیره",
    lblProjectType: "د پروژې ډول",
    lblBudget: "اټکل شوې بودیجه",
    lblDescription: "د پروژې توضیحات",
    lblSubject: "موضوع",
    lblMessage: "پیغام",
    btnSubmit: "د نرخ غوښتنه",
    btnSendMessage: "پیغام واستوئ",

    optEcommerce: "آنلاین پلورنځی",
    optCorporate: "شرکتی ویب پاڼه",
    optWebApp: "ویب غوښتنلیک / SaaS",
    optLanding: "د لینډینګ پاڼه",
    optOther: "نور / دودیز",

    budgetLow: "له ۱۰۰۰ ډالرو څخه کم",
    budgetMedium: "۱۰۰۰ - ۵۰۰۰ ډالر",
    budgetHigh: "۵۰۰۰ - ۱۰،۰۰۰ ډالر",
    budgetEnterprise: "۱۰،۰۰۰ ډالر+",

    blogHeroTitle: "لید او خبرونه",
    blogHeroSubtitle: "د ظبه سافت انجینرۍ ټیم څخه وروستي خبرونه، ټیکنالوژي او سرچینې.",
    readMore: "مقاله ولولئ",
    featuredPost: "ځانګړی شوی",
    latestPosts: "وروستي مقالې",
    relatedPosts: "اړوند مقالې",
    sharePost: "شریکول",
    writtenBy: "لیکونکی",
    backToBlog: "بېرته بلاګ ته",

    contactHeroTitle: "راځئ چې یو څه عالي جوړ کړو",
    contactHeroSubtitle: "که تاسو د ګمرک سوداګرۍ حل، رسمي بریښنالیکونو یا تخنیکي ملاتړ ته اړتیا لرئ، زموږ ټیم دلته دی.",
    ourOffices: "زموږ دفترونه",
    hq: "مرکزي دفتر",
    regionalHub: "سیمه ایز دفتر",
    globalOffice: "نړیوال دفتر",
    getInTouch: "اړیکه ونیسئ",
    supportEmail: "د ملاتړ بریښنالیک",
    generalInquiry: "عمومي پوښتنه",
    callUs: "موږ ته زنګ ووهئ",
    whatsappUs: "واټس اپ",
    workingHours: "کاري ساعتونه",
    hoursDesc: "شنبه - پنجشنبه، 8:00 AM - 5:00 PM",
    viewOnMap: "په نقشه کې وګورئ",
    faqTitle: "په مکرر ډول پوښتل شوي پوښتنې",

    partnersTitle: "ستراتیژیکې همکارۍ",
    partnersDesc: "د افغانستان د مخکښو ادارو ډیجیټل زیربنا پیاوړي کول.",
    testimonialsTitle: "زموږ پیرودونکي څه وايي",
    testimonialsSubtitle: "د ۵۰۰ څخه زیاتو سوداګریو لخوا باوري، له سټارټ اپ څخه تر دولتي وزارتونو پورې.",

    theme: "تم",
    light: "روښانه",
    dark: "تور",

    ftProduct: "محصول",
    ftPlatform: "پلیټ فارم",
    ftSupport: "ملاتړ",
    ftCompany: "شرکت",
    ftFeatures: "ځانګړتیاوې",
    ftSecurity: "امنیت",
    ftTeam: "ټیم",
    ftAPI: "د پراختیا کونکي API",
    ftPartners: "شریکان",
    ftDocs: "اسناد",
    ftCommunity: "ټولنه",
    ftAbout: "زموږ په اړه",
    ftCareers: "دندې",
    ftTerms: "شرایط",
    ftPrivacy: "محرمیت",
    ftSitemap: "د سایټ نقشه",

    servicesList: servicesPs,
    blogPosts: postsPs,
    contactFaqs: faqsPs,
    branches: branchesPs,
    webDemos: demosPs,
    testimonialsList: testimonialsPs
  }
};

export const getTranslation = (lang: Language) => translations[lang];
