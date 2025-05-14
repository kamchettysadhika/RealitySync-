import json
import pandas as pd
from prophet import Prophet

with open('timeseries.json', 'r') as f:
    data = json.load(f)

df = pd.DataFrame(data)
model = Prophet()
model.fit(df)

future = model.make_future_dataframe(periods=24, freq='H')  # Next 24 hours
forecast = model.predict(future)

forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].to_json('forecast_output.json', orient='records')
print("Forecast complete.")
