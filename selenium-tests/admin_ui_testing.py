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
    driver = webdriver.Chrome() #use Chrome
    driver.get(URL) #access site
    driver.maximize_window()
    time.sleep(2)
    actions = ActionChains(driver)

    login(driver, "UItestAdmin", "Correctpass123")
    time.sleep(1.5)

    driver.find_element(By.ID, "nav-admin").click()
    time.sleep(2.5)

    #view users
    element = driver.find_element(By.ID, "user-next")
    actions.move_to_element(element).perform()
    time.sleep(1)
    driver.find_element(By.ID, "user-next").click()
    time.sleep(1)
    driver.find_element(By.ID, "user-previous").click()
    time.sleep(1)

    userSearch = driver.find_element(By.ID, "search-users")
    userSearch.send_keys("UI")
    time.sleep(1.5)
    userSearch.clear()
    time.sleep(1)

    

    # scroll
    element = driver.find_element(By.ID, "coach-next")
    actions.move_to_element(element).perform()
    time.sleep(1)

    #view applications
    driver.find_element(By.ID, "application-Chris Tren").click()
    time.sleep(1)

    #accept coach
    driver.find_element(By.ID, "coach-accept").click()
    time.sleep(1.5)

    #reject coach
    driver.find_element(By.ID, "application-Larry Wheels").click()
    time.sleep(1)
    driver.find_element(By.ID, "coach-reject").click()
    time.sleep(1)
    driver.find_element(By.ID, "rejection-cancel").click()
    time.sleep(1)
    driver.find_element(By.ID, "coach-reject").click()
    time.sleep(1)

    rejection=driver.find_element(By.ID, "rejection-reason")
    rejection.send_keys("Reject")
    time.sleep(1)
    rejection.clear()
    rejection.send_keys("better reason for rejection")
    time.sleep(1)
    driver.find_element(By.ID, "confirm-rejection").click()
    time.sleep(2)

    driver.find_element(By.ID, "coach-next").click()
    time.sleep(1)
    driver.find_element(By.ID, "coach-previous").click()
    time.sleep(1)

    #scroll
    element = driver.find_element(By.ID, "report-next")
    actions.move_to_element(element).perform()
    time.sleep(1)

    #dismiss report
    driver.find_element(By.ID, "report-Chris Tren").click()
    time.sleep(1)
    driver.find_element(By.ID, "coach-profile").click()
    time.sleep(1)
    driver.find_element(By.ID, "coach-close").click()   # close coach profile
    time.sleep(1)
    driver.find_element(By.ID, "dismiss-report").click()
    time.sleep(1)

    #ban coach
    driver.find_element(By.ID, "report-Larry Wheels").click()
    time.sleep(1.5)
    driver.find_element(By.ID, "ban-coach").click() 
    time.sleep(1.5)
    driver.find_element(By.ID,"cancel-ban").click() 
    time.sleep(1.5)
    driver.find_element(By.ID,"ban-coach").click() 
    time.sleep(1.5)

    banReason=driver.find_element(By.ID,"ban-reason")
    banReason.send_keys("reason for ban")
    time.sleep(1.5)
    banReason.clear()
    banReason.send_keys("Unacceptable behavior")
    time.sleep(1.5)
    driver.find_element(By.ID,"confirm-ban").click() 
    time.sleep(1.5)

    #disable coach
    driver.find_element(By.ID,"report-Faith Ordway").click() 
    time.sleep(1.5)
    driver.find_element(By.ID, "disable-coach").click() 
    time.sleep(1.5)
    driver.find_element(By.ID,"disable-cancel").click() 
    time.sleep(1.5)
    driver.find_element(By.ID, "disable-coach").click() 
    time.sleep(1.5)
    day = driver.find_element(By.ID, "disable-day")
    month = driver.find_element(By.ID, "disable-month")
    year = driver.find_element(By.ID, "disable-year")
    reason = driver.find_element(By.ID, "diable-reason")

    day.send_keys("17")
    month.send_keys("09")
    year.send_keys("2026")
    reason.send_keys("test")

    time.sleep(1.5)
    driver.find_element(By.ID, "disable-confirm").click() 
    time.sleep(1)
    
    #exercise bit
    time.sleep(1.5)
    report = driver.execute_script("return window.__coverage__;")
    time.sleep(1.5)
    driver.quit()

    path = os.path.join(".nyc_output", "out.json") # create file in nyc_output folder
    flog = os.path.join(".nyc_output", "admin_report.json")

    f = open(path, "w")
    f.write(json.dumps(report)) # write the json to standard out.json file
    f.close()
    f = open(flog, "w")
    f.write(json.dumps(report)) # store a record of the report
    f.close() #write to the file

    subprocess.run(["npx", "nyc", "report", 
    "-n", "src/pages/Admin/Admin.jsx", 
    "-n", "src/components/ViewCoachApplicationModal.jsx",
    "-n", "src/components/ViewCoachReportModal.jsx",
    "-n", "src/components/AdminExerciseModal"], check=True, shell=True)


