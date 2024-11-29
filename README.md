# Weather Forecast and Solar Energy Prediction Application

This repository contains the solution for the recruitment task provided by Codibly IT Academy. The application is built with the following stack:

- **Backend**: TypeScript + Express
- **Frontend**: React + TypeScript + Next.js

## Project Overview

The application provides weather forecasts for the next 7 days and estimates solar energy production based on the forecasted weather conditions.

## Backend

### Features

- **Two API Endpoints**:
  1. **7-day Weather Forecast**:
     - Returns:
       - Date
       - Weather code
       - Minimum and maximum temperatures
       - Estimated energy production in kWh
  2. **Weekly Summary**:
     - Returns:
       - Average pressure
       - Average daily sun exposure time
       - Extreme temperatures of the week
       - General weather summary (e.g., "Rainy week" or "Dry week")

- **Calculation**:
  - Solar energy production:
    ```
    Energy [kWh] = Power [kW] x Sun Exposure Time [h] x Panel Efficiency
    ```
    - Power = 2.5 kW
    - Efficiency = 20%

- **Validation**:
  - Validates latitude and longitude inputs.
  - Handles errors from external API.

- **Data Integration**:
  - Fetches weather data from the [Open-Meteo API](https://open-meteo.com/).


## Frontend

### Features

- **Weather Table**:
  - Displays:
    - Date (DD/MM/YYYY)
    - Weather icon
    - Minimum and maximum temperatures
    - Estimated energy production (kWh)

- **Footer Summary**:
  - Displays:
    - Weekly extreme temperatures
    - Average pressure
    - Average sun exposure time
    - General weather summary

- **Extras**:
  - Automatically detects user location.
  - Responsiveness and Dark Mode.
