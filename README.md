# Hairstyle Price Calculator 💇‍♀️

A modern and interactive React application for calculating hairstyling service prices, specially designed for the Ottawa market.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Description

This web application allows hairstylists and clients to quickly and accurately calculate the total cost of hairstyling services, taking into account various factors such as hairstyle type, duration, travel distance, and additional services.

## ✨ Features

- 🎯 Precise price calculation based on time and service type
- 💰 Dynamic pricing with min/max price ranges
- 🚗 Automatic travel fee calculation
- ➕ Optional additional services
- 💵 Automatic tax calculation (Ontario HST)
- 🎨 Modern and responsive user interface
- ✨ Smooth animations and visual feedback

## 🛠️ Technologies Used

- React.js
- Tailwind CSS
- Framer Motion (for animations)
- Lucide React (for icons)
- Intl.NumberFormat (for currency formatting)

## 📥 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/hairstyle-price-calculator.git
```

2. Install dependencies:
```bash
cd hairstyle-price-calculator
npm install
```

3. Install specific dependencies:
```bash
npm install framer-motion lucide-react
```

## 🚀 Getting Started

To run the application in development mode:

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📊 Data Structure

### Hairstyling Services
The application uses a `servicesData` object that contains:
- List of hairstyle types with price ranges
- Additional services
- Travel fees
- HST rate

### Configuration Example
```javascript
const servicesData = {
  hairstyles: [
    {
      type: "boxBraids",
      name: "Box Braids",
      priceRange: [80, 120],
      timeRange: [5, 7],
      hourlyRate: 17.14
    },
    // ... other styles
  ],
  additionalServices: [
    { type: "deepConditioning", name: "Deep Conditioning", price: 20 },
    // ... other services
  ]
};
```

## 🔧 Customization

### Modifying Services
To add or modify services, edit the file containing `servicesData`:

1. To add a new hairstyle type:
```javascript
{
  type: "newStyle",
  name: "New Style",
  priceRange: [min, max],
  timeRange: [minHours, maxHours],
  hourlyRate: rate
}
```

2. To add an additional service:
```javascript
{
  type: "newService",
  name: "New Service",
  price: amount
}
```

### Rate Modifications
- `travelFeeBase`: Base travel fee
- `travelFeePerKm`: Fee per additional kilometer
- `taxRate`: HST rate

## 📱 Compatibility

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablets
- ✅ Mobile
- ✅ PWA ready

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 👥 Contact

For any questions or suggestions, feel free to open an issue or contact us directly.

## 🔑 Key Features Explained

### Price Calculation
- Base price calculated using hourly rate and duration
- Price adjustments within specified ranges
- Travel fee calculation based on distance
- Additional services costs
- HST calculation

### User Interface
- Intuitive form-based interface
- Real-time price updates
- Responsive design for all devices
- Animated transitions and feedback
- Clear price breakdown

### Data Validation
- Input validation for all fields
- Time range restrictions per hairstyle
- Distance validation for travel fees
- Required field checking

## 📈 Future Improvements

- User accounts for stylists
- Appointment scheduling
- Payment integration
- Multi-language support
- Service history tracking
- Export price quotes to PDF

---

Developed with ❤️ for the Ottawa hairstyling community