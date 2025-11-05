
export default function dashboardCard({title, value, icon}){
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm min-w-[14rem]">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        <div className="text-3xl text-gray-300">{icon}</div>
      </div>
    </div>
  );
}
