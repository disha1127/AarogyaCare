import { Link } from "wouter";
import { formatDate } from "@/lib/formatDate";
import { useLanguage } from "@/context/LanguageContext";
import type { Article } from "@shared/schema";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { t, currentLanguage } = useLanguage();
  
  return (
    <article className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <img 
        src={article.imageUrl || "https://images.unsplash.com/photo-1624727828489-a1e03b79bba8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} 
        alt={article.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 mb-3">
          {article.source}
        </span>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{article.title}</h3>
        <p className="text-slate-600 mb-3 line-clamp-2">{article.summary}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            {formatDate(article.publishedAt, currentLanguage.code)}
          </span>
          <Link href={`/articles/${article.id}`} className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            {t("common.readMore", "Read more")}
          </Link>
        </div>
      </div>
    </article>
  );
}
