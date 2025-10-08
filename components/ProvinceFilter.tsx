import React from 'react';

interface ProvinceFilterProps {
  provinces: string[];
  selectedValue: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ProvinceFilter: React.FC<ProvinceFilterProps> = ({ provinces, selectedValue, onChange }) => {
  return (
    <div>
      <label htmlFor="province-filter" className="block text-sm font-medium text-gray-700 mb-1">
        Lọc theo Tỉnh/Thành phố
      </label>
      <select
        id="province-filter"
        name="province-filter"
        value={selectedValue}
        onChange={onChange}
        className="block w-full h-full rounded-full border border-gray-300 bg-white py-4 px-5 text-lg text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        aria-label="Lọc theo tỉnh thành phố"
      >
        <option value="">Tất cả các tỉnh</option>
        {provinces.map((province) => (
          <option key={province} value={province}>
            {province}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProvinceFilter;
