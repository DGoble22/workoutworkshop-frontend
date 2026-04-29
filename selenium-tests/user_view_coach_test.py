from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import os
#from dotenv import load_dotenv
import time
from helper import login
import json
import subprocess

URL = "http://localhost:5173/"

if __name__ == "__main__":
    # user doesn't have a coach
    driver = webdriver.Chrome() #use Chrome
    driver.get(URL) #access site
    driver.maximize_window()

    time.sleep(1)
    login(driver, "UItest", "Correctpass123")
    time.sleep(1)

    driver.find_element(By.ID, "home-coach").click()
    time.sleep(1)

    driver.find_element(By.ID, "dropdown-basic").click()
    time.sleep(1)
    driver.find_element(By.ID, "coach-strength").click()
    time.sleep(1)
    driver.find_element(By.ID, "dropdown-basic").click()
    time.sleep(1)
    driver.find_element(By.ID, "coach-nutrition").click()
    time.sleep(1)
    driver.find_element(By.ID, "dropdown-basic").click()
    time.sleep(1)
    driver.find_element(By.ID, "coach-clear").click()
    time.sleep(1)
    
    search=driver.find_element(By.ID, "search-coach")
    search.send_keys("sam")
    time.sleep(1.5)
    search.send_keys(Keys.CONTROL + "a")
    search.send_keys(Keys.BACKSPACE)
    time.sleep(1)

    #find coach
    driver.find_element(By.ID, "coach-Sam Sulek").click()
    time.sleep(1)
    driver.find_element(By.ID, "coach-reviews").click()
    time.sleep(1)
    driver.find_element(By.ID, "close-reviews").click()
    time.sleep(1)
    driver.find_element(By.ID, "coach-close").click()
    time.sleep(1)

    action = ActionChains(driver)
    scroll=driver.find_element(By.ID, "coach-scroll")
    action.move_to_element(scroll).perform()

    element=driver.find_element(By.ID, "coach-UITest Coach")
    action.scroll_to_element(element).perform()
    time.sleep(1)

    element.click()
    time.sleep(1)

    #view reviews
    driver.find_element(By.ID, "coach-reviews").click()
    time.sleep(1)
    driver.find_element(By.ID, "close-reviews").click()
    time.sleep(1)

    #open/close applicaiton
    driver.find_element(By.ID, "coach-apply").click()
    time.sleep(1)
    driver.find_element(By.ID, "close-application").click()
    time.sleep(1)
    driver.find_element(By.ID, "coach-apply").click()
    time.sleep(1)
    driver.find_element(By.ID, "apply-button").click()
    time.sleep(1)

    #send application
    applicationText = driver.find_element(By.ID, "application-text")
    applicationText.send_keys("I don't want to apply")
    time.sleep(1)
    applicationText.clear()
    applicationText.send_keys("I do want to apply")
    time.sleep(1)
    driver.find_element(By.ID, "apply-button").click()

    # go home and quit
    time.sleep(1)
    driver.find_element(By.ID, "close-application").click()
    driver.find_element(By.ID, "coach-close").click()
    time.sleep(1)

    time.sleep(2)
    report = driver.execute_script("return window.__coverage__;")
    time.sleep(1.5)

    #---------Reject APPLICATION----------

    element=driver.find_element(By.ID, "nav-user-logo")
    action.scroll_to_element(element).perform()
    time.sleep(1)
    element.click()

    time.sleep(1)
    driver.find_element(By.ID, "nav-signout").click()
    time.sleep(1)

    login(driver, "UItestCoach", "Correctpass123")
    time.sleep(1)

    driver.find_element(By.ID, "nav-coach").click()
    time.sleep(3)
    driver.find_element(By.ID, "request-reject-UITest last name").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-user-logo").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-signout").click()
    time.sleep(1)

    driver.quit() #close the driver
    print("Execution successful")

    path = os.path.join(".nyc_output", "out.json") # create file in nyc_output folder
    flog = os.path.join(".nyc_output", "apply_report.json")

    f = open(path, "w")
    f.write(json.dumps(report)) # write the json to standard out.json file
    f.close()
    f = open(flog, "w")
    f.write(json.dumps(report)) # store a record of the report
    f.close() #write to the file

    subprocess.run(["npx", "nyc", "report",
     "-n", "src/components/CoachInfoModal.jsx",
     "-n", "src/components/ReviewsModal.jsx",
     "-n", "src/components/ReviewCard.jsx",
     "-n", "src/components/ApplicationSurvey.jsx",
     "-n", "src/components/CoachCard.jsx",
     "-n", "src/components/DOTWavailibility.jsx",
     "-n", "src/pages/Shared/FindCoach.jsx"
     ], check=True, shell=True)