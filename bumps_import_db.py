import requests
from bs4 import BeautifulSoup
from datetime import datetime
import re
from supabase import create_client, Client

# --- CONFIGURATION ---
TRIAL_MODE = False  # Set to False to actually write to Supabase
SUPABASE_URL = "https://odwyxdiizeyeznymzwds.supabase.co"
SUPABASE_KEY = "sb_publishable_RZVTd9lAbr9V5AmnUFYmcQ_ITOkLnay"


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

def extract_date_from_race_page(race_id):
    """Navigates to race page and extracts date, ignoring nested divs."""
    url = f"https://www.road-results.com/race/{race_id}"
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        resp = requests.get(url, headers=headers)
        inner_soup = BeautifulSoup(resp.text, 'html.parser')
        title_div = inner_soup.find('div', id='resultstitle')
        
        if title_div:
            # We only want the text that is a DIRECT child of the resultstitle div
            # This ignores everything inside <div id="attribution"> etc.
            direct_text = "".join([t for t in title_div.contents if isinstance(t, str)]).strip()
            
            # Example direct_text: "Mount Kearsarge Hill Climb • Aug 11			2024"
            parts = direct_text.split('•')
            if len(parts) >= 2:
                # Use regex to collapse multiple spaces/tabs into a single space
                raw_date_str = re.sub(r'\s+', ' ', parts[1].strip()) # "Aug 11 2024"
                
                for fmt in ("%b %d %Y", "%B %d %Y"):
                    try:
                        return datetime.strptime(raw_date_str, fmt).strftime("%Y-%m-%d")
                    except ValueError:
                        continue
                        
    except Exception as e:
        print(f"   Error fetching date for race {race_id}: {e}")
    return None

def scrape_and_upload(year, gender):
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # 1. Scraping Setup
    #url = f"https://www.road-results.com/?n=series&sn=bumps&y={year}&showcats=1"
    
    url = f"https://www.road-results.com/?n=results&sn=bumps&iframe=0&y={year}&series=B{str(year)[-2:]}_{gender}"

    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    table = soup.find_all('table', {'class': 'datatable1'})[1] # Target the results table
    rows = table.find_all('tr')
    header_cells = rows[0].find_all(['th', 'td'])
    
    events_to_upsert = []
    race_column_map = {}
    current_idx = 0

    # 2. Process Headers (Events & Races)
    for cell in header_cells:
        span = int(cell.get('colspan', 1))
        link = cell.find('a')
        if link and '/race/' in link.get('href', '') and "total" not in cell.text.lower():
            race_id = int(link['href'].split('/')[-1].split('#')[0])
            raw_name = link.get('title', cell.text.strip())
            event_name = get_canonical_name(raw_name)
            
            # NEW: Extract the date for this specific race instance
            event_date = extract_date_from_race_page(race_id)
            
            events_to_upsert.append({"name": event_name})
            race_column_map[current_idx] = {
                "race_id": race_id, 
                "event_name": event_name,
                "event_date": event_date  # Stored here for the races table
            }
        current_idx += span

    # 3. Handle Events
    if TRIAL_MODE:
        print(f"[TRIAL] Would upsert {len(events_to_upsert)} events: {[e['name'] for e in events_to_upsert]}")
        # In trial mode, we mock the ID mapping
        event_name_to_id = {e['name']: 999 for e in events_to_upsert}
    else:
        print(f"Upserting {len(events_to_upsert)} events...")
        supabase.table("events").upsert(events_to_upsert, on_conflict="name").execute()
        db_events = supabase.table("events").select("id, name").execute()
        event_name_to_id = {item['name']: item['id'] for item in db_events.data}

    # 4. Process Rows (Riders & Results)
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
            "gender": gender,  # Passed from function argument
            "birth_year": year - int(age_text) if age_text.isdigit() and int(age_text) > 0 else None
        }

        for col_idx, info in race_column_map.items():
            if col_idx < len(cols):
                p_text = cols[col_idx].text.strip().replace('*', '').replace('-', '')
                if p_text and p_text not in ['DNS', 'DNF', '']:
                    results_to_upsert.append({
                        "rider_id": r_id, "race_id": info["race_id"], "points": float(p_text), "year": year
                    })

    # Prepare Race instances
    for info in race_column_map.values():
        races_to_upsert.append({
            "id": info["race_id"], 
            "event_id": event_name_to_id.get(info["event_name"]), 
            "year": year,
            "event_date": info["event_date"] # NEW: Add to races table
        })

    # 5. Final Execution Block
    if TRIAL_MODE:
        print(f"[TRIAL] Would upsert {len(races_to_upsert)} races.")
        print("[TRIAL] Sample Race:", races_to_upsert[0] if races_to_upsert else "None")
        print(f"[TRIAL] Would upsert {len(riders_to_upsert)} riders.")
        print("[TRIAL] Sample Rider:", list(riders_to_upsert.values())[0] if riders_to_upsert else "None")
        print(f"[TRIAL] Would upsert {len(results_to_upsert)} results.")
        print("[TRIAL] Sample Result:", results_to_upsert[0] if results_to_upsert else "None")
    else:
        print("Writing to Database...")
        supabase.table("races").upsert(races_to_upsert).execute()
        supabase.table("riders").upsert(list(riders_to_upsert.values())).execute()
        # Chunk results for safety
        for i in range(0, len(results_to_upsert), 500):
            supabase.table("results").upsert(results_to_upsert[i:i+500],on_conflict="rider_id, race_id").execute()
        print("Successfully uploaded all data.")

if __name__ == "__main__":
    scrape_and_upload(2025, "M")
    scrape_and_upload(2025, "W")