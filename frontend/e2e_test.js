const API_URL = 'http://localhost:9090/api';

async function request(endpoint, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_URL}${endpoint}`, options);
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : await res.text();
  
  if (!res.ok) {
    throw new Error(`API Error ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function runTests() {
  console.log('--- STARTING E2E API VERIFICATION ---');
  let vendorToken, customerToken, adminToken;
  let productId;

  try {
    // 1. Register a Vendor
    console.log('[1] Registering Vendor...');
    const vendorEmail = `vendor${Date.now()}@test.com`;
    const vendorRes = await request('/auth/register', 'POST', {
      name: 'Test Vendor',
      email: vendorEmail,
      password: 'password123',
      role: 'VENDOR',
      storeName: 'E2E Vendor Store'
    });
    console.log('Vendor Registered:', vendorRes.message);

    // 2. Login Vendor
    console.log('[2] Logging in Vendor...');
    const vendorLogin = await request('/auth/login', 'POST', {
      email: vendorEmail,
      password: 'password123'
    });
    vendorToken = vendorLogin.token;
    console.log('Vendor Logged In. Token received.');

    // 3. Add a Product
    console.log('[3] Adding Product...');
    const productRes = await request('/vendor/products', 'POST', {
      name: 'Test E2E Product',
      description: 'A product created by automated testing',
      price: 99.99,
      stock: 10,
      imageUrl: 'http://example.com/image.png'
    }, vendorToken);
    productId = productRes.id;
    console.log('Product Created with ID:', productId);

    // 4. Register a Customer
    console.log('[4] Registering Customer...');
    const customerEmail = `customer${Date.now()}@test.com`;
    const customerRes = await request('/auth/register', 'POST', {
      name: 'Test Customer',
      email: customerEmail,
      password: 'password123',
      role: 'CUSTOMER'
    });
    console.log('Customer Registered:', customerRes.message);

    // 5. Login Customer
    console.log('[5] Logging in Customer...');
    const customerLogin = await request('/auth/login', 'POST', {
      email: customerEmail,
      password: 'password123'
    });
    customerToken = customerLogin.token;
    console.log('Customer Logged In. Token received.');

    // 6. Add to Cart
    console.log('[6] Adding Product to Cart...');
    await request('/cart/items', 'POST', {
      productId: productId,
      quantity: 2
    }, customerToken);
    console.log('Product added to cart.');

    // 7. Checkout (Create Order)
    console.log('[7] Proceeding to Checkout...');
    const orderRes = await request('/orders', 'POST', {
      shippingAddress: 'E2E Testing Address',
      items: [
        {
          productId: productId,
          quantity: 2,
          price: 99.99
        }
      ]
    }, customerToken);
    console.log('Order Successfully Created! ID:', orderRes.id);

    // 8. Admin Fetch All Orders
    console.log('[8] Registering/Logging in Admin to Verify Global Data...');
    const adminEmail = `admin${Date.now()}@test.com`;
    await request('/auth/register', 'POST', {
      name: 'Test Admin',
      email: adminEmail,
      password: 'password123',
      role: 'ADMIN'
    });
    const adminLogin = await request('/auth/login', 'POST', {
      email: adminEmail,
      password: 'password123'
    });
    adminToken = adminLogin.token;
    
    const allOrdersResponse = await request('/orders', 'GET', null, adminToken);
    console.log(`Admin verified system has ${allOrdersResponse.content?.length || 0} orders total.`);

    console.log('--- ALL E2E API TESTS PASSED SUCCESSFULLY! ---');
  } catch (err) {
    console.error('!!! TEST FAILED !!!\n', err.message);
  }
}

runTests();
