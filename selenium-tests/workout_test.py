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


#load_dotenv()
URL = "http://localhost:5173/"

#get arguments
parser = argparse.ArgumentParser()
parser.add_argument('-d', choices=['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
args = parser.parse_args()

if __name__ == "__main__":
    driver = webdriver.Chrome() #use Chrome
    driver.get(URL) #access site
    driver.maximize_window()

    dotw = args.d
    identifier = "select-"+dotw

    time.sleep(2)
    login(driver, "UItest", "Correctpass123")
    time.sleep(1)

    driver.find_element(By.ID, "nav-workout").click()
    time.sleep(2)

    #----------------CALENDAR VIEW-------------
    driver.find_element(By.ID, "calendar").click()
    time.sleep(1)
    driver.find_element(By.ID, "next").click()
    time.sleep(1)
    driver.find_element(By.ID, "prev").click()
    time.sleep(1)

    driver.find_element(By.ID, "nav-workout").click()
    time.sleep(1)

    #----------------COACHING----------------
    driver.find_element(By.ID, "get-coaching").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-workout").click()
    time.sleep(1)

    #----------------LIBRARY----------------
    driver.find_element(By.ID, "workout-library").click()
    time.sleep(1)
    driver.find_element(By.ID, "back").click()
    time.sleep(1)
    driver.find_element(By.ID, "workout-library").click()
    time.sleep(1)

    driver.find_element(By.ID, "workout-Push Day").click() #open
    time.sleep(1)
    driver.find_element(By.ID, "close-workout").click()
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
    driver.find_element(By.ID, "back").click()
    time.sleep(1)

    #----------------BUILD WORKOUT----------------
    identifier = "nav-"+dotw
    driver.find_element(By.ID, identifier).click()
    time.sleep(1)
    driver.find_element(By.ID, "dropdown-basic").click()
    time.sleep(1)
    driver.find_element(By.ID, "equipment").click()
    time.sleep(1)
    driver.find_element(By.ID, "dropdown-Free Weight").click()
    time.sleep(1)
    driver.find_element(By.ID, "add-Shoulder Press").click()
    time.sleep(1)
    driver.find_element(By.ID, "dropdown-Free Weight").click()
    time.sleep(1)
    driver.find_element(By.ID, "dropdown-basic").click()
    time.sleep(1)
    driver.find_element(By.ID, "muscle-group").click()
    time.sleep(1)
    driver.find_element(By.ID, "dropdown-Chest").click()
    time.sleep(1)
    driver.find_element(By.ID, "add-Push Up").click()
    time.sleep(1)

    #manage exerice
    driver.find_element(By.ID, "manage").click()
    time.sleep(1)
    driver.find_element(By.ID, "remove-Incline Dumbbell Press").click()
    time.sleep(2)
    reps=driver.find_element(By.ID, "reps-Bench Press")
    reps.clear()
    reps.send_keys("10")
    time.sleep(1)
    sets=driver.find_element(By.ID, "sets-Bench Press")
    sets.clear()
    sets.send_keys("3")
    time.sleep(1)
    weight=driver.find_element(By.ID, "weight-Bench Press")
    weight.clear()
    weight.send_keys("225")
    time.sleep(1)

    driver.find_element(By.ID, "apply").click()
    time.sleep(1)

    #---------------SAVE TO WORKOUT----------------
    driver.find_element(By.ID, "create-workout").click()
    time.sleep(2)
    driver.find_element(By.ID, "cancel-overwrite").click()
    time.sleep(1)
    driver.find_element(By.ID, "create-workout").click()
    time.sleep(2)
    driver.find_element(By.ID, "overwrite").click()
    time.sleep(1)

    driver.find_element(By.ID, "save-workout").click()
    time.sleep(1.5)
    workoutName = driver.find_element(By.ID, "workout-name")
    workoutName.send_keys("test")
    time.sleep(1)
    driver.find_element(By.ID, "save-workout").click()
    time.sleep(1.5)

    

    #----------------LIBRARY----------------
    driver.find_element(By.ID, "nav-workout").click()
    time.sleep(1)
    driver.find_element(By.ID, "workout-log").click()
    time.sleep(1)

    driver.find_element(By.ID, "view-test").click()
    time.sleep(1.5)
    driver.find_element(By.ID, "remove-Overhead Press").click()
    time.sleep(1.5)
    driver.switch_to.alert.accept() #accept alert
    time.sleep(2)

    reps=driver.find_element(By.ID, "reps-Bench Press")
    sets=driver.find_element(By.ID, "sets-Bench Press")
    weight=driver.find_element(By.ID, "weight-Bench Press")

    reps.clear()
    reps.send_keys("8")
    sets.clear()
    sets.send_keys("4")
    weight.clear()
    weight.send_keys("135")
    time.sleep(1)

    actions = ActionChains(driver)
    element = driver.find_element(By.ID, "save")
    actions.move_to_element(element).perform()
    element.click()
    time.sleep(2)

    driver.find_element(By.ID, "remove-test").click()
    time.sleep(1.5)
    driver.switch_to.alert.accept() #accept alert
    time.sleep(2)

    #exercise bit
    time.sleep(1.5)
    report = driver.execute_script("return window.__coverage__;")
    time.sleep(1.5)
    driver.quit()

    path = os.path.join(".nyc_output", "out.json") # create file in nyc_output folder
    flog = os.path.join(".nyc_output", "workout_report.json")

    f = open(path, "w")
    f.write(json.dumps(report)) # write the json to standard out.json file
    f.close()
    f = open(flog, "w")
    f.write(json.dumps(report)) # store a record of the report
    f.close() #write to the file

    subprocess.run(["npx", "nyc", "report", 
    "-n", "src/pages/Shared/WorkoutBuilder.jsx", 
    "-n", "src/pages/Shared/WorkoutCalendar.jsx",
    "-n", "src/pages/Shared/WorkoutDashboard.jsx",
    "-n", "src/pages/Shared/WorkoutLibrary.jsx",
    "-n", "src/pages/Shared/WorkoutLog.jsx",
    "-n", "src/pages/Shared/WorkoutEdit.jsx",
    "-n", "src/components/ExerciseCard.jsx"], check=True, shell=True)







