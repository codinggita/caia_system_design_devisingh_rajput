/**
 * Simple markdown summarizer utility
 */
const summarizeMarkdown = (markdown, wordLimit = 50) => {
  if (!markdown) {
    return '';
  }

  // Simple regex to strip markdown syntax
  const text = markdown
    .replace(/#+\s+/g, '') // remove headers
    .replace(/\*+/g, '')   // remove bold/italic formatting
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // remove links but keep text
    .replace(/`{3,}[\s\S]*?`{3,}/g, '') // remove code blocks
    .replace(/`[^`]+`/g, '') // remove inline code
    .replace(/>\s+/g, '') // remove blockquotes
    .replace(/-\s+/g, '') // remove bullet points
    .replace(/\s+/g, ' ') // normalize whitespace
    .trim();

  const words = text.split(/\s+/);
  if (words.length <= wordLimit) {
    return text;
  }

  return words.slice(0, wordLimit).join(' ') + '...';
};

module.exports = {
  summarizeMarkdown
};
