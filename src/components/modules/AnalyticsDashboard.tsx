import { useState, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Activity, Users, Zap, Cpu, HardDrive } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: number;
}

const MetricCard = ({ label, value, icon: Icon, color, trend }: MetricCardProps) => (
  <div className="bg-surface-elevated rounded border border-graphite/30 p-4 hover:border-electric-cyan/30 transition-all">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-steel uppercase tracking-wider font-mono">{label}</span>
      <Icon className={`w-4 h-4 text-${color}`} />
    </div>
    <div className="flex items-baseline gap-2">
      <div className="text-2xl font-mono text-chrome font-semibold">{value}</div>
      {trend !== undefined && (
        <span className={`text-xs font-mono ${trend >= 0 ? 'text-electric-green' : 'text-electric-crimson'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
  </div>
);

export const AnalyticsDashboard = () => {
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    totalModules: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    uptime: 99.9,
    requests: 0,
  });

  const [timeSeriesData, setTimeSeriesData] = useState([
    { time: '00:00', users: 0, cpu: 0, memory: 0, requests: 0 },
  ]);

  const [moduleUsage, setModuleUsage] = useState([
    { name: 'Chat', value: 0 },
    { name: 'Code', value: 0 },
    { name: 'Gallery', value: 0 },
    { name: 'Music', value: 0 },
    { name: 'Journal', value: 0 },
  ]);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      // Update metrics
      setMetrics({
        activeUsers: Math.floor(Math.random() * 150) + 50,
        totalModules: Math.floor(Math.random() * 8) + 15,
        cpuUsage: Math.floor(Math.random() * 40) + 30,
        memoryUsage: Math.floor(Math.random() * 30) + 40,
        uptime: 99.9,
        requests: Math.floor(Math.random() * 1000) + 5000,
      });

      // Update time series data
      setTimeSeriesData(prev => {
        const newData = [
          ...prev.slice(-19), // Keep last 19 items
          {
            time: timeStr,
            users: Math.floor(Math.random() * 100) + 50,
            cpu: Math.floor(Math.random() * 50) + 20,
            memory: Math.floor(Math.random() * 40) + 30,
            requests: Math.floor(Math.random() * 200) + 100,
          },
        ];
        return newData;
      });

      // Update module usage
      setModuleUsage([
        { name: 'Chat', value: Math.floor(Math.random() * 50) + 30 },
        { name: 'Code', value: Math.floor(Math.random() * 40) + 25 },
        { name: 'Gallery', value: Math.floor(Math.random() * 35) + 20 },
        { name: 'Music', value: Math.floor(Math.random() * 30) + 15 },
        { name: 'Journal', value: Math.floor(Math.random() * 25) + 10 },
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full overflow-auto bg-surface p-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-mono text-chrome mb-1 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-electric-cyan" />
          System Analytics
        </h2>
        <p className="text-sm text-steel font-mono">Real-time performance monitoring</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <MetricCard
          label="Active Users"
          value={metrics.activeUsers}
          icon={Users}
          color="electric-cyan"
          trend={Math.floor(Math.random() * 20) - 5}
        />
        <MetricCard
          label="Active Modules"
          value={metrics.totalModules}
          icon={Zap}
          color="electric-violet"
          trend={Math.floor(Math.random() * 10)}
        />
        <MetricCard
          label="Total Requests"
          value={metrics.requests.toLocaleString()}
          icon={Activity}
          color="electric-amber"
          trend={Math.floor(Math.random() * 15)}
        />
        <MetricCard
          label="CPU Usage"
          value={`${metrics.cpuUsage}%`}
          icon={Cpu}
          color="electric-crimson"
        />
        <MetricCard
          label="Memory Usage"
          value={`${metrics.memoryUsage}%`}
          icon={HardDrive}
          color="electric-green"
        />
        <MetricCard
          label="Uptime"
          value={`${metrics.uptime}%`}
          icon={TrendingUp}
          color="electric-cyan"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* User Activity Chart */}
        <div className="bg-surface-elevated rounded border border-graphite/30 p-4">
          <h3 className="text-sm font-mono text-chrome mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-electric-cyan" />
            User Activity
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis
                dataKey="time"
                stroke="#6B7280"
                fontSize={10}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={10}
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A0A0A',
                  border: '1px solid #374151',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#E0E0E0' }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#00D9FF"
                fillOpacity={1}
                fill="url(#colorUsers)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* System Resources Chart */}
        <div className="bg-surface-elevated rounded border border-graphite/30 p-4">
          <h3 className="text-sm font-mono text-chrome mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-electric-violet" />
            System Resources
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis
                dataKey="time"
                stroke="#6B7280"
                fontSize={10}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={10}
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A0A0A',
                  border: '1px solid #374151',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#E0E0E0' }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px' }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="cpu"
                stroke="#FFD700"
                strokeWidth={2}
                name="CPU %"
                dot={{ fill: '#FFD700', r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="memory"
                stroke="#9D00FF"
                strokeWidth={2}
                name="Memory %"
                dot={{ fill: '#9D00FF', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Module Usage and Requests */}
      <div className="grid grid-cols-2 gap-4">
        {/* Module Usage Bar Chart */}
        <div className="bg-surface-elevated rounded border border-graphite/30 p-4">
          <h3 className="text-sm font-mono text-chrome mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-electric-amber" />
            Module Usage
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={moduleUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                fontSize={10}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={10}
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A0A0A',
                  border: '1px solid #374151',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
                cursor={{ fill: 'rgba(0, 217, 255, 0.1)' }}
              />
              <Bar
                dataKey="value"
                fill="#00D9FF"
                radius={[4, 4, 0, 0]}
                name="Sessions"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Request Rate */}
        <div className="bg-surface-elevated rounded border border-graphite/30 p-4">
          <h3 className="text-sm font-mono text-chrome mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-electric-green" />
            Request Rate
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00FF88" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis
                dataKey="time"
                stroke="#6B7280"
                fontSize={10}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={10}
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A0A0A',
                  border: '1px solid #374151',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#E0E0E0' }}
              />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="#00FF88"
                fillOpacity={1}
                fill="url(#colorRequests)"
                strokeWidth={2}
                name="Requests/min"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
