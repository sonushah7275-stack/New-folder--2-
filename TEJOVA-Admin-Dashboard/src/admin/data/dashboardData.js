export const dashboardStats = [
  {
    id: "revenue",
    title: "Revenue",
    value: "$48,920",
    change: "+12.8%",
    comparison: "vs last month",
    trend: "up",
    icon: "TrendingUp",
    sparkline: [20, 25, 22, 30, 28, 35, 42, 38, 45, 43, 40, 48.9],
  },
  {
    id: "orders",
    title: "Orders",
    value: "1,284",
    change: "+8.4%",
    comparison: "vs last month",
    trend: "up",
    icon: "ShoppingBag",
    sparkline: [12, 15, 14, 18, 17, 22, 24, 21, 26, 28, 25, 30],
  },
  {
    id: "products",
    title: "Products",
    value: "126",
    change: "+6",
    comparison: "new this month",
    trend: "up",
    icon: "Inventory2",
    sparkline: [100, 104, 106, 110, 112, 115, 118, 120, 122, 124, 125, 126],
  },
  {
    id: "customers",
    title: "Customers",
    value: "8,642",
    change: "+14.2%",
    comparison: "vs last month",
    trend: "up",
    icon: "People",
    sparkline: [40, 45, 48, 52, 58, 62, 68, 72, 78, 80, 82, 86.4],
  },
];

export const revenueData = [
  { month: "Jan", revenue: 10, orders: 8 },
  { month: "Feb", revenue: 20, orders: 12 },
  { month: "Mar", revenue: 18, orders: 11 },
  { month: "Apr", revenue: 22, orders: 14 },
  { month: "May", revenue: 29, orders: 18 },
  { month: "Jun", revenue: 38, orders: 20 },
  { month: "Jul", revenue: 27, orders: 16 },
  { month: "Aug", revenue: 32, orders: 21 },
  { month: "Sep", revenue: 40, orders: 24 },
  { month: "Oct", revenue: 43, orders: 26 },
  { month: "Nov", revenue: 30, orders: 19 },
  { month: "Dec", revenue: 48, orders: 32 },
];

export const recentActivity = [
  {
    id: 1,
    title: "New product added",
    description: "Vitality Tonic",
    timestamp: "10 minutes ago",
    type: "product",
  },
  {
    id: 2,
    title: "New customer registered",
    description: "Emma Wilson",
    timestamp: "32 minutes ago",
    type: "customer",
  },
  {
    id: 3,
    title: "Order completed",
    description: "#TJ-10281",
    timestamp: "1 hour ago",
    type: "order",
  },
  {
    id: 4,
    title: "Journal published",
    description: "Building Better Daily Rituals",
    timestamp: "2 hours ago",
    type: "journal",
  },
];

export const recentOrders = [
  {
    id: "#TJ-10284",
    customer: "Emma Wilson",
    date: "Sep 14, 2026",
    product: "Vitality Tonic",
    amount: "$148",
    payment: "Paid",
    status: "Completed",
  },
  {
    id: "#TJ-10283",
    customer: "Olivia Martin",
    date: "Sep 14, 2026",
    product: "Earth Ritual Serum",
    amount: "$72",
    payment: "Paid",
    status: "Processing",
  },
  {
    id: "#TJ-10282",
    customer: "Sophia Brown",
    date: "Sep 13, 2026",
    product: "Daily Nourish",
    amount: "$117",
    payment: "Paid",
    status: "Completed",
  },
  {
    id: "#TJ-10281",
    customer: "Amelia Davis",
    date: "Sep 13, 2026",
    product: "Restore & Renew",
    amount: "$55",
    payment: "Pending",
    status: "Pending",
  },
];

export const topProducts = [
  {
    id: 1,
    name: "Vitality Tonic",
    price: "$48",
    salesCount: "248 sales",
    percentage: 78,
    image:
      "https://images.unsplash.com/photo-1608248597263-0057e17b43f4?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 2,
    name: "Earth Ritual Serum",
    price: "$72",
    salesCount: "194 sales",
    percentage: 62,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 3,
    name: "Daily Nourish",
    price: "$39",
    salesCount: "176 sales",
    percentage: 54,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 4,
    name: "Restore & Renew",
    price: "$55",
    salesCount: "143 sales",
    percentage: 42,
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=200&q=80",
  },
];

export const quickActions = [
  { id: 1, label: "Add Product", icon: "Add", action: "add_product" },
  {
    id: 2,
    label: "Create Journal Article",
    icon: "Article",
    action: "create_journal",
  },
  { id: 3, label: "Add Category", icon: "Category", action: "add_category" },
  { id: 4, label: "View Orders", icon: "ShoppingBag", action: "view_orders" },
];

export const navItems = {
  main: [
    { name: "Dashboard", icon: "Dashboard", path: "/" },
    { name: "Products", icon: "Inventory2", path: "/products" },
    { name: "Categories", icon: "Category", path: "/categories" },
    { name: "Orders", icon: "ShoppingBag", path: "/orders" },
    { name: "Customers", icon: "People", path: "/customers" },
    { name: "Journal", icon: "MenuBook", path: "/journal" },
    { name: "Pillars", icon: "BarChart", path: "/pillars" },
    { name: "Newsletter", icon: "Mail", path: "/newsletter" },
    { name: "Media", icon: "PermMedia", path: "/media" },
  ],
  secondary: [
    { name: "Content", icon: "EditNote", path: "/content" },
    { name: "Settings", icon: "Settings", path: "/settings" },
  ],
};
