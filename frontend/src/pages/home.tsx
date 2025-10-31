import React from "react";

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Welcome to Maglo</h1>
      <h2 className="text-3xl font-semibold mb-4">Typography Demo</h2>

      <p className="text-lg mb-4">
        This paragraph uses Lato font family for body text. It provides
        excellent readability and a clean, modern appearance for all content
        text throughout the application.
      </p>

      <h3 className="text-2xl font-medium mb-3">Features Overview</h3>
      <p className="mb-4">
        All heading tags (h1, h2, h3, h4, h5, h6) now use the Roboto font
        family, which provides strong visual hierarchy and excellent legibility
        for titles and section headers.
      </p>

      <h4 className="text-xl font-medium mb-2">Technical Implementation</h4>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>Google Fonts integration for Roboto and Lato</li>
        <li>Tailwind CSS custom font families configuration</li>
        <li>CSS layer base styles for typography</li>
        <li>Responsive and accessible design patterns</li>
      </ul>

      <h5 className="text-lg font-medium mb-2">Additional Notes</h5>
      <p className="text-sm text-gray-600">
        The font configuration ensures consistent typography across the entire
        application while maintaining optimal performance through Google Fonts
        optimization.
      </p>

      <h6 className="text-base font-medium mt-4">Small Heading Example</h6>
      <p className="text-xs text-gray-500 mt-2">
        This demonstrates the smallest heading level with accompanying small
        text.
      </p>
    </div>
  );
};

export default Home;
