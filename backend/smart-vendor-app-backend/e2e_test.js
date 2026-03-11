const axios = require('axios');

const API_URL = 'http://localhost:9090/api';

async function runTests() {
  console.log('--- STARTING E2E API VERIFICATION ---');
  let vendorToken, customerToken, adminToken;
  let productId;

  try {
    // 1. Register a Vendor
    console.log('[1] Registering Vendor...');
    const vendorEmail = `vendor${Date.now()}@test.com`;
    const vendorRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test Vendor',
      email: vendorEmail,
      password: 'password123',
      role: 'VENDOR'
    });
    console.log('Vendor Registered:', vendorRes.data.message);

    // 2. Login Vendor
    console.log('[2] Logging in Vendor...');
    const vendorLogin = await axios.post(`${API_URL}/auth/login`, {
      email: vendorEmail,
      password: 'password123'
    });
    vendorToken = vendorLogin.data.token;
    console.log('Vendor Logged In. Token received.');

    // 3. Add a Product
    console.log('[3] Adding Product...');
    const productRes = await axios.post(`${API_URL}/vendor/products`, {
      name: 'Test E2E Product',
      description: 'A product created by automated testing',
      price: 99.99,
      stockQuantity: 10,
      imageUrl: 'http://example.com/image.png'
    }, { headers: { Authorization: `Bearer ${vendorToken}` } });
    productId = productRes.data.id;
    console.log('Product Created with ID:', productId);

    // 4. Register a Customer
    console.log('[4] Registering Customer...');
    const customerEmail = `customer${Date.now()}@test.com`;
    const customerRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test Customer',
      email: customerEmail,
      password: 'password123',
      role: 'CUSTOMER'
    });
    console.log('Customer Registered:', customerRes.data.message);

    // 5. Login Customer
    console.log('[5] Logging in Customer...');
    const customerLogin = await axios.post(`${API_URL}/auth/login`, {
      email: customerEmail,
      password: 'password123'
    });
    customerToken = customerLogin.data.token;
    console.log('Customer Logged In. Token received.');

    // 6. Add to Cart
    console.log('[6] Adding Product to Cart...');
    await axios.post(`${API_URL}/cart`, {
      productId: productId,
      quantity: 2
    }, { headers: { Authorization: `Bearer ${customerToken}` } });
    console.log('Product added to cart.');

    // 7. Checkout (Create Order)
    console.log('[7] Proceeding to Checkout...');
    const orderRes = await axios.post(`${API_URL}/orders`, {}, { 
      headers: { Authorization: `Bearer ${customerToken}` } 
    });
    console.log('Order Successfully Created! ID:', orderRes.data.id);

    // 8. Admin Fetch All Orders
    console.log('[8] Registering/Logging in Admin to Verify Global Data...');
    // We assume the system has an admin or we just make one.
    const adminEmail = `admin${Date.now()}@test.com`;
    await axios.post(`${API_URL}/auth/register`, {
      name: 'Test Admin',
      email: adminEmail,
      password: 'password123',
      role: 'ADMIN'
    });
    const adminLogin = await axios.post(`${API_URL}/auth/login`, {
      email: adminEmail,
      password: 'password123'
    });
    adminToken = adminLogin.data.token;
    
    const allOrdersResponse = await axios.get(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`Admin verified system has ${allOrdersResponse.data.content.length} orders total.`);

    console.log('--- ALL E2E API TESTS PASSED SUCCESSFULLY! ---');
  } catch (err) {
    console.error('!!! TEST FAILED !!!');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
}

runTests();
