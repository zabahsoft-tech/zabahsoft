
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { BlogCategory, BlogPost } from '../types';
import { api } from '../services/api';

const Blog: React.FC = () => {
  const { t, dir } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'All'>('All');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
        try {
            const data = await api.getPosts();
            setPosts(data);
        } catch (e) {
            console.error("Failed to load blog posts");
            setPosts(t.blogPosts); // Fallback
        } finally {
            setIsLoading(false);
        }
    };
    loadPosts();
  }, [t.blogPosts]);

  // Use state posts instead of translation posts for dynamic content
  const featuredPost = posts.find(p => p.featured) || posts[0];
  const filteredPosts = posts.filter(p => selectedCategory === 'All' || p.category === selectedCategory);
  
  // Exclude featured post from grid if it is displayed in hero (unless filtering)
  const gridPosts = selectedCategory === 'All' 
    ? filteredPosts.filter(p => p.id !== featuredPost?.id)
    : filteredPosts;

  const categories: (BlogCategory | 'All')[] = ['All', 'Tech', 'Business', 'Tutorial', 'News'];

  return (
    <div className="bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white min-h-screen pb-32 font-sans transition-colors duration-300">
      
      {/* Blog Hero */}
      <section className="relative pt-40 pb-24 px-4 bg-white dark:bg-[#0d1117] border-b border-gray-200 dark:border-gray-800">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50 dark:from-blue-900/10 to-transparent pointer-events-none"></div>

         <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight drop-shadow-sm animate-fade-in-up opacity-0" style={{animationDelay: '0.1s'}}>
               {t.blogHeroTitle}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up opacity-0" style={{animationDelay: '0.3s'}}>
               {t.blogHeroSubtitle}
            </p>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up opacity-0" style={{animationDelay: '0.5s'}}>
               {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                        selectedCategory === cat 
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-gray-900 dark:border-white scale-105 shadow-md' 
                        : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                     {cat}
                  </button>
               ))}
            </div>
         </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-12 relative z-20">
         
         {isLoading ? (
             <div className="flex justify-center py-20">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
             </div>
         ) : (
             <>
                {/* Featured Post (Only show on 'All') */}
                {selectedCategory === 'All' && featuredPost && (
                    <Link to={`/blog/${featuredPost.id}`} className="block group mb-20 animate-fade-in-up opacity-0" style={{animationDelay: '0.6s'}}>
                        <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300 h-full md:h-[500px]">
                        <div className="md:w-1/2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/10 dark:bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                            <img 
                                src={featuredPost.coverImage} 
                                alt={featuredPost.title} 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                            />
                            <div className="absolute top-6 left-6 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg z-20">
                                {t.featuredPost}
                            </div>
                        </div>
                        <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-6 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-bold text-blue-600 dark:text-blue-400">{featuredPost.category}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600"></span>
                                <span>{featuredPost.readTime}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600"></span>
                                <time>{featuredPost.publishedAt}</time>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                                {featuredPost.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 line-clamp-3 leading-relaxed">
                                {featuredPost.excerpt}
                            </p>
                            <div className="flex items-center gap-4 mt-auto">
                                <img src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700" />
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{featuredPost.author.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">{featuredPost.author.role}</p>
                                </div>
                            </div>
                        </div>
                        </div>
                    </Link>
                )}

                {/* Post Grid */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-10 border-b border-gray-200 dark:border-gray-800 pb-4 animate-fade-in-up opacity-0" style={{animationDelay: '0.7s'}}>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{t.latestPosts}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {gridPosts.map((post, index) => (
                        <Link key={post.id} to={`/blog/${post.id}`} className="group flex flex-col h-full bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden hover:border-gray-400 dark:hover:border-gray-600 hover:-translate-y-2 transition-all duration-300 shadow-lg animate-fade-in-up opacity-0" style={{animationDelay: `${0.8 + index * 0.1}s`}}>
                            <div className="h-64 overflow-hidden relative">
                                <div className="absolute inset-0 bg-black/5 dark:bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                                <img 
                                src={post.coverImage} 
                                alt={post.title} 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                                />
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/60 backdrop-blur-md text-gray-900 dark:text-white text-xs font-bold px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 z-20">
                                {post.category}
                                </div>
                            </div>
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide">
                                    <i className="far fa-clock"></i> {post.readTime}
                                </div>
                                <h4 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                                {post.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 line-clamp-3 leading-relaxed">
                                {post.excerpt}
                                </p>
                                
                                <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={post.author.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" />
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{post.author.name}</span>
                                    </div>
                                    <span className="text-xs text-gray-500 font-mono">{post.publishedAt}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                    </div>
                    
                    {gridPosts.length === 0 && (
                    <div className="text-center py-32 text-gray-500">
                        <i className="fas fa-search text-5xl mb-6 opacity-30"></i>
                        <p className="text-xl">No posts found in this category.</p>
                    </div>
                    )}
                </div>
             </>
         )}

      </div>
    </div>
  );
};

export default Blog;
