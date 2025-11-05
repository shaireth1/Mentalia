
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const barData = [
  {name:'Lun', value:45},{name:'Mar', value:52},{name:'Mié', value:38},
  {name:'Jue', value:62},{name:'Vie', value:44},{name:'Sáb', value:29},{name:'Dom', value:25}
];

const pieData = [
  {name:'Ansiedad', value:35}, {name:'Estrés', value:28},
  {name:'Tristeza', value:20}, {name:'Preocupación', value:12}, {name:'Enojo', value:5}
];

const lineData = [
  {name:'Ene', high:24, crit:10},
  {name:'Feb', high:18, crit:8},
  {name:'Mar', high:32, crit:15},
  {name:'Abr', high:18, crit:6},
  {name:'May', high:22, crit:9}
];

const COLORS = ['#8b5cf6','#ef4444','#3b82f6','#f59e0b','#10b981'];

export function DashboardCharts(){
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h4 className="mb-4">Uso Semanal del Chatbot</h4>
        <div style={{width:'100%', height:240}}>
          <ResponsiveContainer>
            <BarChart data={barData} margin={{top:10,right:10,left:0,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h4 className="mb-4">Emociones Más Detectadas</h4>
        <div style={{width:'100%', height:240}}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
        <h4 className="mb-4">Evolución de Alertas Críticas</h4>
        <div style={{width:'100%', height:260}}>
          <ResponsiveContainer>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="high" stroke="#f59e0b" dot={{ r:4 }} />
              <Line type="monotone" dataKey="crit" stroke="#ef4444" dot={{ r:4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
