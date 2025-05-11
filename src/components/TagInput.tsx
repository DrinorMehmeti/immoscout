import React, { useState } from 'react';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onTagsChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        onTagsChange([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const getTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      'E mobiluar': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Afër qendrës': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Investim i mirë': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'default': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };

    return colors[tag] || colors.default;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Tags oder Eigenschaften
      </label>
      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor(tag)} flex items-center gap-1`}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-red-600 dark:hover:text-red-400"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tag eingeben und Enter drücken"
          className="flex-1 min-w-[200px] bg-transparent border-none focus:ring-0 p-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Drücken Sie Enter, um einen Tag hinzuzufügen
      </p>
    </div>
  );
};

export default TagInput; 