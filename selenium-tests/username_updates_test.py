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
    username = "UItest"

    #login into site
    time.sleep(1)
    login_to_profile_editor(driver, username, "Correctpass123") 
    time.sleep(1)

    #goto username updater
    driver.find_element(By.ID, "nav-username").click()
    time.sleep(1)

    #test submit with no input
    driver.find_element(By.ID, "username-submit").click()
    time.sleep(1.5)
    driver.find_element(By.ID, "username-cancel").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-user-logo").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-username").click()
    time.sleep(1)


    usr = driver.find_element(By.ID, "new-username")
    usr.send_keys("tes") #send a username that is too short
    time.sleep(1)
    driver.find_element(By.ID, "username-submit").click()
    time.sleep(1.5)
    usr.clear()
    usr.send_keys("Manny") #send a username that is taken
    time.sleep(1)
    driver.find_element(By.ID, "username-submit").click()
    time.sleep(1.5)

    usr.clear()
    usr.send_keys("Valid UserName") #send a valid username
    time.sleep(2)
    driver.find_element(By.ID, "username-submit").click()
    time.sleep(1.5)

    #change back to original username
    driver.find_element(By.ID, "nav-user-logo").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-username").click()
    time.sleep(1)
    usr = driver.find_element(By.ID, "new-username")
    usr.send_keys(username)
    time.sleep(2)
    driver.find_element(By.ID, "username-submit").click()
    time.sleep(1.5)

    driver.quit()

