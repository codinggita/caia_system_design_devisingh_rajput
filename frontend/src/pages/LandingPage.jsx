import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Search, 
  Speed, 
  Storage, 
  Security, 
  CloudQueue, 
  Psychology, 
  Code,
  ArrowForward,
  Star,
  People,
  TrendingUp,
  CheckCircle,
  Explore
} from '@mui/icons-material';
import Button from '../components/common/Button';
import { conceptService } from '../services/conceptService';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [concepts, setConcepts] = useState([]);
  const [filteredConcepts, setFilteredConcepts] = useState([]);

  // Load trending featured concepts
  useEffect(() => {
    async function loadFeatured() {
      try {
        const response = await conceptService.list({ limit: 6 });
        const resData = response.data?.data || response.data || {};
        const items = Array.isArray(resData) ? resData : (resData.items || resData.concepts || []);
        setConcepts(items);
      } catch (err) {
        console.error('Failed to load featured concepts', err);
      }
    }
    loadFeatured();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConcepts([]);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredConcepts(
        concepts.filter(
          (c) =>
            (c.metadata?.concept || '').toLowerCase().includes(q) ||
            (c.metadata?.category || '').toLowerCase().includes(q) ||
            c.metadata?.technologies?.some((t) => t.toLowerCase().includes(q))
        )
      );
    }
  }, [searchQuery, concepts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/concepts?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    { title: 'Distributed Systems', category: 'Distributed Systems', icon: <CloudQueue />, desc: 'CAP Theorem, Consensus algorithms, replication strategies', color: 'from-blue-500 to-indigo-500' },
    { title: 'Databases & Storage', category: 'Databases', icon: <Storage />, desc: 'NoSQL, Relational, Sharding, LSM Trees, Indexes', color: 'from-indigo-500 to-purple-500' },
    { title: 'Caching & Performance', category: 'Caching', icon: <Speed />, desc: 'Redis, Memcached, CDN caching strategies, Eviction policies', color: 'from-cyan-500 to-teal-500' },
    { title: 'Security & Identity', category: 'Security', icon: <Security />, desc: 'OAuth2, JWT, DDoS protection, TLS/SSL termination', color: 'from-rose-500 to-pink-500' },
    { title: 'APIs & Gateways', category: 'Backend', icon: <Code />, desc: 'GraphQL, gRPC, REST, Rate limiting, Service meshes', color: 'from-amber-500 to-orange-500' },
    { title: 'Big Data & Pipelines', category: 'Messaging', icon: <Psychology />, desc: 'Kafka, Spark, Event sourcing, Message brokers', color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="min-h-screen bg-bg-app text-white relative overflow-hidden selection:bg-primary/30">
      {/* Premium Aurora Background */}
      <div className="absolute inset-0 aurora-bg -z-10" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(124,58,237,0.15),transparent_50%)]" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass-morphism px-6 py-3 rounded-2xl border-white/5 shadow-2xl">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <Psychology className="text-white text-2xl" />
            </div>
            <span className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 group-hover:to-primary transition-all duration-300">CACI</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Learning Paths', 'Ecosystem', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm font-medium text-text-secondary hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button onClick={() => navigate('/dashboard')} className="rounded-xl px-6 py-2 bg-primary hover:bg-primary-light shadow-lg shadow-primary/20 border-none">
                Command Center
              </Button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Sign in</Link>
                <Button 
                  onClick={() => navigate('/register')} 
                  className="rounded-xl px-6 py-2 bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 border-none font-bold shadow-lg shadow-primary/20 flex items-center gap-2 group/btn"
                >
                  Get Started
                  <ArrowForward className="text-sm group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-xs font-semibold mb-8 animate-float">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              v2.0: AI-Powered Learning Ecosystem
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
              Master <span className="text-gradient">System Design</span> <br />
              for the AI Era.
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary mb-12 leading-relaxed">
              Transform your engineering career with our premium, interactive platform. 
              Visualize complex architectures, track your progress with XP, and learn 
              from high-end visual concept cards.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
              <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search architecture patterns, databases..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl glass-morphism border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-white placeholder:text-text-muted"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {filteredConcepts.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 glass-morphism rounded-xl border-white/5 overflow-hidden shadow-2xl z-20">
                    {filteredConcepts.slice(0, 5).map((c) => (
                      <div
                        key={c._id}
                        onClick={() => navigate(`/dashboard/concepts/${c._id}`)}
                        className="px-4 py-3 hover:bg-white/5 cursor-pointer flex items-center justify-between group"
                      >
                        <span className="text-sm font-medium">{c.metadata?.concept}</span>
                        <ArrowForward className="text-xs text-text-muted group-hover:translate-x-1 transition-transform" />
                      </div>
                    ))}
                  </div>
                )}
              </form>
              <Button 
                onClick={() => navigate('/register')} 
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-primary via-primary to-accent hover:opacity-90 text-white font-black text-lg shadow-2xl shadow-primary/30 border-none transition-all hover:-translate-y-1 flex items-center justify-center gap-3 group/hero-btn"
              >
                Start Learning Free
                <ArrowForward className="group-hover/hero-btn:translate-x-2 transition-transform duration-300" />
              </Button>
            </div>

            {/* Dashboard Preview Mockup */}
            <div className="relative max-w-6xl mx-auto">
              <div className="absolute inset-0 bg-primary/20 blur-[120px] -z-10" />
              <div className="glass-morphism rounded-[2.5rem] border-white/10 p-4 shadow-2xl">
                <div className="rounded-[1.5rem] overflow-hidden border border-white/5 shadow-inner">
                  <img 
                    src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2000" 
                    alt="CACI Dashboard Preview" 
                    className="w-full aspect-[16/9] object-cover opacity-80"
                  />
                  {/* Floating Mockup Elements */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
                    <div className="p-8 rounded-3xl glass-morphism border-white/20 shadow-2xl animate-float">
                       <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                            <CheckCircle className="text-success text-2xl" />
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-bold">Concept Mastered!</div>
                            <div className="text-xs text-text-muted">Distributed Caching +50 XP</div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Architectural Pillars</h2>
            <p className="text-text-secondary text-lg">Curated knowledge paths for modern engineering leaders.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(`/dashboard/concepts?category=${encodeURIComponent(cat.category)}`)}
                className="group p-8 rounded-[2rem] glass-morphism border-white/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 premium-shadow cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{cat.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-6">{cat.desc}</p>
                <div className="flex items-center gap-2 text-primary-light text-sm font-bold opacity-0 group-hover:opacity-100 transition-all">
                  Explore Module <ArrowForward className="text-xs" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Active Learners', value: '50k+', icon: <People /> },
              { label: 'Concepts', value: '800+', icon: <Explore /> },
              { label: 'System Success', value: '99.9%', icon: <TrendingUp /> },
              { label: 'XP Awarded', value: '1.2M', icon: <Star /> },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <div className="text-primary-light mb-2 opacity-50">{stat.icon}</div>
                <div className="text-4xl font-black mb-1">{stat.value}</div>
                <div className="text-text-muted text-sm font-medium uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_70%)] -z-10" />
        <div className="max-w-4xl mx-auto glass-morphism p-16 rounded-[3rem] border-white/10 relative">
          <div className="absolute top-0 right-0 p-8">
            <Psychology className="text-primary/20 text-9xl -rotate-12" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to architect the <br /><span className="text-gradient">future?</span></h2>
          <p className="text-xl text-text-secondary mb-12 max-w-xl mx-auto">
            Join thousands of senior engineers mastering high-scale architecture with CACI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
              onClick={() => navigate('/register')} 
              className="px-12 py-5 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-black text-xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(124,58,237,0.3)] border-none flex items-center gap-3 group/cta-btn"
            >
              Start Your Journey
              <ArrowForward className="group-hover/cta-btn:translate-x-2 transition-transform duration-300" />
            </Button>
            <Button onClick={() => navigate('/dashboard/concepts')} className="px-10 py-5 rounded-2xl glass-morphism border-white/20 text-white font-bold text-xl hover:bg-white/5 transition-all">
              Browse Concepts
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-bg-app">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Psychology className="text-white text-lg" />
            </div>
            <span className="text-lg font-bold tracking-tighter">CACI</span>
          </div>
          <div className="flex gap-8 text-sm text-text-muted">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Changelog</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
          <p className="text-xs text-text-muted/50">© 2026 CACI Platforms Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
