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
    password="Correctpass123"

    #login into site
    time.sleep(1)
    login_to_profile_editor(driver, "UItest", "Correctpass123") 
    time.sleep(1)

    driver.find_element(By.ID, "nav-password").click()
    time.sleep(1)

    #test submit with no input
    driver.find_element(By.ID, "password-submit").click()
    time.sleep(1.5)
    driver.find_element(By.ID, "password-cancel").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-user-logo").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-password").click()
    time.sleep(1)

    #send wrong current password
    oldpass = driver.find_element(By.ID, "old-password")
    oldpass.send_keys(password)
    time.sleep(1)
    driver.find_element(By.ID, "password-submit").click()
    time.sleep(1.5)

    #no confirmation password
    newpass = driver.find_element(By.ID, "password-new")
    newpass.send_keys("Newpass123")
    time.sleep(1)
    driver.find_element(By.ID, "password-submit").click() #dont confirm pass
    time.sleep(1.5)

    #wrong confirmation password
    confirmpass = driver.find_element(By.ID, "confirm-password")
    confirmpass.send_keys("NoneMatching1")
    time.sleep(1)
    driver.find_element(By.ID, "password-submit").click() #dont confirm pass
    time.sleep(1.5)


    #matching passwords
    confirmpass = driver.find_element(By.ID, "confirm-password")
    confirmpass.clear()
    confirmpass.send_keys("Newpass123")

    #wrong old password
    oldpass = driver.find_element(By.ID, "old-password")
    oldpass.clear()
    oldpass.send_keys("wrong password")
    time.sleep(1)
    driver.find_element(By.ID, "password-submit").click()
    time.sleep(1.5)
    oldpass.clear()
    oldpass.send_keys(password)
    time.sleep(1)
    driver.find_element(By.ID, "password-submit").click()
    time.sleep(1.5)

    #change password back
    driver.find_element(By.ID, "nav-user-logo").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-password").click()
    time.sleep(1)
    oldpass = driver.find_element(By.ID, "old-password")
    oldpass.send_keys("Newpass123")

    newpass = driver.find_element(By.ID, "password-new")
    newpass.send_keys(password)

    confirmpass = driver.find_element(By.ID, "confirm-password")
    confirmpass.send_keys(password)
    time.sleep(1.5)
    driver.find_element(By.ID, "password-submit").click() #dont confirm pass
    time.sleep(2)

    driver.quit()