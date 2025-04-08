import pandas as pd


def checkDuplicates(file):
    duplicates = file.duplicated()
    duplicateRow = duplicates.sum()
    print(f"There are {duplicateRow} duplicate rows.")
    # file.drop_duplicates(inplace=True)
    return duplicateRow


def checkInvalidRows(file):
    if 'timestamp' not in file.columns:
        print("The 'timestamp' column is missing.")
        return file, 0, 0
    file.loc[:, 'timestamp'] = pd.to_datetime(file['timestamp'], format='%d/%m/%Y %H:%M', errors='coerce')
    invalidTimestamp = file['timestamp'].isna().sum()
    print(f"There are {invalidTimestamp} rows with invalid timestamps.")
    file = file.dropna(subset=['timestamp'])
    file.loc[:, 'value'] = pd.to_numeric(file['value'], errors='coerce')
    invalidValue = file['value'].isna().sum()
    print(f"There are {invalidValue} rows with non-numeric or empty 'value'.")
    file = file.dropna(subset=['value'])
    return file, invalidTimestamp, invalidValue


file = pd.read_csv('time_series.csv')
file.columns = file.columns.str.strip()
duplicate_count = checkDuplicates(file)
file, invalid_timestamp_count, invalid_value_count = checkInvalidRows(file)
file.to_csv('updated_time_series.csv', index=False)
print(f"{len(file)} rows remain.")
