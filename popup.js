document.addEventListener('DOMContentLoaded', async () => {
  const productInfo = document.getElementById('product-info');
  const noProduct = document.getElementById('no-product');
  const productTitle = document.getElementById('product-title');
  const currentPrice = document.getElementById('current-price');
  const bestPrice = document.getElementById('best-price');
  const sellerName = document.getElementById('seller-name');
  const trackBtn = document.getElementById('track-btn');
  const compareBtn = document.getElementById('compare-btn');
  const trackedList = document.getElementById('tracked-list');

  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Check if we're on an Amazon product page
  if (tab.url.includes('amazon.com') || tab.url.includes('amazon.co.uk')) {
    // Get product info from content script
    chrome.tabs.sendMessage(tab.id, { action: 'getProductInfo' }, (response) => {
      if (response && response.asin) {
        productInfo.classList.remove('hidden');
        noProduct.classList.add('hidden');
        
        productTitle.textContent = response.title;
        currentPrice.textContent = response.price;
        sellerName.textContent = response.seller;

        // Check if item is already tracked
        chrome.storage.local.get(['trackedItems'], (result) => {
          const trackedItems = result.trackedItems || {};
          if (trackedItems[response.asin]) {
            trackBtn.textContent = 'Stop Tracking';
            trackBtn.classList.add('tracking');
          }
        });

        // Load tracked items
        loadTrackedItems();
      } else {
        productInfo.classList.add('hidden');
        noProduct.classList.remove('hidden');
      }
    });
  } else {
    productInfo.classList.add('hidden');
    noProduct.classList.remove('hidden');
  }

  // Track button click handler
  trackBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'getProductInfo' }, (response) => {
      if (response && response.asin) {
        chrome.storage.local.get(['trackedItems'], (result) => {
          const trackedItems = result.trackedItems || {};
          
          if (trackedItems[response.asin]) {
            // Stop tracking
            delete trackedItems[response.asin];
            trackBtn.textContent = 'Track This Item';
            trackBtn.classList.remove('tracking');
          } else {
            // Start tracking
            trackedItems[response.asin] = {
              ...response,
              lastChecked: new Date().toISOString()
            };
            trackBtn.textContent = 'Stop Tracking';
            trackBtn.classList.add('tracking');
          }

          chrome.storage.local.set({ trackedItems }, () => {
            loadTrackedItems();
          });
        });
      }
    });
  });

  // Compare button click handler
  compareBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'getProductInfo' }, (response) => {
      if (response && response.asin) {
        // Open comparison page in new tab
        chrome.tabs.create({
          url: `https://www.amazon.com/gp/offer-listing/${response.asin}`
        });
      }
    });
  });
});

// Load and display tracked items
function loadTrackedItems() {
  const trackedList = document.getElementById('tracked-list');
  
  chrome.storage.local.get(['trackedItems'], (result) => {
    const trackedItems = result.trackedItems || {};
    trackedList.innerHTML = '';

    Object.entries(trackedItems).forEach(([asin, item]) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'tracked-item';
      itemElement.innerHTML = `
        <div class="item-info">
          <div class="title">${item.title}</div>
          <div class="price">${item.price}</div>
        </div>
        <div class="remove" data-asin="${asin}">×</div>
      `;
      trackedList.appendChild(itemElement);
    });

    // Add remove handlers
    document.querySelectorAll('.remove').forEach(button => {
      button.addEventListener('click', (e) => {
        const asin = e.target.dataset.asin;
        chrome.storage.local.get(['trackedItems'], (result) => {
          const trackedItems = result.trackedItems || {};
          delete trackedItems[asin];
          chrome.storage.local.set({ trackedItems }, () => {
            loadTrackedItems();
          });
        });
      });
    });
  });
} 