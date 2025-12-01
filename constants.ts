
import { Service, ServiceType, BlogPost } from './types';

export const MOCK_SERVICES: Service[] = [
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

export const MOCK_ORDERS = [
  {
    id: "ORD-2023-8821",
    service_id: 1,
    service_name: "Corporate Website Package",
    status: 'completed',
    payment_method: 'hessabpay',
    amount_paid: "25,000 AFN",
    date: "2023-10-15",
    license_key: "ZBH-WEB-9928-XA"
  },
  {
    id: "ORD-2023-9912",
    service_id: 4,
    service_name: "POS Software License",
    status: 'pending',
    payment_method: 'stripe',
    amount_paid: "$200.00",
    date: "2023-10-28"
  }
];

export const MOCK_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "fintech-afghanistan-hessabpay",
    title: "The Rise of Fintech in Afghanistan: How Digital Payments are Changing Business",
    excerpt: "Exploring the integration of HessabPay and Stripe in local commerce, and how ZabahSoft bridges the gap for international trade.",
    content: `
      <p class="mb-4">Afghanistan's financial landscape is undergoing a rapid transformation. With the adoption of mobile money solutions like <strong>HessabPay</strong>, small businesses are moving away from cash-only operations to digital record-keeping.</p>
      <h2 class="text-2xl font-bold mb-4 mt-8 text-gray-900 dark:text-white">Why Digital?</h2>
      <p class="mb-4">Digital transactions offer security, traceability, and ease of access. For a long time, the lack of banking infrastructure hindered growth. Now, APIs allow developers to integrate payment gateways directly into websites.</p>
      <p class="mb-4">At ZabahSoft, we have integrated HessabPay into our <em>E-Commerce Package</em>, allowing vendors to accept AFN payments instantly.</p>
      <h2 class="text-2xl font-bold mb-4 mt-8 text-gray-900 dark:text-white">The Technical Challenge</h2>
      <p class="mb-4">Integrating these systems requires secure handling of webhooks and tokens. Our team uses Laravel to ensure that every transaction is verified before a product is released.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1200",
    author: {
      name: "Ahmad Fawad",
      avatar: "https://ui-avatars.com/api/?name=Ahmad+Fawad&background=0D8ABC&color=fff",
      role: "Lead Engineer"
    },
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
    content: `
      <p class="mb-4">The debate between traditional server-side rendering and modern SPAs (Single Page Applications) is common. For many Afghan enterprises, SEO is key, which historically favored server-side rendering.</p>
      <h2 class="text-2xl font-bold mb-4 mt-8 text-gray-900 dark:text-white">The Headless Approach</h2>
      <p class="mb-4">By using Laravel as an API provider and React for the interface, we get the best of both worlds. Fast, interactive user experiences with a robust, secure backend.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200",
    author: {
      name: "Sarah Karimi",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Karimi&background=e91e63&color=fff",
      role: "Frontend Architect"
    },
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
    author: {
      name: "ZabahSoft Team",
      avatar: "https://ui-avatars.com/api/?name=Zabah+Soft&background=10b981&color=fff",
      role: "Product"
    },
    category: "Business",
    tags: ["AI", "Gemini", "Automation"],
    publishedAt: "Nov 15, 2023",
    readTime: "4 min read"
  },
  {
    id: "4",
    slug: "database-security-practices",
    title: "Essential Database Security Practices for 2024",
    excerpt: "Protecting sensitive client data is non-negotiable. Learn about encryption, replication, and backup strategies.",
    content: "<p>Data breaches are costly. Here is how we secure our PostgreSQL clusters...</p>",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&q=80&w=1200",
    author: {
      name: "Ali Reza",
      avatar: "https://ui-avatars.com/api/?name=Ali+Reza&background=6366f1&color=fff",
      role: "DevOps Engineer"
    },
    category: "Tech",
    tags: ["Security", "Database", "DevOps"],
    publishedAt: "Nov 20, 2023",
    readTime: "6 min read"
  }
];
