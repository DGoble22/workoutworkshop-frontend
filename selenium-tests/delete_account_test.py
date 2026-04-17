from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import os
#from dotenv import load_dotenv
import time
from helper import login_to_profile_editor, register_user

#load_dotenv()
URL = "http://localhost:5173/"

#Skip payment
if __name__ == "__main__":
    driver = webdriver.Chrome() #use Chrome
    driver.get(URL) #access site

    time.sleep(1)
    login_to_profile_editor(driver, "UItest", "Correctpass123") 
    time.sleep(1)

    driver.find_element(By.ID, "nav-delete").click()
    time.sleep(1.5)
    driver.find_element(By.ID, "delete-cancel").click()
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-user-logo").click() 
    time.sleep(1)
    driver.find_element(By.ID, "nav-delete").click()
    time.sleep(1)
    driver.find_element(By.ID, "delete-confirm").click()
    time.sleep(2)

    register_user(driver)
    time.sleep(2)
    driver.quit()