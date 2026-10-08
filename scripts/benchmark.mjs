import http from 'http';

const routes = [
  '/',
  '/category/ssc',
  '/category/hsc',
  '/courses',
  '/course/csib',
  '/books',
  '/books/book-1'
];

function measure(path) {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const req = http.get(
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
        let firstByte = null;
        let body = '';
        res.on('data', (chunk) => {
          if (!firstByte) firstByte = performance.now() - start;
          body += chunk;
        });
        res.on('end', () => {
          const total = performance.now() - start;
          resolve({
            statusCode: res.statusCode,
            ttfb: Math.round(firstByte || total),
            totalDuration: Math.round(total),
            contentLength: body.length,
            bodySnippet: body.slice(0, 300),
            hasBuyBookLink: body.includes('/books'),
            hasCourses: body.includes('course') || body.includes('কোর্স'),
            hasBookData: body.includes('book-1') || body.includes('বই')
          });
        });
      }
    );
    req.on('error', reject);
  });
}

async function run() {
  console.log('=== RUNNING AFTER-FIX MEASUREMENTS ===');
  const results = {};

  for (const route of routes) {
    results[route] = [];
    console.log(`\nMeasuring ${route}...`);
    for (let i = 0; i < 4; i++) {
      const res = await measure(route);
      results[route].push(res);
      console.log(`  Run ${i + 1}: status=${res.statusCode}, TTFB=${res.ttfb}ms, Total=${res.totalDuration}ms, Size=${res.contentLength} bytes`);
      // Short delay between requests
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log('\n=== SUMMARY TABLE ===');
  console.log('Route | Run 1 (Cold) | Run 2-4 Avg (Warm) | Status | Size');
  console.log('---|---|---|---|---');
  for (const route of routes) {
    const runs = results[route];
    const cold = runs[0].totalDuration;
    const warmAvg = Math.round((runs[1].totalDuration + runs[2].totalDuration + runs[3].totalDuration) / 3);
    const size = runs[0].contentLength;
    const status = runs[0].statusCode;
    console.log(`${route} | ${cold}ms | ${warmAvg}ms | ${status} | ${size} B`);
  }
}

run().catch(console.error);
