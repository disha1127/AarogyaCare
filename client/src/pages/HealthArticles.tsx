import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { articles } from '@/data/articles';
import ArticleCard from '@/components/ArticleCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

const HealthArticles: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Extract unique categories
  const categories = Array.from(new Set(articles.map(article => article.categoryKey)));
  
  // Filter articles based on search query and selected category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchQuery || 
      t(article.titleKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
      t(article.summaryKey).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || article.categoryKey === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">{t('healthArticles')}</h1>
      
      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <Input
            type="text"
            placeholder={t('searchArticles')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            {t('all')}
          </Badge>
          {categories.map((category, index) => (
            <Badge
              key={index}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {t(category)}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article, index) => (
            <ArticleCard
              key={index}
              image={article.image}
              category={t(article.categoryKey)}
              title={t(article.titleKey)}
              summary={t(article.summaryKey)}
              date={article.date}
              slug={article.slug}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-slate-600">{t('noArticlesFound')}</p>
        </div>
      )}
    </div>
  );
};

export default HealthArticles;
