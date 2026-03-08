# Wine Tasting Notes Generator

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

ℹ️ **Important**: This project is not affiliated with or endorsed by WSET®.

Generate professional wine tasting notes following the systematic approach to tasting wine. Perfect for wine students, enthusiasts, and sommeliers who want to document their observations professionally while keeping them fun and approachable.

## Key Features

- 🍷 **4-Step Wizard**: Simple, guided process through Appearance, Nose, Palate, and Conclusions
- 🎨 **Interactive Aroma Wheel**: Visual, radial chart with 126 aroma descriptors across 20 categories
- 🔄 **Smart Filtering**: Automatically shows only relevant options based on wine type (white, rosé, red)
- 📝 **4 Output Styles**: Professional (WSET-style), Casual, Bar Talk, or Playful – perfect for any occasion
- 📱 **Mobile-First**: Works beautifully on any device, from phone to desktop
- 🌙 **Dark Mode**: Automatic theme switching with manual toggle
- ✨ **Template-Based**: Pure text generation – no AI, no data stored, everything happens in your browser
- 📋 **Copy to Clipboard**: One-click copy of your tasting notes
- 🎯 **Works with Partial Data**: Skip any observation you want – still generates useful notes

## How to Use

1. **Start Tasting**: Select your wine type (White, Rosé, or Red)
2. **Describe Appearance**: Note clarity, intensity, color, and any observations
3. **Explore Nose & Palate**: Use the interactive aroma wheel to select aromas and flavors, then rate structure (sweetness, acidity, tannin, body, finish)
4. **Add Conclusions**: Assess quality level and readiness, then generate your note!

## Wine Types & Profiles

### Wine Type Filtering

The app intelligently filters aroma and flavor options based on your wine type:

- **White wines**: Shows green/citrus fruits, white bottle age (petrol, kerosene), and white fruit development aromas
- **Rosé wines**: Gets ALL aroma categories – combines white and red characteristics for complete flexibility
- **Red wines**: Shows red/black fruits, red bottle age (leather, earth, tobacco), and red fruit development aromas

When you switch wine types, any invalid selections are automatically cleared.

### Output Profiles

Choose from four distinctive styles for your tasting notes:

- **Professional**: Formal, technical notes with all-caps headers – perfect for study sessions or professional documentation
- **Casual**: Conversational, easy-to-read notes – great for wine blogs or sharing with friends over dinner
- **Bar Talk**: Punchy, direct language – like a sommelier describing wine to a customer at the bar
- **Playful**: Creative metaphors and fun descriptions – makes wine approachable and entertaining for beginners

## Technology

Built with Nuxt 4, TypeScript, and Nuxt UI for a modern, fast, and responsive experience. All processing happens client-side – no servers, no data collection, complete privacy.

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the app
pnpm dev

# Open http://localhost:3000 in your browser
```

## License

MIT License – see [LICENSE](LICENSE) for details.

---

## Disclaimer

This application is an independent study tool and is **not affiliated with, endorsed by, or certified by WSET® (Wine & Spirit Education Trust)**.

WSET® is a registered trademark of the Wine & Spirit Education Trust. This tool follows the WSET Level 3 Systematic Approach to Tasting Wine (2022, Issue 2) methodology, but it is not an official WSET product. It is designed to support wine education and personal tasting note documentation, not to replace professional wine training or official WSET courses.

For official WSET qualifications and accredited courses, please visit https://www.wsetglobal.com/
