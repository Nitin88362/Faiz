import { useState, useRef, useEffect } from 'react';
import languages from '../../data/languages';

const LanguageDropdown = ({ label, value, onChange }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedLang = languages.find(l => l.code === value) || languages[0];

  const filteredLanguages = search.trim() === ''
    ? languages
    : languages.filter(lang =>
        lang.name.toLowerCase().includes(search.toLowerCase()) ||
        lang.code.toLowerCase().includes(search.toLowerCase())
      );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    onChange(code);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="mb-4 relative" ref={dropdownRef}>
      <label className="block text-gray-300 mb-2">{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer flex justify-between items-center"
      >
        <span>{selectedLang.name}</span>
        <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          <div className="sticky top-0 bg-gray-800 p-2 border-b border-gray-700">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search language..."
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((lang) => (
              <div
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-700 ${
                  lang.code === value ? 'bg-purple-900 text-purple-300' : 'text-white'
                }`}
              >
                {lang.name}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-400">No languages found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
