
import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import { BlogPost as IBlogPost } from '../types';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, dir } = useLanguage();
  const [post, setPost] = useState<IBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<IBlogPost[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const posts = await api.getPosts();
        const found = posts.find(p => p.id === id || p.slug === id);
        if (found) {
          setPost(found);
          // High SEO: Update page title and description
          document.title = `${found.title} | ZabahSoft Blog`;
          
          // Update meta description if possible (SPA limitation helper)
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) metaDesc.setAttribute('content', found.excerpt);

          // Find related posts
          setRelatedPosts(posts.filter(p => p.category === found.category && p.id !== found.id).slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load post", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return <Navigate to="/blog" />;
  }

  // High SEO: JSON-LD Structured Data for Search Engines
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.coverImage,
    "author": {
      "@type": "Person",
      "name": post.author.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "ZabahSoft",
      "logo": {
        "@type": "ImageObject",
        "url": "https://zabahsoft.com/logo.png"
      }
    },
    "datePublished": post.publishedAt,
    "articleBody": post.content.replace(/<[^>]*>?/gm, '')
  };

  return (
    <div className="bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white min-h-screen font-sans transition-colors duration-300">
      
      {/* SEO Injection */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Article Hero */}
      <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-white dark:to-[#0d1117] z-10"></div>
         <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
         
         <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 md:pb-24">
            <div className="max-w-4xl mx-auto px-4 w-full">
               <Link to="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors font-bold text-xs uppercase tracking-widest">
                  <i className={`fas ${dir === 'rtl' ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i> {t.blog}
               </Link>
               
               <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">
                    {post.category}
                  </span>
               </div>

               <h1 className="text-3xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
                  {post.title}
               </h1>
               
               <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-white">
                   <div className="flex items-center gap-3">
                      <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full border-2 border-white/20" />
                      <div>
                         <p className="font-bold text-sm text-white">{post.author.name}</p>
                         <p className="text-[10px] uppercase tracking-wide opacity-80 text-gray-200">{post.author.role}</p>
                      </div>
                   </div>
                   <div className="flex gap-6 text-[10px] md:text-xs font-bold uppercase tracking-widest pt-3">
                      <div className="opacity-80">
                         <i className="far fa-calendar mr-2"></i> {post.publishedAt}
                      </div>
                      <div className="opacity-80">
                         <i className="far fa-clock mr-2"></i> {post.readTime}
                      </div>
                   </div>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row gap-12">
         
         {/* Main Content (Semantic HTML) */}
         <article className="md:w-2/3 lg:w-3/4 mx-auto">
            <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
               <p className="text-xl md:text-2xl leading-relaxed text-gray-600 dark:text-gray-300 mb-12 border-l-4 border-blue-500 pl-6 py-2 font-serif italic">
                  {post.excerpt}
               </p>
               
               <div className="blog-body text-gray-800 dark:text-gray-300 leading-loose" dangerouslySetInnerHTML={{ __html: post.content }} />
               
               {/* Tags */}
               <div className="mt-16 flex flex-wrap gap-2 pb-12 border-b border-gray-100 dark:border-gray-800">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-50 dark:bg-gray-800/50 rounded text-[10px] font-mono border border-gray-200 dark:border-gray-800 text-gray-500">
                      #{tag}
                    </span>
                  ))}
               </div>

               {/* Author Box */}
               <div className="mt-12 p-8 bg-gray-50 dark:bg-[#161b22] rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center gap-6">
                  <img src={post.author.avatar} className="w-20 h-20 rounded-full border-2 border-white dark:border-gray-700 shadow-md" alt={post.author.name} />
                  <div className="text-center md:text-left">
                     <p className="font-bold text-xl text-gray-900 dark:text-white mb-1">{post.author.name}</p>
                     <p className="text-sm text-blue-600 dark:text-blue-400 mb-2 font-medium">{post.author.role}</p>
                     <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Contributing insights and technical guidance for the next generation of software development in Afghanistan.
                     </p>
                  </div>
               </div>
            </div>
         </article>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-24 bg-gray-50 dark:bg-[#161b22] border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-12">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map(related => (
                    <Link key={related.id} to={`/blog/${related.id}`} className="group block bg-white dark:bg-[#0d1117] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-200 dark:border-gray-800">
                      <div className="h-48 overflow-hidden">
                          <img src={related.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={related.title} />
                      </div>
                      <div className="p-6">
                          <p className="text-[10px] font-bold text-blue-600 uppercase mb-2 tracking-widest">{related.category}</p>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">{related.title}</h4>
                          <span className="text-[10px] text-gray-400 uppercase font-mono">{related.publishedAt}</span>
                      </div>
                    </Link>
                ))}
              </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPost;
