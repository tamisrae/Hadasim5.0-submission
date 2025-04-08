import pandas as pd

def checkDuplicates(file):
    duplicates = file.duplicated()
    duplicateRow = duplicates.sum()
    print(f"There are {duplicateRow} duplicate rows.")
    return duplicateRow

def checkInvalidRows(file):
    if 'timestamp' not in file.columns:
        print("The 'timestamp' column is missing.")
        return file, 0, 0
    file.loc[:, 'timestamp'] = pd.to_datetime(file['timestamp'], format='%d/%m/%Y %H:%M', errors='coerce')
    invalidTimestamp = file['timestamp'].isna().sum()
    print(f"There are {invalidTimestamp} rows with invalid timestamps.")
    file = file.dropna(subset=['timestamp'])
    file.loc[:, 'mean_value'] = pd.to_numeric(file['mean_value'], errors='coerce')
    invalidValue = file['mean_value'].isna().sum()
    print(f"There are {invalidValue} rows with non-numeric or empty 'mean_value'.")
    file = file.dropna(subset=['mean_value'])
    return file, invalidTimestamp, invalidValue

file = pd.read_parquet('time_series.parquet')

file.columns = file.columns.str.strip()

duplicate_count = checkDuplicates(file)
file, invalid_timestamp_count, invalid_value_count = checkInvalidRows(file)

file.to_parquet('updated_time_series.parquet', index=False)

print(f"{len(file)} rows remain.")
