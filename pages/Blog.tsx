
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
            setPosts(t.blogPosts || []); 
        } finally {
            setIsLoading(false);
        }
    };
    loadPosts();
  }, [t.blogPosts]);

  const featuredPost = posts.find(p => p.featured) || posts[0];
  const filteredPosts = posts.filter(p => selectedCategory === 'All' || p.category === selectedCategory);
  
  const gridPosts = selectedCategory === 'All' 
    ? filteredPosts.filter(p => p.id !== featuredPost?.id)
    : filteredPosts;

  const categories: (BlogCategory | 'All')[] = ['All', 'Tech', 'Business', 'Tutorial', 'News'];

  return (
    <div className="bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white min-h-screen pb-32 font-sans transition-colors duration-300">
      
      {/* Blog Hero */}
      <section className="relative pt-32 pb-16 px-4 bg-white dark:bg-[#0d1117] border-b border-gray-200 dark:border-gray-800 overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
         <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
               Insightful Engineering
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
               Guides, updates, and deep dives into technology, software architecture, and the digital economy in Afghanistan.
            </p>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3">
               {categories.map(cat => {
                  const count = cat === 'All' ? posts.length : posts.filter(p => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border flex items-center gap-2.5 group ${
                          selectedCategory === cat 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20 scale-105' 
                          : 'bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                    >
                       {cat}
                       <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-mono transition-colors ${
                         selectedCategory === cat 
                         ? 'bg-white/20 text-white' 
                         : 'bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                       }`}>
                          {count}
                       </span>
                    </button>
                  );
               })}
            </div>
         </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 relative z-20">
         
         {isLoading ? (
             <div className="flex justify-center py-20">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
             </div>
         ) : (
             <>
                {/* Featured Post (Only show on 'All' to emphasize featured status) */}
                {selectedCategory === 'All' && featuredPost && (
                    <Link to={`/blog/${featuredPost.id}`} className="block group mb-20 animate-fade-in-up">
                        <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row hover:border-blue-500/50 transition-all duration-300">
                        <div className="md:w-3/5 relative h-[300px] md:h-auto overflow-hidden">
                            <img 
                                src={featuredPost.coverImage} 
                                alt={featuredPost.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                        </div>
                        <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-4 text-[10px] font-bold uppercase tracking-widest text-blue-600">
                                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 rounded">{featuredPost.category}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span className="text-gray-400">{featuredPost.readTime}</span>
                            </div>
                            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors leading-tight">
                                {featuredPost.title}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 line-clamp-3">
                                {featuredPost.excerpt}
                            </p>
                            <div className="flex items-center gap-3 mt-auto">
                                <img src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-8 h-8 rounded-full" />
                                <div>
                                    <p className="text-xs font-bold text-gray-900 dark:text-white">{featuredPost.author.name}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{featuredPost.publishedAt}</p>
                                </div>
                            </div>
                        </div>
                        </div>
                    </Link>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridPosts.map((post, index) => (
                    <Link 
                      key={post.id} 
                      to={`/blog/${post.id}`} 
                      className="group bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <div className="h-56 overflow-hidden">
                            <img src={post.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <p className="text-[10px] font-bold text-blue-600 uppercase mb-2 tracking-widest">{post.category}</p>
                            <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                            {post.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 line-clamp-3 flex-grow">
                            {post.excerpt}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 pt-4 border-t border-gray-50 dark:border-gray-800 mt-auto">
                                <span>{post.publishedAt}</span>
                                <span>•</span>
                                <span>{post.readTime}</span>
                            </div>
                        </div>
                    </Link>
                ))}
                </div>
                
                {gridPosts.length === 0 && !isLoading && (
                <div className="text-center py-32 animate-fade-in">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-6">
                       <i className="fas fa-search text-3xl"></i>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">No articles found</p>
                    <p className="text-gray-500">There are no posts currently published in the <b className="text-blue-600">{selectedCategory}</b> category.</p>
                    <button 
                      onClick={() => setSelectedCategory('All')}
                      className="mt-8 text-blue-600 font-bold hover:underline"
                    >
                      View all posts
                    </button>
                </div>
                )}
             </>
         )}

      </div>
    </div>
  );
};

export default Blog;
