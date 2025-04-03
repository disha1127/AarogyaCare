import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/context/LanguageContext";
import { useOffline } from "@/context/OfflineContext";
import ArticleCard from "@/components/ArticleCard";
import { articles as localArticles } from "@/data/articles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Article } from "@shared/schema";

export default function Articles() {
  const { t } = useLanguage();
  const { isOffline, getOfflineData, saveOfflineData } = useOffline();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  // Fetch articles from API when online
  const { data: apiArticles, isLoading } = useQuery({
    queryKey: ['/api/articles'],
    enabled: !isOffline
  });

  // If offline, use cached articles or fallback to local data
  useEffect(() => {
    const fetchOfflineArticles = async () => {
      if (isOffline) {
        const offlineData = await getOfflineData<Article[]>('articles');
        if (offlineData && offlineData.length > 0) {
          setFilteredArticles(offlineData);
        } else {
          setFilteredArticles(localArticles);
        }
      }
    };

    fetchOfflineArticles();
  }, [isOffline, getOfflineData]);

  // When online, update filtered articles based on API data
  useEffect(() => {
    if (!isOffline && apiArticles) {
      setFilteredArticles(apiArticles);
      // Cache articles for offline use
      saveOfflineData('articles', apiArticles.filter((article: Article) => article.isOfflineAvailable));
    }
  }, [isOffline, apiArticles, saveOfflineData]);

  // Apply filters whenever search or category changes
  useEffect(() => {
    const articles = !isOffline && apiArticles ? apiArticles : (isOffline ? localArticles : []);
    
    let filtered = [...articles];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        article => 
          article.title.toLowerCase().includes(query) || 
          article.summary.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter(
        article => article.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    setFilteredArticles(filtered);
  }, [searchQuery, categoryFilter, apiArticles, isOffline]);

  // Extract unique categories from articles
  const allCategories = !isOffline && apiArticles
    ? [...new Set(apiArticles.map((article: Article) => article.category))]
    : [...new Set(localArticles.map(article => article.category))];

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t("healthArticles", "Health Articles")}</h1>
        <p className="text-slate-600 max-w-3xl">
          {t("healthArticlesDescription", "Stay informed with the latest health articles from WHO and other trusted sources. Learn about health topics relevant to rural communities.")}
        </p>
      </div>

      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
          <Input
            type="search"
            placeholder={t("searchArticles", "Search articles...")}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="min-w-[180px]">
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("filterByCategory", "Filter by category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allCategories", "All Categories")}</SelectItem>
              {allCategories.map((category, index) => (
                <SelectItem key={index} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {(searchQuery || categoryFilter !== "all") && (
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("all");
            }}
          >
            {t("clearFilters", "Clear Filters")}
          </Button>
        )}
      </div>

      <Separator className="my-6" />

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-3"></div>
          <p className="text-slate-500">{t("loading", "Loading...")}</p>
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900">{t("noArticlesFound", "No Articles Found")}</h3>
          <p className="mt-1 text-sm text-slate-500">{t("tryDifferentSearch", "Try changing your search or filter criteria.")}</p>
        </div>
      )}

      {isOffline && (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="h-6 w-6 text-amber-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-amber-800">
                {t("offlineMode", "Offline Mode")}
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                {t("offlineArticlesInfo", "You're viewing cached articles available offline. Connect to the internet to access the full collection of articles.")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
