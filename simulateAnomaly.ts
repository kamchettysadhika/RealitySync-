async function simulateOutage(i: number) {
    const baseLat = 40.007;
    const baseLng = -83.030;
    const lat = baseLat + Math.random() * 0.005;
    const lng = baseLng + Math.random() * 0.005;
  
    const payload = {
      lat,
      lng,
      detected_at: new Date().toISOString(),
      device: `meter-${100 + i}`,
      status: 'offline',
      severity: 'high'
    };
  
    await fetch('http://localhost:3000/webhook/mulesoft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  
    console.log(`Sent event ${i + 1}`);
  }
  
  (async () => {
    for (let i = 0; i < 13; i++) {
      await simulateOutage(i);
      await new Promise(r => setTimeout(r, 200));
    }
  })();
  