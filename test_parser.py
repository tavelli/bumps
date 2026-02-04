# Copy your function here
def parse_to_interval(raw_time):
    if not raw_time: return None
    clean = raw_time.upper().replace('AM', '').replace('PM', '').strip()
    parts = clean.split(':')
    try:
        if len(parts) == 3:
            h, m, s = parts
            if int(h) >= 5: 
                return f"{h} minutes {m}.{s.replace('.', '')} seconds"
            return f"{h} hours {m} minutes {s} seconds"
        elif len(parts) == 2:
            m, s = parts
            return f"{m} minutes {s} seconds"
        return clean
    except:
        return None

# Test cases from your actual data
test_data = [
    "00:35:07.3",
    "45:59",
    "1:00:45",
    "1:00:30.00",
    "45:38.3",
    "1:04:52.6",
    "30:42:00",
    "61:00:38 AM",
    "53:34:00"
]

print(f"{'INPUT':<20} | {'OUTPUT (POSTGRES READY)':<30}")
print("-" * 55)
for item in test_data:
    print(f"{item:<20} | {parse_to_interval(item):<30}")