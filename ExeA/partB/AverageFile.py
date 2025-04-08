import pandas as pd

df = pd.read_csv("updated_time_series.csv")

df["timestamp"] = pd.to_datetime(df["timestamp"], dayfirst=False)

df["value"] = pd.to_numeric(df["value"], errors="coerce")

df["hour"] = df["timestamp"].dt.floor("h")

hourly_averages = df.groupby("hour")["value"].mean().reset_index()

hourly_averages.to_csv("average.csv", index=False)

print("The average.csv file was created successfully!")