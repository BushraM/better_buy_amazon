# Better Buy - Amazon Price Tracker

A Chrome extension that helps you save money by tracking Amazon product prices and finding better deals.

![Better Buy Extension in Action](screenshots/extension-demo.png)

## Features

### 1. Auto-detect Products
- Automatically detects products while browsing Amazon
- Extracts product titles, prices, and ASINs without any user input
- Works seamlessly in the background

### 2. Price Comparison
- Shows current price and historical price data
- Compares prices across different sellers
- Displays if better prices exist for new/used items
- One-click access to all seller offerings

### 3. Price Tracking
- Track items with a single click
- Runs price checks in the background
- Sends notifications when prices drop
- Manage your tracked items list easily

## Installation

1. Clone this repository:
```bash
git clone https://github.com/BushraM/better_buy_amazon.git
```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the `better_buy_amazon` directory

5. The Better Buy icon should appear in your Chrome toolbar

## Usage

1. Visit any Amazon product page
2. Click the Better Buy icon in your toolbar
3. View current price information and comparison
4. Click "Track This Item" to start tracking prices
5. Receive notifications when prices drop

## Screenshots

### Price Tracking Interface
![Price Tracking](screenshots/price-tracking.png)

The extension shows:
- Current price
- Best price found
- Seller information
- Price tracking controls

### Tracked Items List
![Tracked Items](screenshots/tracked-items.png)

Manage all your tracked items in one place.

## Technical Details

The extension is built using:
- HTML/CSS/JavaScript
- Chrome Extension Manifest V3
- Background Service Workers for price tracking
- Chrome Storage API for data persistence

## Privacy

This extension:
- Only accesses Amazon product pages
- Stores data locally on your device
- Does not collect personal information
- Does not share data with third parties

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 