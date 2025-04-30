// Function to parse price string to number
function parsePrice(priceStr) {
  return parseFloat(priceStr.replace(/[^0-9.-]+/g, ''));
}

// Function to check price changes
async function checkPriceChanges() {
  const { trackedItems } = await chrome.storage.local.get(['trackedItems']);
  if (!trackedItems) return;

  for (const [asin, item] of Object.entries(trackedItems)) {
    try {
      // Fetch current price from Amazon
      const response = await fetch(`https://www.amazon.com/dp/${asin}`);
      const html = await response.text();
      
      // Extract price from HTML (simplified version - you might want to use a more robust method)
      const priceMatch = html.match(/"price":\s*"([^"]+)"/);
      if (priceMatch) {
        const currentPrice = parsePrice(priceMatch[1]);
        const previousPrice = parsePrice(item.price);

        if (currentPrice < previousPrice) {
          // Price dropped - send notification
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: 'Price Drop Alert!',
            message: `${item.title} price dropped from ${item.price} to ${priceMatch[1]}`
          });

          // Update stored price
          trackedItems[asin].price = priceMatch[1];
          trackedItems[asin].lastChecked = new Date().toISOString();
        }
      }
    } catch (error) {
      console.error(`Error checking price for ${asin}:`, error);
    }
  }

  // Save updated prices
  await chrome.storage.local.set({ trackedItems });
}

// Set up alarm for periodic price checks
chrome.alarms.create('checkPrices', {
  periodInMinutes: 60 // Check every hour
});

// Listen for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkPrices') {
    checkPriceChanges();
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'pageLoaded' && request.productInfo) {
    // Check if this product is being tracked
    chrome.storage.local.get(['trackedItems'], (result) => {
      const trackedItems = result.trackedItems || {};
      const { asin } = request.productInfo;

      if (trackedItems[asin]) {
        // Compare prices
        const currentPrice = parsePrice(request.productInfo.price);
        const trackedPrice = parsePrice(trackedItems[asin].price);

        if (currentPrice < trackedPrice) {
          // Send notification for price drop
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: 'Price Drop Alert!',
            message: `${request.productInfo.title} price dropped from ${trackedItems[asin].price} to ${request.productInfo.price}`
          });

          // Update stored price
          trackedItems[asin].price = request.productInfo.price;
          trackedItems[asin].lastChecked = new Date().toISOString();
          chrome.storage.local.set({ trackedItems });
        }
      }
    });
  }
}); 