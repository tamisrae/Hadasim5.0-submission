from collections import defaultdict, Counter
import re


def extract_error_code(line):
    match = re.search(r'Error:\s*(\w+)', line)
    return match.group(1) if match else None


def get_top_n_errors_bucket(filename, N):
    counter = Counter()

    with open(filename, 'r', encoding='utf-8') as f:
        for line in f:
            code = extract_error_code(line)
            if code:
                counter[code] += 1

    errorCounter = defaultdict(list)
    for code, numError in counter.items():
        errorCounter[numError].append(code)

    result = []
    for numError in sorted(errorCounter.keys(), reverse=True):
        for code in errorCounter[numError]:
            result.append((code, numError))
            if len(result) == N:
                return result

    return result
