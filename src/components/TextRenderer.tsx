import React from "react";

interface TextRendererProps {
  text: string;
  className?: string;
}

/**
 * TextRenderer - Safely renders text with *bold* syntax
 * Converts *text* to <strong>text</strong>
 * Sanitizes input to prevent XSS attacks
 */
const TextRenderer: React.FC<TextRendererProps> = ({ text, className = "" }) => {
  if (!text) return null;

  // Escape HTML entities to prevent XSS
  const escapeHtml = (str: string): string => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Parse *bold* syntax - non-greedy match to handle multiple bolds
  const parseBoldSyntax = (input: string): React.ReactNode[] => {
    const escapedText = escapeHtml(input);
    const parts: React.ReactNode[] = [];
    
    // Regex: match *text* but not ** or empty *
    const boldRegex = /\*([^*]+)\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(escapedText)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(escapedText.slice(lastIndex, match.index));
      }
      
      // Add the bold text
      parts.push(
        <strong key={`bold-${match.index}`} className="font-semibold">
          {match[1]}
        </strong>
      );
      
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after last match
    if (lastIndex < escapedText.length) {
      parts.push(escapedText.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [escapedText];
  };

  const renderedContent = parseBoldSyntax(text);

  return (
    <span className={className}>
      {renderedContent}
    </span>
  );
};

export default TextRenderer;
