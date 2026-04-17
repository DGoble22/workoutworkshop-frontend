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
    driver.find_element(By.ID, "nav-payment").click()
    time.sleep(1.5)
    driver.find_element(By.ID, "cancel").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-user-logo").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-payment").click()
    time.sleep(1.5)

    cardName = driver.find_element(By.ID, "cardName")
    cardNumber = driver.find_element(By.ID, "cardNumber")
    expMonth = driver.find_element(By.ID, "cardExpMonth")
    expYear = driver.find_element(By.ID, "cardExpYear")
    CVC = driver.find_element(By.ID, "cardCVC")
    
    #invalid selections
    cardName.send_keys("UI Test")
    cardNumber.send_keys("Invalid card #")
    expMonth.send_keys("99")
    expYear.send_keys("1998")
    CVC.send_keys("12345")

    time.sleep(2)
    driver.find_element(By.ID, "finish").click()
    time.sleep(1.5)

    #valid card number
    cardNumber.clear()
    cardNumber.send_keys("1234567891234567")
    driver.find_element(By.ID, "finish").click()
    time.sleep(1.5)
    
    #valid expMonth
    expMonth.clear()
    expMonth.send_keys("08")
    driver.find_element(By.ID, "finish").click()
    time.sleep(1.5)

    #valid expYear
    expYear.clear()
    expYear.send_keys("2030")
    driver.find_element(By.ID, "finish").click()
    time.sleep(1.5)

    #valid CVC
    CVC.clear()
    CVC.send_keys("1234")
    
    driver.find_element(By.ID, "finish").click()