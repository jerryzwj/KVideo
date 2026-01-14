'use client';

import { Suspense } from 'react';
import { SearchForm } from '@/components/search/SearchForm';
import { NoResults } from '@/components/search/NoResults';
import { Navbar } from '@/components/layout/Navbar';
import { SearchResults } from '@/components/home/SearchResults';
import { usePremiumHomePage } from '@/lib/hooks/usePremiumHomePage';
import { PremiumContent } from '@/components/premium/PremiumContent';
import { FavoritesSidebar } from '@/components/favorites/FavoritesSidebar';

function PremiumHomePage() {
    const {
        query,
        hasSearched,
        loading,
        results,
        availableSources,
        completedSources,
        totalSources,
        handleSearch,
        handleReset,
    } = usePremiumHomePage();

    return (
        <div className="min-h-screen bg-black">
            {/* Glass Navbar */}
            <Navbar onReset={handleReset} isPremiumMode={true} />

            {/* Search Form - Separate from navbar */}
            <div className="max-w-7xl mx-auto px-4 mt-6 mb-8 relative" style={{
                transform: 'translate3d(0, 0, 0)',
                zIndex: 1000
            }}>
                <SearchForm
                    onSearch={handleSearch}
                    onClear={handleReset}
                    isLoading={loading}
                    initialQuery={query}
                    currentSource=""
                    checkedSources={completedSources}
                    totalSources={totalSources}
                    placeholder="输入关键词开始搜索..."
                />
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {/* Results Section */}
                {(results.length >= 1 || (!loading && results.length > 0)) && (
                    <SearchResults
                        results={results}
                        availableSources={availableSources}
                        loading={loading}
                        isPremium={true}
                    />
                )}

                {/* No Results */}
                {!loading && hasSearched && results.length === 0 && (
                    <NoResults onReset={handleReset} />
                )}

                {/* Premium Content - Trending and Latest */}
                {!loading && !hasSearched && (
                    <PremiumContent onSearch={handleSearch} />
                )}
            </main>

            {/* Favorites Sidebar - Left */}
            <FavoritesSidebar isPremium={true} />
        </div>
    );
}

export default function PremiumPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--accent-color)] border-t-transparent"></div>
            </div>
        }>
            <PremiumHomePage />
        </Suspense>
    );
}
// src/app/premium/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { PremiumContentGrid } from '@/components/premium/PremiumContentGrid';
import { Video } from '@/lib/types';
import { getDefaultSource } from '@/lib/sources'; // 引入默认源工具

export default function PremiumPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  // 获取默认源的接口地址
  const defaultApiUrl = getDefaultSource().apiUrl;

  const fetchPremiumVideos = async () => {
    try {
      setLoading(true);
      // 使用默认源的接口地址
      const response = await fetch(defaultApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 鉴权信息（如有）
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('接口请求失败');
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('加载视频失败：', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPremiumVideos();
  }, [defaultApiUrl]); // 当默认源变化时重新请求

  return (
    <div>
      <h1>高级视频专区</h1>
      <PremiumContentGrid videos={videos} loading={loading} />
    </div>
  );
}
