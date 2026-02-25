import { Thermometer, Wind, Droplets } from 'lucide-react'

export default function WeatherWidget({ weather }) {
  if (!weather || weather.error) return null

  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`

  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-white border border-white/30 min-w-[200px]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-white/80 text-xs font-medium uppercase tracking-wide">
            Current Weather
          </p>
          <p className="text-3xl font-bold">{weather.temperature}°C</p>
          <p className="text-white/90 text-sm capitalize">{weather.description}</p>
        </div>
        <img src={iconUrl} alt={weather.description} className="w-16 h-16 drop-shadow-lg" />
      </div>
      <div className="mt-3 flex gap-4 text-xs text-white/80">
        <span className="flex items-center gap-1">
          <Thermometer className="w-3 h-3" />
          Feels {weather.feels_like}°C
        </span>
        <span className="flex items-center gap-1">
          <Droplets className="w-3 h-3" />
          {weather.humidity}%
        </span>
        <span className="flex items-center gap-1">
          <Wind className="w-3 h-3" />
          {weather.wind_speed} km/h
        </span>
      </div>
    </div>
  )
}
