import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt

# Load CSV
df = pd.read_csv("forecast/forecast_input.csv")


# Example: filter for one region
region_of_interest = df['region'].unique()[0]  # You can change this
region_df = df[df['region'] == region_of_interest].copy()

# Prophet expects columns: ds (datetime) and y (value to forecast)
region_df.rename(columns={'timestamp': 'ds', 'count': 'y'}, inplace=True)

# Create and fit model
model = Prophet()
region_df['ds'] = pd.to_datetime(region_df['ds']).dt.tz_localize(None)

model.fit(region_df)

# Forecast next 10 intervals (10 x 10-min = ~1.5 hours)
future = model.make_future_dataframe(periods=10, freq='10min')
forecast = model.predict(future)

# Plot
fig = model.plot(forecast)
plt.title(f'Forecast for region {region_of_interest}')
plt.xlabel('Time')
plt.ylabel('Anomaly count')
plt.show()
