import React, { useState, useMemo } from 'react';
import { procuraciesData } from './data/procuracies';
import { VKSND } from './types';
import SearchBar from './components/SearchBar';
import ResultCard from './components/ResultCard';
import ProvinceFilter from './components/ProvinceFilter';

const normalizeText = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
};

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');

  const provinces = useMemo(() => {
    return [...new Set(procuraciesData.map(p => p.tinh))].sort((a, b) => a.localeCompare(b, 'vi'));
  }, []);

  const filteredProcuracies = useMemo(() => {
    const trimmedQuery = query.trim();
    const hasQuery = trimmedQuery !== '';
    const hasProvince = selectedProvince !== '';

    if (!hasQuery && !hasProvince) {
      return [];
    }

    let results = procuraciesData;

    if (hasProvince) {
      results = results.filter(vks => vks.tinh === selectedProvince);
    }

    if (hasQuery) {
      const normalizedQuery = normalizeText(trimmedQuery);
      const queryTokens = normalizedQuery.split(' ').filter(token => token.length > 0);

      const filtered = results.filter(vks => {
        const searchableText = normalizeText(
          `${vks.ten} ${vks.diaDiem} ${vks.donViKeThua} ${vks.tinh}`
        );
        return queryTokens.every(token => {
          const escapedToken = token.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          // Use regex with a word boundary (\b). This ensures that we match whole words,
          // preventing "4" from matching "14", which was the source of the issue.
          // This makes the search more precise for queries containing numbers.
          const regex = new RegExp(`\\b${escapedToken}`);
          return regex.test(searchableText);
        });
      });
      
      const getScore = (vks: VKSND) => {
        const normalizedTen = normalizeText(vks.ten);
        if (normalizedTen === normalizedQuery) return 3; // Highest priority for exact name match
        if (normalizedTen.startsWith(normalizedQuery)) return 2; // High priority for name starting with query
        if (normalizedTen.includes(normalizedQuery)) return 1; // Medium priority for name containing query phrase
        return 0;
      };

      // Sort the results for relevance based on the score.
      // The sort method sorts elements of an array in place and returns the reference to the same array.
      // A copy is made with .slice() to avoid mutating the original filtered array if it were used elsewhere.
      return filtered.slice().sort((a, b) => getScore(b) - getScore(a));
    }
    
    return results;
  }, [query, selectedProvince]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvince(e.target.value);
  };
  
  const handleClearFilters = () => {
    setQuery('');
    setSelectedProvince('');
  };

  const getResultsText = () => {
    let text = `Tìm thấy <span class="font-bold text-blue-700">${filteredProcuracies.length}</span> kết quả`;
    if (query.trim()) {
      text += ` cho từ khóa <span class="font-semibold text-gray-800">"${query}"</span>`;
    }
    if (selectedProvince) {
      text += ` tại <span class="font-semibold text-gray-800">${selectedProvince}</span>`;
    }
    text += '.';
    return text;
  };

  const InitialState: React.FC = () => (
    <div className="text-center py-16 px-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.8 14.945l.128.128A2 2 0 009.354 16h5.292a2 2 0 001.414-.586l.128-.128" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Bắt đầu tra cứu</h3>
        <p className="mt-1 text-gray-500">
            Sử dụng ô tìm kiếm và bộ lọc để tra cứu thông tin VKSND.
        </p>
    </div>
  );

  const NoResults: React.FC<{ searchQuery: string }> = ({ searchQuery }) => (
      <div className="text-center py-16 px-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Không tìm thấy kết quả</h3>
        <p className="mt-1 text-gray-500">
            Không có VKSND nào khớp với tiêu chí tìm kiếm của bạn.
        </p>
        <p className="mt-1 text-sm text-gray-500">
            Vui lòng thử lại với từ khóa hoặc bộ lọc khác.
        </p>
    </div>
  );

  const hasActiveFilter = query.trim() !== '' || selectedProvince !== '';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-blue-800 shadow-md">
        <div className="container mx-auto max-w-5xl px-4 py-5">
          <h1 className="text-3xl font-bold text-white tracking-tight">Trợ lý Tra cứu Tra cứu thông tin Viện kiểm sát nhân dân khu vực tại Việt Nam</h1>
          <p className="text-blue-200 mt-1">
            Tra cứu thông tin Viện kiểm sát nhân dân khu vực tại Việt Nam.
          </p>
        </div>
      </header>
      
      <main className="container mx-auto max-w-5xl p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 mb-8">
            <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tìm kiếm chung
                </label>
                <SearchBar 
                    value={query}
                    onChange={handleSearchChange}
                    placeholder="Tìm kiếm theo tên VKS, tỉnh, địa chỉ..."
                />
            </div>
            <div className="md:col-span-2">
                <ProvinceFilter
                    provinces={provinces}
                    selectedValue={selectedProvince}
                    onChange={handleProvinceChange}
                />
            </div>
        </div>

        <div>
          {hasActiveFilter && (
            <div className="flex items-center justify-between mb-4">
              <div 
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: getResultsText() }}
              />
              <button 
                onClick={handleClearFilters}
                className="flex items-center rounded px-2 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label="Xoá tất cả bộ lọc"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Xoá bộ lọc
              </button>
            </div>
          )}

          {!hasActiveFilter ? (
            <InitialState />
          ) : filteredProcuracies.length > 0 ? (
            <div className="space-y-4">
              {filteredProcuracies.map((procuracy) => (
                <ResultCard key={procuracy.stt} procuracy={procuracy} />
              ))}
            </div>
          ) : (
            <NoResults searchQuery={query} />
          )}
        </div>
      </main>

      <footer className="mt-12 py-6 text-center text-gray-500 text-sm">
        <div className="container mx-auto max-w-5xl px-4">
            <p className="font-semibold">Sản phẩm do Viện kiểm sát nhân dân khu vực 2- Bắc Ninh phát triển</p>
            <p className="mt-2">&copy; {new Date().getFullYear()} Trợ lý Tra cứu VKSND. Dữ liệu chỉ mang tính tham khảo.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;