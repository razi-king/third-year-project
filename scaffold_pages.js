const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');
const pagesDir = path.join(srcDir, 'pages');

const pages = {
  customer: [
    'Wishlist', 'Orders', 'Reviews', 'Profile', 'Settings'
  ],
  vendor: [
    'VendorProducts', 'AddProduct', 'VendorOrders', 'Customers', 
    'Reports', 'Messages', 'StoreProfile', 'Settings'
  ],
  admin: [
    'Users', 'Vendors', 'AdminProducts', 'AdminOrders', 
    'Analytics', 'Reports', 'Security', 'Approvals', 
    'Disputes', 'Messages', 'Settings'
  ]
};

const generateTemplate = (name, role) => {
  const layout = role === 'vendor' ? 'VendorLayout' 
               : role === 'admin' ? 'AdminLayout' 
               : 'CustomerLayout';
  return `import { ${layout} } from "@/components/layout/${layout}";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ${name} = () => {
  return (
    <${layout}>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold">${name}</h1>
        <Card>
          <CardHeader>
            <CardTitle>${name} Page</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This is a functional placeholder for the ${name} page. Data integration pending.</p>
          </CardContent>
        </Card>
      </div>
    </${layout}>
  );
};

export default ${name};
`;
};

for (const [role, rolePages] of Object.entries(pages)) {
  const roleDir = path.join(pagesDir, role);
  if (!fs.existsSync(roleDir)) {
    fs.mkdirSync(roleDir, { recursive: true });
  }
  
  for (const page of rolePages) {
    const filePath = path.join(roleDir, `${page}.tsx`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, generateTemplate(page, role));
      console.log(`Created ${filePath}`);
    } else {
      console.log(`Skipped ${filePath} (already exists)`);
    }
  }
}

console.log('All missing pages scaffolded successfully.');
