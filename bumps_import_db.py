import requests
from bs4 import BeautifulSoup
from datetime import datetime
import re
from supabase import create_client, Client

import os
from dotenv import load_dotenv

# Specify the path to your .env.local file
dotenv_path = '.env.local'

# Load the environment variables from the specified file
load_dotenv(dotenv_path=dotenv_path)

# --- CONFIGURATION ---
TRIAL_MODE = True 
SUPABASE_URL = "https://odwyxdiizeyeznymzwds.supabase.co"
SUPABASE_KEY = os.getenv('SUPBASE_SECRETY_KEY')

print(f"Using Supabase Key: {SUPABASE_KEY[:8]}...")

# --- EVENT NAME MAPPING ---
EVENT_NAME_MAP = {
    "Washington": "Mt. Washington",
    "Ascutney": "Mt. Ascutney",
    "Greylock": "Mt. Greylock",
    "Whiteface": "Whiteface Mountain",
    "High Point": "High Point",
    "Kearsarge": "Mt. Kearsarge",
    "Prospect": "Prospect Mountain",
    "Allen": "Allen Clark",
    "Equinox": "Mt. Equinox",
    "Okemo": "Mt. Okemo",
    "Newton": "Newton's Revenge",
    "Kanc": "Crank the Kanc",
    "Wachusett": "Mt. Wachusett",
    "Newton": "Newton's Revenge",
    "Bird":"Mt. Washington Early Bird"
}

def get_canonical_name(raw_name):
    for keyword, canonical in EVENT_NAME_MAP.items():
        if keyword.lower() in raw_name.lower():
            return canonical
    return raw_name

def fetch_race_details(race_id):
    """
    Navigates to race page.
    Returns: (date_string, dict_of_rider_times)
    """
    url = f"https://www.road-results.com/race/{race_id}"
    headers = {'User-Agent': 'Mozilla/5.0'}
    rider_times = {}
    race_date = None

    # Hardcoded zero-based index for the 6th column
    TIME_COL_IDX = 5

    try:
        resp = requests.get(url, headers=headers)
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        # 1. Extract Date
        title_div = soup.find('div', id='resultstitle')
        if title_div:
            direct_text = "".join([t for t in title_div.contents if isinstance(t, str)]).strip()
            parts = direct_text.split('•')
            if len(parts) >= 2:
                raw_date_str = re.sub(r'\s+', ' ', parts[1].strip())
                for fmt in ("%b %d %Y", "%B %d %Y"):
                    try:
                        race_date = datetime.strptime(raw_date_str, fmt).strftime("%Y-%m-%d")
                        break
                    except ValueError:
                        continue

        # 2. Extract Times
        # We look for rows with id starting with 'r' (e.g., id="r118892")
        rows = soup.find_all('tr', id=re.compile(r'^r\d+'))
        
        for row in rows:
            rider_id = int(row['id'][1:]) # Remove the 'r'
            cols = row.find_all('td')
            if len(cols) > TIME_COL_IDX:
                time_val = cols[TIME_COL_IDX].text.strip()
                if time_val:
                    rider_times[rider_id] = time_val

    except Exception as e:
        print(f"   Error fetching details for race {race_id}: {e}")
    
    return race_date, rider_times

def scrape_and_upload(year, gender):
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    url = f"https://www.road-results.com/?n=results&sn=bumps&iframe=0&y={year}&series=B{str(year)[-2:]}_{gender}"
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    table = soup.find_all('table', {'class': 'datatable1'})[1]
    rows = table.find_all('tr')
    header_cells = rows[0].find_all(['th', 'td'])
    
    events_to_upsert = []
    race_column_map = {}
    # This will store {race_id: {rider_id: time_string}}
    race_time_lookups = {} 
    current_idx = 0

    # Process Headers
    for cell in header_cells:
        span = int(cell.get('colspan', 1))
        link = cell.find('a')
        if link and '/race/' in link.get('href', '') and "total" not in cell.text.lower():
            race_id = int(link['href'].split('/')[-1].split('#')[0])
            raw_name = link.get('title', cell.text.strip())
            event_name = get_canonical_name(raw_name)
            
            # Fetch date AND times for this race
            print(f"Fetching details for: {event_name} ({race_id})...")
            event_date, times_map = fetch_race_details(race_id)
            race_time_lookups[race_id] = times_map
            
            events_to_upsert.append({"name": event_name})
            race_column_map[current_idx] = {
                "race_id": race_id, 
                "event_name": event_name,
                "event_date": event_date
            }
        current_idx += span

    # Handle Events (Same as before)
    if not TRIAL_MODE:
        supabase.table("events").upsert(events_to_upsert, on_conflict="name").execute()
        db_events = supabase.table("events").select("id, name").execute()
        event_name_to_id = {item['name']: item['id'] for item in db_events.data}
    else:
        event_name_to_id = {e['name']: 999 for e in events_to_upsert}

    # Process Rows
    races_to_upsert = []
    riders_to_upsert = {}
    results_to_upsert = []

    for row in rows[1:]:
        cols = row.find_all('td')
        if len(cols) < 3: continue
        name_link = cols[2].find('a')
        if not name_link: continue
        
        r_id = int(name_link['href'].split('/')[-1])
        age_text = cols[1].find('span', {'class': 'category'}).text.strip() if cols[1].find('span') else "0"
        
        riders_to_upsert[r_id] = {
            "id": r_id,
            "name": name_link.text.strip().replace('\xa0', ' '),
            "gender": gender,
            "birth_year": year - int(age_text) if age_text.isdigit() and int(age_text) > 0 else None
        }

        for col_idx, info in race_column_map.items():
            if col_idx < len(cols):
                p_text = cols[col_idx].text.strip().replace('*', '').replace('-', '')
                if p_text and p_text not in ['DNS', 'DNF', '']:
                    # Get time from our lookup map
                    race_id = info["race_id"]
                    actual_time = race_time_lookups.get(race_id, {}).get(r_id)
                    
                    results_to_upsert.append({
                        "rider_id": r_id, 
                        "race_id": race_id, 
                        "points": float(p_text), 
                        "race_time": actual_time, # NEW FIELD
                        "year": year
                    })

    # Prepare Race instances
    for info in race_column_map.values():
        races_to_upsert.append({
            "id": info["race_id"], 
            "event_id": event_name_to_id.get(info["event_name"]), 
            "year": year,
            "event_date": info["event_date"]
        })

    # Final Execution (Same as before)
    if TRIAL_MODE:
        print(f"[TRIAL] Would upsert {len(races_to_upsert)} races.")
        print("[TRIAL] Sample Race:", races_to_upsert[0] if races_to_upsert else "None")
        print(f"[TRIAL] Would upsert {len(riders_to_upsert)} riders.")
        print("[TRIAL] Sample Rider:", list(riders_to_upsert.values())[0] if riders_to_upsert else "None")
        print(f"[TRIAL] Would upsert {len(results_to_upsert)} results.")
        print(f"[TRIAL] Sample Result with Time: {results_to_upsert[0] if results_to_upsert else 'None'}")
    else:
        supabase.table("races").upsert(races_to_upsert).execute()
        supabase.table("riders").upsert(list(riders_to_upsert.values())).execute()
        for i in range(0, len(results_to_upsert), 500):
            supabase.table("results").upsert(results_to_upsert[i:i+500], on_conflict="rider_id, race_id").execute()
        print("Successfully uploaded all data.")

    if TRIAL_MODE:
        print("Trial mode enabled; no data was uploaded.")

    else:
        trigger_view_refresh()

       
def trigger_view_refresh():
    try:
        response = supabase.rpc('refresh_all_reporting_views_standard').execute()
        print("Successfully triggered refresh.")
    except Exception as e:
        print(f"Error refreshing view: {e}")

if __name__ == "__main__":
   #  scrape_and_upload(2025, "M")
    scrape_and_upload(2025, "W")