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
import argparse


URL = "http://localhost:5173/"

#get arguments
parser = argparse.ArgumentParser()
parser.add_argument('-d', choices=['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
args = parser.parse_args()

if __name__ == "__main__":
    # user doesn't have a coach
    driver = webdriver.Chrome() #use Chrome
    driver.get(URL) #access site
    driver.maximize_window()
    actions = ActionChains(driver)
    dotw=args.d

    #------------SETUP------------

    time.sleep(1)
    login(driver, "UItest", "Correctpass123")
    time.sleep(1)

    driver.find_element(By.ID, "home-coach").click()
    time.sleep(1)

    action = ActionChains(driver)
    scroll=driver.find_element(By.ID, "coach-scroll")
    action.move_to_element(scroll).perform()

    element=driver.find_element(By.ID, "coach-UITest Coach")
    action.scroll_to_element(element).perform()
    time.sleep(1)

    element.click()
    time.sleep(1)

    driver.find_element(By.ID, "coach-apply").click()
    time.sleep(1)

    applytxt=driver.find_element(By.ID, "application-text")
    applytxt.send_keys("i")
    driver.find_element(By.ID, "apply-button").click()
    time.sleep(1)

    driver.find_element(By.ID, "close-application").click()
    time.sleep(1)
    driver.find_element(By.ID, "coach-close").click()
    time.sleep(1)

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
    driver.find_element(By.ID, "request-accept-UITest last name").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-user-logo").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-signout").click()
    time.sleep(1)

    time.sleep(1)
    login(driver, "UItest", "Correctpass123")
    time.sleep(2)

    #fire current coach
    driver.find_element(By.ID, "home-coach").click()
    time.sleep(1)
    driver.find_element(By.ID, "coach-fire").click()
    time.sleep(1)
    driver.find_element(By.ID, "fire-confirm").click()
    time.sleep(1)
    driver.find_element(By.ID, "fire-cancel").click()
    time.sleep(1)

    driver.find_element(By.ID, "coach-close").click()
    time.sleep(1)

    driver.find_element(By.ID, "home-create-plan").click()
    time.sleep(1.5)

    #add a workout
    driver.find_element(By.ID, "workout-library").click()
    time.sleep(1)
    driver.find_element(By.ID, "workout-Push Day").click() #open
    time.sleep(1)

    driver.find_element(By.ID, "daySelect").click()
    time.sleep(1)
    identifier = "select-"+dotw
    driver.find_element(By.ID, identifier).click()
    time.sleep(1)
    
    driver.find_element(By.ID, "add").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-home").click()
    time.sleep(1.5)

    #track workout
    driver.find_element(By.ID, "complete-Bench Press").click()
    time.sleep(2)
    driver.find_element(By.ID, "complete-Incline Dumbbell Press").click()
    time.sleep(2)
    driver.find_element(By.ID, "complete-Bench Press").click()
    time.sleep(2)

    #view calendar
    driver.find_element(By.ID, "calendar").click()
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-home").click()
    time.sleep(2)
    driver.find_element(By.ID, "home-coach").click()
    time.sleep(2)
    driver.find_element(By.ID, "nav-home").click()
    time.sleep(2)

    #view meal plan
    element=driver.find_element(By.ID, "star-3")
    actions.move_to_element(element).perform()
    time.sleep(1)
    driver.find_element(By.ID, "view-mealplan").click()
    time.sleep(3)
    driver.find_element(By.ID, "mealplan-TH").click()
    time.sleep(2)
    driver.find_element(By.ID, "mealplan-M").click()
    time.sleep(2)
    driver.find_element(By.ID, "back").click()
    time.sleep(2.5)

    #upload progress pic
    element=driver.find_element(By.ID, "star-3")
    actions.move_to_element(element).perform()
    time.sleep(1)
    uploadPhoto=driver.find_element(By.ID, "progress-upload-input")
    test_file = os.path.abspath("selenium-tests/Files/ProgressPhoto.png")
    uploadPhoto.send_keys(test_file)
    time.sleep(1)
    driver.find_element(By.ID, "submit-photo").click()
    time.sleep(2.5)
    driver.find_element(By.ID, "delete-photo-undefined").click()
    time.sleep(1.5)

    #daily survey
    element=driver.find_element(By.ID, "star-3")
    actions.move_to_element(element).perform()
    time.sleep(1)
    element.click()
    time.sleep(1)
    driver.find_element(By.ID, "star-1").click()
    time.sleep(1)
    driver.find_element(By.ID, "star-5").click()
    time.sleep(1)

    element=driver.find_element(By.ID, "nav-user-logo")
    action.scroll_to_element(element).perform()
    time.sleep(1)

    driver.find_element(By.ID, "DOTW-"+dotw).click()
    time.sleep(1)

    driver.find_element(By.ID, "nav-workout").click()
    time.sleep(1)
    driver.find_element(By.ID, "workout-log").click()
    time.sleep(1)
    driver.find_element(By.ID, "remove-Push Day").click()
    time.sleep(1.5)
    driver.switch_to.alert.accept() #accept alert
    time.sleep(2)

    time.sleep(1.5)
    report = driver.execute_script("return window.__coverage__;")
    time.sleep(1.5)
    driver.quit()

    path = os.path.join(".nyc_output", "out.json") # create file in nyc_output folder
    flog = os.path.join(".nyc_output", "home_report.json")

    f = open(path, "w")
    f.write(json.dumps(report)) # write the json to standard out.json file
    f.close()
    f = open(flog, "w")
    f.write(json.dumps(report)) # store a record of the report
    f.close() #write to the file

    subprocess.run(["npx", "nyc", "report", 
    "-n", "src/pages/Shared/Home.jsx", 
    "-n", "src/components/ProgressTracker.jsx"], check=True, shell=True)