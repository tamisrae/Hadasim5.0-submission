import pandas as pd

df = pd.read_parquet("updated_time_series.parquet")

df["timestamp"] = pd.to_datetime(df["timestamp"], dayfirst=False)

df["mean_value"] = pd.to_numeric(df["mean_value"], errors="coerce")

df["hour"] = df["timestamp"].dt.floor("h")

hourly_averages = df.groupby("hour")["mean_value"].mean().reset_index()

hourly_averages.to_parquet("average.parquet", index=False)

print("The average.parquet file was created successfully!")
