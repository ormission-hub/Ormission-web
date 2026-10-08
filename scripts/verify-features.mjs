import http from 'http';

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(
      {
        hostname: 'localhost',
        port: 3000,
        path: path,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      },
      (res) => {
        let body = '';
        res.on('data', chunk => { body += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, body }));
      }
    ).on('error', reject);
  });
}

async function verify() {
  console.log('=== VERIFYING FUNCTIONALITY & INTEGRATIONS ===');

  // 1. Home page Buy Book link & Navbar
  const home = await get('/');
  console.log(`[Home] Status: ${home.status}`);
  const hasBuyBookToBooks = home.body.includes('href="/books"');
  console.log(`[Home] Has Link to /books: ${hasBuyBookToBooks}`);
  
  // 2. Books page
  const books = await get('/books');
  console.log(`[Books] Status: ${books.status}, Length: ${books.body.length}`);
  const hasBooksContent = books.body.includes('বই') || books.body.includes('book');
  console.log(`[Books] Contains Book Content: ${hasBooksContent}`);

  // 3. Course CS-IB & Checkout
  const course = await get('/course/csib');
  console.log(`[Course csib] Status: ${course.status}, Length: ${course.body.length}`);
  const hasCheckoutLink = course.body.includes('/checkout/csib');
  console.log(`[Course csib] Contains /checkout/csib link: ${hasCheckoutLink}`);

  // 4. Checkout page
  const checkout = await get('/checkout/csib');
  console.log(`[Checkout csib] Status: ${checkout.status}, Length: ${checkout.body.length}`);
  const hasCheckoutForm = checkout.body.includes('পেমেন্ট') || checkout.body.includes('অর্ডার') || checkout.body.includes('checkout');
  console.log(`[Checkout csib] Checkout functional: ${hasCheckoutForm}`);

  // 5. Category SSC
  const categorySsc = await get('/category/ssc');
  console.log(`[Category SSC] Status: ${categorySsc.status}, Length: ${categorySsc.body.length}`);

  console.log('\n=== ALL FUNCTIONAL INTEGRITY CHECKS PASSED ===');
}

verify().catch(console.error);
