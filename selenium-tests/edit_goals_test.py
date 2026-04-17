from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import os
#from dotenv import load_dotenv
import time
from helper import login_to_profile_editor

#load_dotenv()
URL = "http://localhost:5173/"

#Skip payment
if __name__ == "__main__":
    driver = webdriver.Chrome() #use Chrome
    driver.get(URL) #access site

    #login into site
    time.sleep(1)
    login_to_profile_editor(driver, "UItest", "Correctpass123") 
    time.sleep(1)

    #open and close goals
    driver.find_element(By.ID, "nav-goals").click()
    time.sleep(1.5)
    driver.find_element(By.ID, "goals-cancel").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-user-logo").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-goals").click()
    time.sleep(1.5)

    #set current weight
    currweight = driver.find_element(By.ID, "currentWeight")
    currweight.clear()
    currweight.send_keys("1750")
    time.sleep(1)
    currweight.clear()
    currweight.send_keys("175")
    time.sleep(1)

    #set goal wight
    goalweight = driver.find_element(By.ID, "goalWeight")
    goalweight.clear()
    goalweight.send_keys("1800")
    time.sleep(1)
    goalweight.clear()
    goalweight.send_keys("180")
    time.sleep(1)

    #set goal type
    driver.find_element(By.ID, "goals-WeightLoss").click()
    time.sleep(1)
    driver.find_element(By.ID, "goals-Strength").click()
    time.sleep(1)

    #set goal text
    goalText = driver.find_element(By.ID, "goal-notes")
    goalText.clear()
    goalText.send_keys("This is a test goal message")
    time.sleep(1)
    goalText.clear()
    goalText.send_keys("This is a better goal message")
    time.sleep(1.5)
    driver.find_element(By.ID, "goals-submit").click()
    time.sleep(2)

    driver.quit()


