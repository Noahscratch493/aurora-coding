import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faPlus, faEye, faTrash, faSearch, faArrowRight, faStar, faUsers, faCode, faGlobe, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SharedProject {
  id: string;
  name: string;
  author: string;
  thumbnail: string;
  createdAt: number;
  user_id: string | null;
}

type FilterMode = 'all' | 'mine';

export default function Home() {
  const { user, loading: authLoading, signOut, username } = useAuth();
  const [projects, setProjects] = useState<SharedProject[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('shared_projects').select('id, name, author, thumbnail, created_at, user_id')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) {
          setProjects(data.map(p => ({
            id: p.id, name: p.name, author: p.author,
            thumbnail: p.thumbnail, createdAt: new Date(p.created_at).getTime(),
            user_id: p.user_id,
          })));
        }
        setLoading(false);
      });
  }, []);

  const filtered = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'mine' && user && p.user_id === user.id);
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('shared_projects').delete().eq('id', id);
    if (error) {
      alert('You can only delete your own projects.');
      return;
    }
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border aurora-gradient">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground tracking-tight">Aurora</h1>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">BETA</span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-xs text-muted-foreground">
                  <FontAwesomeIcon icon={faUser} className="w-3 h-3 mr-1" />
                  {username}
                </span>
                <button onClick={signOut}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <FontAwesomeIcon icon={faRightFromBracket} className="w-3 h-3" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/auth"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors">
                Sign In
              </Link>
            )}
            <Link to="/editor"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
              Create
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="aurora-gradient border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Create stories, games, and animations
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Aurora is a free visual programming language where you can create your own interactive stories, games, and animations — then share them with the world.
          </p>
          <Link to="/editor"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground text-base font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
            Start Creating
            <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
          </Link>
          <div className="flex items-center justify-center gap-10 mt-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-primary" />
              <span>Free to use</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCode} className="w-4 h-4 text-accent" />
              <span>Blocks</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-secondary" />
              <span>Share projects</span>
            </div>
          </div>
        </div>
      </section>

      {/* Shared Projects */}
      <section className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">
              {filter === 'mine' ? 'My Projects' : 'Shared Projects'}
            </h3>
            <div className="flex items-center gap-0">
              {/* Filter dropdown icons */}
              <div className="flex items-center border border-border rounded-l-lg overflow-hidden">
                <button
                  onClick={() => setFilter('all')}
                  className={`flex items-center justify-center w-9 h-9 transition-colors ${
                    filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  title="All Projects"
                >
                  <FontAwesomeIcon icon={faGlobe} className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (!user) {
                      alert('Sign in to see your projects');
                      return;
                    }
                    setFilter('mine');
                  }}
                  className={`flex items-center justify-center w-9 h-9 border-l border-border transition-colors ${
                    filter === 'mine' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  title="My Projects"
                >
                  <FontAwesomeIcon icon={faUser} className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Search bar */}
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text" placeholder="Search projects..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-r-lg border border-l-0 border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 h-9"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-sm">Loading projects...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-sm mb-2">
                {filter === 'mine' ? 'You haven\'t shared any projects yet' :
                  projects.length === 0 ? 'No shared projects yet' : 'No projects match your search'}
              </p>
              <p className="text-xs text-muted-foreground/70 mb-6">
                Create a project and share it to see it here!
              </p>
              <Link to="/editor"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                Create a Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(project => (
                <div key={project.id} className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all">
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    {project.thumbnail ? (
                      <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faWandMagicSparkles} className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Link to={`/project/${project.id}`}
                        className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium">
                        <FontAwesomeIcon icon={faEye} className="w-3 h-3 mr-1" /> See Inside
                      </Link>
                      {user && project.user_id === user.id && (
                        <button onClick={() => handleDelete(project.id)}
                          className="px-3 py-1.5 rounded-md bg-destructive text-destructive-foreground text-xs font-medium">
                          <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-semibold text-foreground truncate">{project.name}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">by {project.author}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4 text-primary" />
            <span>Aurora</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Created By CoolestWiiGuy, also known as Noahscratch493
          </p>
        </div>
      </footer>
    </div>
  );
}
