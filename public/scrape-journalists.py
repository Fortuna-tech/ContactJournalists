from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time
import os
import re
import random
import csv

# THIS IS THE NEW BIT — auto-downloads the right chromedriver every time
service = Service(ChromeDriverManager().install())
options = webdriver.ChromeOptions()
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36")
options.add_argument("--disable-blink-features=AutomationControlled")

# change this to False so you can SEE it working
options.add_experimental_option("useAutomationExtension", False)
options.add_experimental_option("excludeSwitches", ["enable-automation"])

driver = webdriver.Chrome(service=service, options=options)
wait = WebDriverWait(driver, 10)

os.makedirs("screenshots", exist_ok=True)
email_regex = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')

queries = [
    "saas email OR \"contact me\" OR pitches@ OR pr@ OR founder email",
    "indiehackers OR indie hacker email OR tips@ OR guestpost",
    "startup blogger OR microsaas email OR collab@ OR press@",
    "\"write for us\" OR \"guest post\" email OR submissions@",
    "mom blogger OR parenting blogger email OR prfriendly OR collab@",
    "family influencer OR parenting pitches OR \"work with me\" email",
    "\"brand collab\" OR \"sponsored post\" email OR parenting tips@",
    "mum blogger OR dad blogger email OR familyblogger contact",
]

results = []
target_count = 120          # ← change this to 100 if you want exactly 100
current_count = 0

print(f"starting hunt for {target_count} SaaS + parenting contacts…")

while current_count < target_count:
    query = random.choice(queries)
    print(f"searching → {query}")
    
    driver.get(f"https://x.com/search?q={query.replace(' ', '%20')}&src=typed_query&f=live")
    time.sleep(random.uniform(5, 9))
    
    try:
        tweets = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, '[data-testid="tweet"]')))
        
        for tweet in tweets[:8]:
            if current_count >= target_count:
                break
            try:
                profile_link = tweet.find_element(By.CSS_SELECTOR, 'a[href*="/"][role="link"] time').find_element(By.XPATH, './../../../../..').get_attribute('href')
                if '/status/' in profile_link:
                    continue
                    
                driver.get(profile_link + "?s=20")  # forces full profile load
                time.sleep(random.uniform(3, 6))
                
                bio = driver.find_element(By.CSS_SELECTOR, '[data-testid="UserDescription"]').text.lower()
                emails = email_regex.findall(bio)
                
                if emails:
                    email = emails[0]
                    name = driver.find_element(By.CSS_SELECTOR, '[data-testid="UserName"]').text.split('\n')[0]
                    handle = profile_link.split('/')[-1]
                    niche = "Parenting" if any(word in bio for word in ["mom","mum","dad","parenting","kids","family","baby"]) else "SaaS/Startup"
                    
                    safe_name = f"{handle}_{niche[:4]}"
                    path = f"screenshots/{safe_name}.png"
                    driver.save_screenshot(path)
                    
                    results.append({
                        'handle': handle,
                        'name': name,
                        'email': email,
                        'niche': niche,
                        'screenshot_path': path,
                        'bio_snippet': bio[:140]
                    })
                    
                    current_count += 1
                    print(f"{current_count}/{target_count} | @{handle} → {email} [{niche}]")
                    
            except:
                continue
                
        driver.execute_script("window.scrollBy(0, 1000);")
        time.sleep(3)
        
    except:
        time.sleep(15)
        continue
    
    time.sleep(random.uniform(15, 25))

# save everything
with open('saas_and_parenting_contacts.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['handle','name','email','niche','screenshot_path','bio_snippet'])
    writer.writeheader()
    writer.writerows(results)

driver.quit()
print(f"DONE! {len(results)} perfect contacts saved → saas_and_parenting_contacts.csv + screenshots folder")
