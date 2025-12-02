/**
 * Query the Open-Meteo API for current weather conditions
 * @param {number} latitude - Geographic latitude coordinate
 * @param {number} longitude - Geographic longitude coordinate
 * @returns {Promise<Object>} Current weather data including temperature, apparent temperature, and precipitation probability
 */

type DailyWeather = {
  time: string
  weather_code: number,
  temperature_max: number,
  temperature_min: number,
  apparent_temperature_max: number,
  apparent_temperature_min: number,
  sunshine_duration: number,
  rain_sum: number,
  showers_sum: number,
  snowfall_sum: number,
  precipitation_probability_max: number,
  wind_speed_max: number,
}

export type WeatherForecast = {
  latitude: number,
  longitude: number,
  daily_weather: DailyWeather[]
}

export async function getWeatherForecast(latitude: number, longitude: number): Promise<object> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunshine_duration,rain_sum,showers_sum,snowfall_sum,precipitation_probability_max,wind_speed_10m_max&forecast_days=16`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    const weatherForecast: WeatherForecast = {
      latitude: data.latitude,
      longitude: data.longitude,
      daily_weather: data.daily.time.map((day: string, index: number) => {
        const weather: DailyWeather = {
          time: day,
          weather_code: data.daily.weather_code[index],
          temperature_max: data.daily.temperature_2m_max[index],
          temperature_min: data.daily.temperature_2m_min[index],
          apparent_temperature_max: data.daily.apparent_temperature_max[index],
          apparent_temperature_min: data.daily.apparent_temperature_min[index],
          sunshine_duration: data.daily.sunshine_duration[index],
          rain_sum: data.daily.rain_sum[index],
          showers_sum: data.daily.showers_sum[index],
          snowfall_sum: data.daily.snowfall_sum[index],
          precipitation_probability_max: data.daily.precipitation_probability_max[index],
          wind_speed_max: data.daily.wind_speed_10m_max[index],
        }
        return weather
      })
    }
    console.log(weatherForecast)
    return weatherForecast
  } catch (error: any) {
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
}
