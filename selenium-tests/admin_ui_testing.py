from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import os
#from dotenv import load_dotenv
import time
from helper import login

URL = "http://localhost:5173/"

def admin_ui_test(driver):
    driver.find_element(By.ID, "nav-admin").click()
    time.sleep(1)

    #view users
    userSearch = driver.find_element(By.ID, "search-users")
    userSearch.send_keys("UI")
    time.sleep(1.5)
    userSearch.clear()
    time.sleep(1)

    driver.find_element(By.ID, "user-next").click()
    time.sleep(1)
    driver.find_element(By.ID, "user-previous").click()
    time.sleep(1)

    # scroll

    #view applications
    driver.find_element(By.ID, "application-Sam Sulek").click()
    time.sleep(1)

    #accept coach
    driver.find_element(By.ID, "coach-accept").click()
    time.sleep(1.5)

    #reject coach
    driver.find_element(By.Id, "application-Larry Wheels").click()
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
    time.sleep(1)

    driver.find_element(By.ID, "coach-next").click()
    time.sleep(1)
    driver.find_element(By.ID, "coach-previous").click()

    #scroll

    #dismiss report
    driver.find_element(By.ID, "report-Chris Tren").click()
    time.sleep(1)
    driver.find_element(By.ID, "coach-profile").click()
    time.sleep(1)
    driver.find_element(By.ID,).click()   # close coach profile
    time.sleep(1)
    driver.find_element(By.ID, "dismiss-report").click()
    time.sleep(1)

    #ban coach
    driver.find_element(By.ID, "report-Larry Wheels").click()
    time.sleep(1)
    driver.find_element(By.ID, "ban-coach").click() 
    time.sleep(1)
    driver.find_element(By.ID,"cancel-ban").click() 
    time.sleep(1)
    driver.find_element(By.ID,"report-Larry Wheels").click() 
    time.sleep(1)
    driver.find_element(By.ID,"ban-coach").click() 
    time.sleep(1)

    banReason=driver.find_element(By.ID,"ban-reason")
    banReason.send_keys("reason for ban")
    time.sleep(1)
    banReason.clear()
    banReason.send_keys("Unacceptable behavior")
    time.sleep(1)
    driver.find_element(By.ID,"confirm-ban").click() 
    time.sleep(1)

    #disable coach
    driver.find_element(By.ID,"report-Faith Ordway").click() 
    time.sleep(1)
    driver.find_element(By.ID, "disable-coach").click() 
    time.sleep(1)
    driver.find_element(By.ID,"disable-cancel").click() 
    time.sleep(1)
    driver.find_element(By.ID,"report-Faith Ordway").click() 
    time.sleep(1)
    driver.find_element(By.ID, "disable-coach").click() 
    time.sleep(1)
    day = driver.find_element(By.ID, "disable-day")
    month = driver.find_element(By.ID, "diable-month")
    year = driver.find_element(By.ID, "diable-year")
    reason = driver.find_element(By.ID, "disable-reason")

    day.send_keys("17")
    month.send_keys("09")
    year.send_keys("2026")
    reason.send_keys("test")

    time.sleep(1.5)
    driver.find_element(By.ID, "disable-confirm").click() 
    time.sleep(1)
    
    #exercise bit

    time.sleep(2)
    driver.quit()