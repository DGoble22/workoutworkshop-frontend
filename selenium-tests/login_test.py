from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import os
#from dotenv import load_dotenv
import time


#load_dotenv()
URL = "http://localhost:5173/"


if __name__ == "__main__":
    driver = webdriver.Chrome() #use Chrome
    driver.get(URL) #access site
    time.sleep(1.5)
    driver.find_element(By.ID, "home-login").click() #open login page
    time.sleep(1)
    driver.find_element(By.ID, "close-login").click() #close login page
    time.sleep(1)
    driver.find_element(By.ID, "home-login").click() #re-open login page

    #user
    user=driver.find_element(By.ID, "login-username")
    user.send_keys("UItest")

    #wrong password
    passwrd=driver.find_element(By.ID, "login-password")
    passwrd.send_keys("wrongpassword") #insert wrong password

    driver.find_element(By.ID, "login-submit").click()

    time.sleep(1)

    #correct password
    passwrd.clear() #clear password field
    passwrd.send_keys("Correctpass123") #send correct passwork
    
    time.sleep(1)
    driver.find_element(By.ID, "login-submit").click() #submit currect login
    time.sleep(2)
    driver.quit() #close the driver

