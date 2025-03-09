// components/rainbow-header.jsx
'use client';

import { useState, useRef, useEffect } from 'react';

export function RainbowHeader() {
  const [currentColor, setCurrentColor] = useState('#FFFFFF');
  const [savedColor, setSavedColor] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const headerRef = useRef(null);

  // Get color at specific pixel - more accurate mapping
  const getColorAtPosition = (x, y) => {
    if (!headerRef.current) return '#FFFFFF';
    
    // Calculate the position ratio (0 to 1)
    const rect = headerRef.current.getBoundingClientRect();
    const relativeX = (x - rect.left) / rect.width;
    
    // Special cases for the ends
    if (relativeX < 0.02) {
      // White zone (left 2%)
      return '#FFFFFF';
    } else if (relativeX > 0.98) {
      // Black zone (right 2%)
      return '#000000';
    } else {
      // Adjusted rainbow spectrum (2% to 98%)
      // Map the 0.02-0.98 range to 0-1
      const adjustedX = (relativeX - 0.02) / 0.96;
      
      // More accurate color mapping with HSL
      if (adjustedX < 0.125) { // First eighth - violet to indigo
        const t = adjustedX / 0.125;
        const hue = 270 - t * 30; // 270 (violet) to 240 (indigo)
        const rgbValue = hslToRgb(hue / 360, 1, 0.5);
        return rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b);
      } else if (adjustedX < 0.25) { // Second eighth - indigo to blue
        const t = (adjustedX - 0.125) / 0.125;
        const hue = 240 - t * 30; // 240 (indigo) to 210 (blue)
        const rgbValue = hslToRgb(hue / 360, 1, 0.5);
        return rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b);
      } else if (adjustedX < 0.375) { // Third eighth - blue to cyan
        const t = (adjustedX - 0.25) / 0.125;
        const hue = 210 - t * 30; // 210 (blue) to 180 (cyan)
        const rgbValue = hslToRgb(hue / 360, 1, 0.5);
        return rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b);
      } else if (adjustedX < 0.5) { // Fourth eighth - cyan to green
        const t = (adjustedX - 0.375) / 0.125;
        const hue = 180 - t * 60; // 180 (cyan) to 120 (green)
        const rgbValue = hslToRgb(hue / 360, 1, 0.5);
        return rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b);
      } else if (adjustedX < 0.625) { // Fifth eighth - green to yellow
        const t = (adjustedX - 0.5) / 0.125;
        const hue = 120 - t * 60; // 120 (green) to 60 (yellow)
        const rgbValue = hslToRgb(hue / 360, 1, 0.5);
        return rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b);
      } else if (adjustedX < 0.75) { // Sixth eighth - yellow to orange
        const t = (adjustedX - 0.625) / 0.125;
        const hue = 60 - t * 30; // 60 (yellow) to 30 (orange)
        const rgbValue = hslToRgb(hue / 360, 1, 0.5);
        return rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b);
      } else if (adjustedX < 0.875) { // Seventh eighth - orange to red
        const t = (adjustedX - 0.75) / 0.125;
        const hue = 30 - t * 30; // 30 (orange) to 0 (red)
        const rgbValue = hslToRgb(hue / 360, 1, 0.5);
        return rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b);
      } else { // Last eighth - red to dark red
        const t = (adjustedX - 0.875) / 0.125;
        const lightness = 0.5 - t * 0.3; // Darkening to approach black
        const rgbValue = hslToRgb(0, 1, lightness);
        return rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b);
      }
    }
  };

  // Handle mouse movement
  const handleMouseMove = (e) => {
    if (!savedColor) {
      setCurrentColor(getColorAtPosition(e.clientX, e.clientY));
    }
  };

  // Handle click to save color
  const handleClick = (e) => {
    const color = getColorAtPosition(e.clientX, e.clientY);
    
    if (savedColor) {
      // If we already have a saved color, clicking again clears it
      setSavedColor(null);
      setCurrentColor(color);
    } else {
      // Save the current color
      setSavedColor(color);
      setCurrentColor(color);
    }
  };

  // Handle mouse enter/leave
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    
    // If no color is saved, reset to white when mouse leaves
    if (!savedColor) {
      setCurrentColor('#FFFFFF');
    }
  };

  // HSL to RGB conversion (from: https://gist.github.com/mjackson/5311256)
  function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  // RGB to Hex conversion
  function rgbToHex(r, g, b) {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
  }

  // Reset saved color
  const handleResetColor = () => {
    setSavedColor(null);
    if (!isHovering) {
      setCurrentColor('#FFFFFF');
    }
  };

  // Calculate if a color is light or dark
  const isColorLight = (hexColor) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate perceived brightness (using YIQ formula)
    return (r * 299 + g * 587 + b * 114) / 1000 >= 128;
  };

  // Get contrasting color (black or white) based on background
  const getContrastColor = (hexColor) => {
    return isColorLight(hexColor) ? '#000000' : '#FFFFFF';
  };

  // Get contrasting background color
  const getContrastBackground = (hexColor) => {
    // Use the complementary color (opposite on the color wheel) but with lower saturation
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Simple inversion with some adjustments for better contrast
    const invR = 255 - r;
    const invG = 255 - g;
    const invB = 255 - b;
    
    // Ensure good contrast with some desaturation
    const desaturationFactor = 0.3;
    const midpoint = 128;
    
    const contrastR = Math.round(invR * (1 - desaturationFactor) + midpoint * desaturationFactor);
    const contrastG = Math.round(invG * (1 - desaturationFactor) + midpoint * desaturationFactor);
    const contrastB = Math.round(invB * (1 - desaturationFactor) + midpoint * desaturationFactor);
    
    return `rgb(${contrastR}, ${contrastG}, ${contrastB})`;
  };

  return (
    <div className="w-full">
      {/* Full-width header gradient - with more accurate gradient */}
      <div 
        ref={headerRef}
        className="relative h-32 w-full cursor-crosshair" 
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          background: `
            linear-gradient(to right, 
              #FFFFFF 2%, 
              #8A2BE2 4%, /* BlueViolet */
              #9370DB 12%, /* MediumPurple */
              #4B0082 20%, /* Indigo */
              #0000FF 28%, /* Blue */
              #1E90FF 36%, /* DodgerBlue */
              #00FFFF 44%, /* Cyan */
              #00FA9A 52%, /* MediumSpringGreen */
              #00FF00 60%, /* Lime */
              #FFFF00 68%, /* Yellow */
              #FFA500 76%, /* Orange */
              #FF4500 84%, /* OrangeRed */
              #FF0000 92%, /* Red */
              #000000 98%
            )
          `
        }}
      />
      
      {/* Centered color display */}
      <div className="w-full flex justify-center mt-4">
        <div 
          className="flex items-center p-3 rounded-lg shadow-md"
          style={{ 
            backgroundColor: getContrastBackground(currentColor),
            transition: 'background-color 0.2s ease-out',
          }}
        >
          {/* Color circle with black outline */}
          <div 
            className={`h-12 w-12 rounded-full border-2 border-black flex items-center justify-center overflow-hidden transition-all ${savedColor ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
            style={{ 
              backgroundColor: currentColor,
              transition: 'background-color 0.1s ease-out',
              cursor: savedColor ? 'pointer' : 'default'
            }}
            onClick={savedColor ? handleResetColor : undefined}
          />
          
          {/* Hex code display */}
          <div className="ml-3">
            <div 
              className="text-xs uppercase font-bold flex items-center"
              style={{ 
                color: getContrastColor(getContrastBackground(currentColor))
              }}
            >
              HEXCODE
              {savedColor && (
                <span className="ml-2 text-xs font-normal">(LOCKED)</span>
              )}
            </div>
            <div 
              className="font-mono font-medium text-lg"
              style={{ 
                color: getContrastColor(getContrastBackground(currentColor)),
                transition: 'color 0.1s ease-out'
              }}
            >
              {currentColor}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}