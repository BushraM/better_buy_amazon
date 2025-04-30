// Function to extract product information from Amazon page
function extractProductInfo() {
  const productInfo = {
    title: '',
    price: '',
    asin: '',
    seller: '',
    url: window.location.href
  };

  // Extract ASIN from URL
  const asinMatch = window.location.pathname.match(/\/dp\/([A-Z0-9]{10})/);
  if (asinMatch) {
    productInfo.asin = asinMatch[1];
  }

  // Extract title
  const titleElement = document.getElementById('productTitle');
  if (titleElement) {
    productInfo.title = titleElement.textContent.trim();
  }

  // Extract price
  const priceElement = document.getElementById('priceblock_ourprice') || 
                      document.getElementById('priceblock_dealprice') ||
                      document.querySelector('.a-price .a-offscreen');
  if (priceElement) {
    productInfo.price = priceElement.textContent.trim();
  }

  // Extract seller
  const sellerElement = document.getElementById('sellerProfileTriggerId') ||
                       document.querySelector('#merchant-info a');
  if (sellerElement) {
    productInfo.seller = sellerElement.textContent.trim();
  }

  return productInfo;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getProductInfo') {
    const productInfo = extractProductInfo();
    sendResponse(productInfo);
  }
});

// Notify background script when page is loaded
chrome.runtime.sendMessage({
  action: 'pageLoaded',
  productInfo: extractProductInfo()
}); 