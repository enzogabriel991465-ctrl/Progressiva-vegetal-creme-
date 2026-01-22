
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sun, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Smile, 
  BookOpen, 
  Coffee,
  Sparkles,
  MapPin,
  RefreshCw,
  Image as ImageIcon,
  Palette,
  Download
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { getMorningEssence, generateImage } from './services/geminiService';
import { MorningEssence, Task, MoodData } from './types';
import Card from './components/Card';

const INITIAL_MOOD: MoodData[] = [
  { day: 'Seg', level: 7 },
  { day: 'Ter', level: 6 },
  { day: 'Qua', level: 8 },
  { day: 'Qui', level: 9 },
  { day: 'Sex', level: 7 },
  { day: 'Sáb', level: 8 },
  { day: 'Dom', level: 10 },
];

const App: React.FC = () => {
  const [essence, setEssence] = useState<MorningEssence | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [location, setLocation] = useState<string>("");
  const [mood, setMood] = useState<MoodData[]>(INITIAL_MOOD);
  
  // Image generation states
  const [imagePrompt, setImagePrompt] = useState("Uma mulher caminhando no campo ao amanhecer");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const fetchEssence = useCallback(async (loc?: string) => {
    setLoading(true);
    try {
      const data = await getMorningEssence(loc);
      setEssence(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setImageLoading(true);
    const img = await generateImage(imagePrompt);
    setGeneratedImage(img);
    setImageLoading(false);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const locStr = `${pos.coords.latitude}, ${pos.coords.longitude}`;
          setLocation(locStr);
          fetchEssence(locStr);
        },
        () => fetchEssence()
      );
    } else {
      fetchEssence();
    }
  }, [fetchEssence]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const task: Task = { id: Date.now().toString(), text: newTask, completed: false };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-400 to-yellow-300 p-3 rounded-2xl shadow-lg shadow-orange-200">
            <Sun className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 leading-none">Aura</h1>
            <p className="text-orange-600 font-medium">Seu despertar inteligente</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => fetchEssence(location)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-100 rounded-xl text-orange-600 hover:bg-orange-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Novo Bão Dia</span>
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Greeting & Inspiration */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Hero Greeting */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-orange-50">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-orange-100 rounded w-3/4"></div>
                <div className="h-4 bg-orange-50 rounded w-1/2"></div>
                <div className="h-20 bg-orange-50 rounded w-full"></div>
              </div>
            ) : essence && (
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-4xl font-bold text-gray-800 tracking-tight">
                    {essence.greeting}
                  </h2>
                  <Sparkles className="text-yellow-500 w-8 h-8" />
                </div>
                <p className="text-xl text-gray-600 italic mb-6 leading-relaxed">
                  "{essence.quote}"
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-white/60 px-4 py-2 rounded-full border border-orange-100 flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    {location ? "Localização Detectada" : "Onde quer que você esteja"}
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* New Image Generation Card */}
          <Card title="Inspiração Visual" icon={<Palette className="w-5 h-5" />}>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <input 
                  type="text" 
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Descreva a arte que deseja criar..."
                  className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                />
                <button 
                  onClick={handleGenerateImage}
                  disabled={imageLoading}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:bg-gray-300"
                >
                  {imageLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  <span>Criar Arte</span>
                </button>
              </div>

              <div className="relative min-h-[300px] w-full bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center border border-dashed border-gray-200">
                {imageLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 font-medium">Pintando sua manhã...</p>
                  </div>
                ) : generatedImage ? (
                  <div className="group relative w-full h-full">
                    <img src={generatedImage} alt="Arte Gerada" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <a href={generatedImage} download="aura-inspira.png" className="p-3 bg-white rounded-full text-gray-800 hover:scale-110 transition-transform">
                          <Download className="w-6 h-6" />
                       </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400">Gere uma imagem para decorar seu início de dia.</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Palavra do Dia" icon={<BookOpen className="w-5 h-5" />}>
              {essence && (
                <div>
                  <h4 className="text-2xl font-bold text-orange-600 mb-1">{essence.wordOfDay.word}</h4>
                  <p className="text-gray-600">{essence.wordOfDay.meaning}</p>
                </div>
              )}
            </Card>

            <Card title="Dica de Bem-estar" icon={<Sparkles className="w-5 h-5" />}>
              {essence && <p className="text-gray-700">{essence.tip}</p>}
            </Card>
          </div>
        </div>

        {/* Right Column: Tasks & Mood */}
        <div className="space-y-6">
          <Card title="Tarefas da Manhã" icon={<CheckCircle2 className="w-5 h-5" />}>
            <form onSubmit={addTask} className="flex gap-2 mb-6">
              <input 
                type="text" 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="O que bão vamos fazer?"
                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
              />
              <button 
                type="submit"
                className="p-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
              >
                <Plus className="w-6 h-6" />
              </button>
            </form>

            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-transparent hover:border-orange-100 transition-all group">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${task.completed ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-300'}`}
                    >
                      {task.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <span className={task.completed ? 'line-through text-gray-400' : 'text-gray-700'}>{task.text}</span>
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Energia Semanal" icon={<Smile className="w-5 h-5" />}>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mood}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="level" stroke="#f97316" strokeWidth={3} dot={{fill: '#f97316'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="bg-orange-600 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Coffee className="w-6 h-6" />
              <span className="font-semibold uppercase text-xs opacity-80">Insight</span>
            </div>
            <p className="font-medium">"Cada manhã é uma tela em branco pronta para ser pintada."</p>
          </Card>
        </div>
      </main>

      <footer className="mt-16 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Aura - Elevando seu despertar.</p>
      </footer>
    </div>
  );
};

export default App;
