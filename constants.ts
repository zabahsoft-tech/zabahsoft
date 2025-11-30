import { Service, ServiceType } from './types';

export const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    name: "Corporate Website Package",
    description: "A professional, responsive website designed to establish a strong digital presence for your business.",
    type: ServiceType.WEB,
    price_afn: 25000,
    price_usd: 350,
    features: ["Responsive Design", "CMS Integration", "SEO Optimization", "1 Year Hosting"],
    icon: "fas fa-laptop-code",
    specs: [
      { label: "Stack", value: "React / Laravel" },
      { label: "Delivery", value: "2 Weeks" },
      { label: "Support", value: "3 Months Free" },
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