
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, dir } = useLanguage();
  
  const post = t.blogPosts.find(p => p.id === id);

  if (!post) {
    return <Navigate to="/blog" />;
  }

  const relatedPosts = t.blogPosts.filter(p => p.category === post.category && p.id !== post.id).slice(0, 2);

  return (
    <div className="bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white min-h-screen font-sans transition-colors duration-300">
      
      {/* Article Header (Progressive) */}
      <div className="relative h-[85vh] w-full overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-white dark:to-[#0d1117] z-10"></div>
         <div className="absolute inset-0 bg-black/20 z-0"></div>
         <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
         
         <div className="absolute inset-0 z-20 flex flex-col justify-end pb-16 md:pb-24">
            <div className="max-w-5xl mx-auto px-4 w-full text-center md:text-left text-white drop-shadow-md">
               <Link to="/blog" className="inline-flex items-center gap-2 text-gray-200 hover:text-white mb-8 transition-colors font-bold text-sm uppercase tracking-wider">
                  <i className={`fas ${dir === 'rtl' ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i> Back to Blog
               </Link>
               
               <div className="flex flex-wrap gap-3 mb-6">
                  <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    {post.category}
                  </div>
               </div>

               <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight drop-shadow-2xl max-w-4xl text-white">
                  {post.title}
               </h1>
               
               <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-white">
                   <div className="flex items-center gap-4">
                      <img src={post.author.avatar} alt={post.author.name} className="w-14 h-14 rounded-full border-2 border-white/20" />
                      <div>
                         <p className="font-bold text-lg leading-none mb-1.5 text-white">{post.author.name}</p>
                         <p className="text-xs uppercase tracking-wide opacity-80 text-gray-200">{post.author.role}</p>
                      </div>
                   </div>
                   <div className="hidden md:block w-px h-12 bg-white/20"></div>
                   <div className="flex gap-8 text-sm font-medium">
                      <div>
                         <p className="opacity-80 text-gray-200 text-xs uppercase mb-1 tracking-wider">Published</p>
                         <p className="font-mono text-white">{post.publishedAt}</p>
                      </div>
                      <div>
                         <p className="opacity-80 text-gray-200 text-xs uppercase mb-1 tracking-wider">Read Time</p>
                         <p className="font-mono text-white">{post.readTime}</p>
                      </div>
                   </div>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col md:flex-row gap-16">
         
         {/* Sidebar (Share & Navigation) */}
         <aside className="md:w-1/4 hidden md:block">
            <div className="sticky top-32 space-y-10">
               <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
                  <h4 className="text-xs font-bold uppercase text-gray-500 mb-6 tracking-wider">{t.sharePost}</h4>
                  <div className="flex gap-4">
                     <button className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all">
                        <i className="fab fa-twitter text-lg"></i>
                     </button>
                     <button className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-blue-700 hover:text-blue-700 transition-all">
                        <i className="fab fa-linkedin-in text-lg"></i>
                     </button>
                     <button className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white transition-all">
                        <i className="fas fa-link text-lg"></i>
                     </button>
                  </div>
               </div>

               <div>
                  <h4 className="text-xs font-bold uppercase text-gray-500 mb-6 tracking-wider">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                     {post.tags.map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-gray-100 dark:bg-[#161b22] text-gray-600 dark:text-gray-400 text-xs rounded-lg border border-gray-200 dark:border-gray-800 font-mono hover:border-gray-400 dark:hover:border-gray-600 transition-colors cursor-default">
                           #{tag}
                        </span>
                     ))}
                  </div>
               </div>
            </div>
         </aside>

         {/* Main Content */}
         <article className="md:w-2/3 lg:w-3/5">
            <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
               <div className="font-serif text-2xl leading-relaxed text-gray-700 dark:text-gray-200 mb-12 border-l-4 border-blue-500 pl-6 py-2 italic">
                  {post.excerpt}
               </div>
               
               {/* Simulating HTML content insertion securely */}
               <div className="text-gray-800 dark:text-gray-300 leading-loose" dangerouslySetInnerHTML={{ __html: post.content }} />
               
               <div className="mt-16 p-8 bg-gray-50 dark:bg-[#161b22] rounded-3xl border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white uppercase tracking-wider text-xs">About the Author</h3>
                  <div className="flex items-center gap-6">
                     <img src={post.author.avatar} className="w-20 h-20 rounded-full border-2 border-white dark:border-gray-700 shadow-md" alt={post.author.name} />
                     <div>
                        <p className="font-bold text-xl text-gray-900 dark:text-white mb-1">{post.author.name}</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mb-3 font-medium">{post.author.role} at {t.brandName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
                           Focusing on scalable architecture and secure payment integrations for the Afghan market.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </article>
      </div>

      {/* Related Posts */}
      <section className="py-24 bg-gray-50 dark:bg-[#161b22] border-t border-gray-200 dark:border-gray-800">
         <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-12">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{t.relatedPosts}</h3>
                <Link to="/blog" className="text-blue-600 dark:text-blue-400 font-bold hover:text-gray-900 dark:hover:text-white transition-colors">View All</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {relatedPosts.map(related => (
                  <Link key={related.id} to={`/blog/${related.id}`} className="group block bg-white dark:bg-[#0d1117] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 hover:-translate-y-2">
                     <div className="h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-black/5 dark:bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                        <img src={related.coverImage} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" alt={related.title} />
                     </div>
                     <div className="p-8">
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-3 tracking-wider">{related.category}</p>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">{related.title}</h4>
                        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 font-mono">
                            <i className="far fa-clock"></i> {related.readTime}
                        </div>
                     </div>
                  </Link>
               ))}
               {relatedPosts.length === 0 && (
                   <div className="col-span-3 text-center text-gray-500 italic py-10">No related posts found.</div>
               )}
            </div>
         </div>
      </section>

    </div>
  );
};

export default BlogPost;
