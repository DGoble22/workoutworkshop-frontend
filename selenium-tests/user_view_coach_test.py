from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import os
#from dotenv import load_dotenv
import time
from helper import login

URL = "http://localhost:5173/"

if __name__ == "__main__":
    # user doesn't have a coach
    driver = webdriver.Chrome() #use Chrome
    driver.get(URL) #access site

    time.sleep(1)
    login(driver, "UItest", "Correctpass123")
    time.sleep(1)

    driver.find_element(By.ID, "home-coach").click()
    time.sleep(1)

    #find coach
    driver.find_element(By.ID, "coach-Sam Sulek").click()
    time.sleep(1)
    driver.find_element(By.ID, "coach-close").click()
    time.sleep(1)

    driver.find_element(By.ID, "coach-Chris Tren").click()
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
    driver.find_element(By.ID, "nav-home").click()


    time.sleep(2)
    driver.quit()

