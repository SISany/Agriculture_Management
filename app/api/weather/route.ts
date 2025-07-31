import {NextResponse} from 'next/server'

// Bangladesh major cities coordinates
const bangladeshCities = [
  { name: "Dhaka", lat: 23.8103, lon: 90.4125 },
  { name: "Chittagong", lat: 22.3569, lon: 91.7832 },
  { name: "Sylhet", lat: 24.8949, lon: 91.8687 },
  { name: "Rajshahi", lat: 24.3636, lon: 88.6241 },
  { name: "Khulna", lat: 22.8456, lon: 89.5403 },
  { name: "Barisal", lat: 22.7010, lon: 90.3535 },
  { name: "Rangpur", lat: 25.7439, lon: 89.2752 }
]

// Helper function to determine current season
const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return "Spring"
  if (month >= 6 && month <= 8) return "Summer"
  if (month >= 9 && month <= 11) return "Autumn"
  return "Winter"
}

export async function GET() {
  try {
    const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || process.env.WEATHER_API_KEY
    
    if (!WEATHER_API_KEY || WEATHER_API_KEY === "demo_key" || WEATHER_API_KEY === "your_openweathermap_api_key_here") {
      return NextResponse.json(
        { 
          error: 'Weather API key not configured properly. Please add a valid OpenWeatherMap API key to your .env.local file.',
          fallback: true
        }, 
        { status: 400 }
      )
    }

    const weatherPromises = bangladeshCities.map(async (city) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${WEATHER_API_KEY}&units=metric`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            }
          }
        )

        if (!response.ok) {
          console.error(`Weather API error for ${city.name}: ${response.status} - ${response.statusText}`)
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        // Transform API data to match our structure
        return {
          weather_id: `W${Date.now()}_${city.name}`,
          location: city.name,
          date_recorded: new Date().toISOString().split('T')[0],
          rainfall: data.rain ? (data.rain['1h'] || 0) : 0,
          temperature: Math.round(data.main.temp * 10) / 10,
          season: getCurrentSeason(),
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          wind_speed: data.wind?.speed || 0,
          weather_description: data.weather[0]?.description || '',
          weather_main: data.weather[0]?.main || '',
          feels_like: Math.round(data.main.feels_like * 10) / 10
        }
      } catch (error) {
        console.error(`Error fetching weather for ${city.name}:`, error)
        // Return fallback data for this city
        return {
          weather_id: `W${Date.now()}_${city.name}`,
          location: city.name,
          date_recorded: new Date().toISOString().split('T')[0],
          rainfall: 0,
          temperature: 25,
          season: getCurrentSeason(),
          humidity: 60,
          pressure: 1013,
          wind_speed: 2,
          weather_description: 'data unavailable',
          weather_main: 'Unknown',
          feels_like: 25
        }
      }
    })

    const results = await Promise.all(weatherPromises)
    
    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Weather API route error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch weather data',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}