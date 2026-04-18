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
    driver.maximize_window()

    time.sleep(1)
    login(driver, "UItesthasCoach", "Correctpass123")
    time.sleep(1)

    driver.find_element(By.ID, "home-coach").click() #views user's coach
    time.sleep(1)

    #leave review
    driver.find_element(By.ID, "coach-reviews").click()
    time.sleep(1)
    driver.find_element(By.ID, "leave-review").click()
    time.sleep(1)

        # close leave review modal
    actions = ActionChains(driver) 
    actions.move_by_offset(1,1).click().perform()
    time.sleep(1)

    driver.find_element(By.ID, "leave-review").click()
    time.sleep(1)

    driver.find_element(By.ID, "submit-review").click()
    time.sleep(1.5)
    driver.find_element(By.ID, "star-2").click()
    time.sleep(1)
    driver.find_element(By.ID, "star-0").click()
    time.sleep(1)
    driver.find_element(By.ID, "star-4").click()
    time.sleep(1)

    reviewText = driver.find_element(By.ID, "review-text")
    reviewText.send_keys("Great coach")
    time.sleep(1.5)
    driver.find_element(By.ID, "submit-review").click()
    time.sleep(1)

    actions.move_by_offset(1,1).click().perform()
    time.sleep(1)
    driver.find_element(By.ID, "close-reviews").click()
    time.sleep(1)

    #report coach
    driver.find_element(By.ID, "coach-report").click()
    time.sleep(1.5)

    driver.find_element(By.ID, "submit-report").click()
    time.sleep(1.5)
    report = driver.find_element(By.ID, "report-text")

    report.send_keys("this coach is bad (test)")
    time.sleep(1)
    driver.find_element(By.ID, "submit-report").click()
    time.sleep(1.5)
    actions.move_by_offset(1,1).click().perform()
    time.sleep(1)

    #fire coach
    driver.find_element(By.ID, "coach-fire").click()
    time.sleep(1)
    driver.find_element(By.ID, "fire-cancel").click()
    time.sleep(1)
    driver.find_element(By.ID, "coach-fire").click()
    time.sleep(1)
    driver.find_element(By.ID, "fire-confirm").click()
    time.sleep(1)
    driver.find_element(By.ID, "fire-cancel").click()
    time.sleep(1)

    driver.find_element(By.ID, "coach-close").click()
    time.sleep(.5)
    driver.find_element(By.ID, "nav-home").click()

    time.sleep(2)
    driver.quit()