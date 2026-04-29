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

    #dotw = args.d
    #identifier = "dotw-"+dotw

    #----------------SET UP----------------
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

    #----------------SET UP PT2----------------
    time.sleep(1)
    login(driver, "UItestAdmin", "Correctpass123")
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

    #----------------COACH----------------
    login(driver, "UItestCoach", "Correctpass123")
    time.sleep(1)

    driver.find_element(By.ID, "nav-coach").click()
    time.sleep(3)

    driver.find_element(By.ID, "request-accept-UITest last name").click()
    time.sleep(1)

    driver.find_element(By.ID, "request-reject-UI admin").click()
    time.sleep(1)

    #edit availibility
    driver.find_element(By.ID, "edit-coach-profile").click()
    time.sleep(2)

    driver.find_element(By.ID, "register-M").click()
    time.sleep(1)

    mStart=driver.find_element(By.ID, "start-time-M")
    mStart.send_keys("1000p")
    time.sleep(1)
    tStart = driver.find_element(By.ID, "start-time-T")
    tStart.send_keys("0300p")
    time.sleep(1)
    tEnd = driver.find_element(By.ID, "end-time-T")
    tEnd.send_keys("0600p")
    time.sleep(1)
    mStart.send_keys("1000a")
    time.sleep(2)

    driver.find_element(By.ID, "register-M").click()
    time.sleep(1)

    #------------SET PRICING------------
    price = driver.find_element(By.ID, "coach-price")
    price.clear()
    price.send_keys("100")
    time.sleep(1)

    #------------UPDATE BIO------------
    bio = driver.find_element(By.ID, "coach-bio")
    bio.clear()
    bio.send_keys("Best Bio in the Game")
    time.sleep(2)

    #------------SUBMIT FORM------------
    upload = driver.find_element(By.ID, "save")
    actions.move_to_element(upload).perform()
    time.sleep(1.5)
    upload.click()
    time.sleep(2)

    thStart=driver.find_element(By.ID, "start-time-TH")
    thStart.send_keys("0200p")
    time.sleep(1)

    driver.find_element(By.ID, "save").click()
    time.sleep(2)

    driver.find_element(By.ID, "back-to-dash").click()
    time.sleep(2)

    #RELOAD PAGE
    driver.find_element(By.ID, "nav-home").click()
    time.sleep(1)

    driver.find_element(By.ID, "nav-coach").click()
    time.sleep(3)

    #--------------ADD MEALS------------
    driver.find_element(By.ID, "mealplan-UITest last name").click()
    time.sleep(1)

    driver.find_element(By.ID, "dotw-Wednesday").click()
    time.sleep(1.5)

    driver.find_element(By.ID, "dotw-Monday").click()
    time.sleep(1.5)

    #breakfast
    driver.find_element(By.ID, "add-Breakfast").click()
    time.sleep(1)

    bFood=driver.find_element(By.ID, "Breakfast-fooditem")
    bFood.send_keys("Eggs")
    bPortion=driver.find_element(By.ID, "Breakfast-portion")
    bPortion.send_keys("3")
    bCals=driver.find_element(By.ID, "Breakfast-cal")
    bCals.send_keys("180")
    time.sleep(1)

    #lunch
    driver.find_element(By.ID, "add-Lunch").click()
    time.sleep(1)

    bFood=driver.find_element(By.ID, "Lunch-fooditem")
    bFood.send_keys("chicken")
    bPortion=driver.find_element(By.ID, "Lunch-portion")
    bPortion.send_keys("300g")
    bCals=driver.find_element(By.ID, "Lunch-cal")
    bCals.send_keys("450")
    time.sleep(1)

    #dinner
    driver.find_element(By.ID, "add-Dinner").click()
    time.sleep(1)

    bFood=driver.find_element(By.ID, "Dinner-fooditem")
    bFood.send_keys("Pasta")
    bPortion=driver.find_element(By.ID, "Dinner-portion")
    bPortion.send_keys("300g")
    bCals=driver.find_element(By.ID, "Dinner-cal")
    bCals.send_keys("600")
    time.sleep(1)
    
    #snack
    driver.find_element(By.ID, "add-Snack").click()
    time.sleep(1)

    bFood=driver.find_element(By.ID, "Snack-fooditem")
    bFood.send_keys("Skittles")
    bPortion=driver.find_element(By.ID, "Snack-portion")
    bPortion.send_keys("1pack")
    bCals=driver.find_element(By.ID, "Snack-cal")
    bCals.send_keys("600")
    time.sleep(2)

    driver.find_element(By.ID, "Snack-remove").click()
    time.sleep(1.5)

    driver.find_element(By.ID, "save-meal-plan").click()
    time.sleep(2)

    #back to dash
    driver.find_element(By.ID, "back-to-dash").click()
    time.sleep(1)

    #---------Create WORKOUTS------------
    driver.find_element(By.ID, "details-UITest last name").click()
    time.sleep(2)

    driver.find_element(By.ID, "create-plan").click()
    time.sleep(1)

    title=driver.find_element(By.ID, "createplan-title")
    title.send_keys("UI test")
    time.sleep(1.5)
    date=driver.find_element(By.ID, "createplan-date")
    date.send_keys("01012030")
    time.sleep(2)

    driver.find_element(By.ID, "createplan-submit").click()
    time.sleep(3)

    driver.find_element(By.ID, "open-UI test").click()
    time.sleep(3)

    bSets=driver.find_element(By.ID, "sets-Bench Press")
    bSets.clear()
    bSets.send_keys("4")
    time.sleep(2)
    bReps=driver.find_element(By.ID, "reps-Bench Press")
    bReps.clear()
    bReps.send_keys("8")
    time.sleep(2)
    bWeight=driver.find_element(By.ID, "weight-Bench Press")
    bWeight.clear()
    bWeight.send_keys("225")
    time.sleep(2)

    driver.find_element(By.ID, "add-exercise").click()
    time.sleep(1)

    search=driver.find_element(By.ID, "search-exercise")
    search.send_keys("push")
    time.sleep(1.5)
    driver.find_element(By.ID, "select-Push Up").click()
    time.sleep(2.5)

    bSets=driver.find_element(By.ID, "sets-Push Up")
    bSets.clear()
    bSets.send_keys("4")
    time.sleep(2)
    bReps=driver.find_element(By.ID, "reps-Push Up")
    bReps.clear()
    bReps.send_keys("8")
    time.sleep(2)
    bWeight=driver.find_element(By.ID, "weight-Push Up")
    bWeight.clear()
    bWeight.send_keys("0")
    time.sleep(2)

    driver.find_element(By.ID, "remove-Bench Press").click()
    time.sleep(2)

    driver.find_element(By.ID, "save-UI test").click()
    time.sleep(2)
    driver.switch_to.alert.accept() #accept alert
    time.sleep(2)
    driver.find_element(By.ID, "delete-UI test").click()
    time.sleep(2)
    driver.switch_to.alert.accept() #accept alert
    time.sleep(2)
    driver.find_element(By.ID, "back-to-dash").click()
    time.sleep(2)

    driver.find_element(By.ID, "clientchat-UITest last name").click()
    time.sleep(2)

    time.sleep(1.5)
    report = driver.execute_script("return window.__coverage__;")
    time.sleep(1.5)
    driver.quit()

    path = os.path.join(".nyc_output", "out.json") # create file in nyc_output folder
    flog = os.path.join(".nyc_output", "coach_report.json")

    f = open(path, "w")
    f.write(json.dumps(report)) # write the json to standard out.json file
    f.close()
    f = open(flog, "w")
    f.write(json.dumps(report)) # store a record of the report
    f.close() #write to the file

    subprocess.run(["npx", "nyc", "report", 
    "-n", "src/pages/Coach/Coach.jsx",
    "-n", "src/pages/Coach/CoachDetail.jsx",
    "-n", "src/pages/Coach/CreateMealPlan.jsx",
    "-n", "src/pages/Coach/EditCoachProfile.jsx"], check=True, shell=True)
