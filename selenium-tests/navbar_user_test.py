from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import os
#from dotenv import load_dotenv
import time


if __name__ == "__main__":
    URL = "http://localhost:5173/"

    # -----------LOGIN-----------
    # --------Regular User--------
    driver = webdriver.Chrome() #use Chrome
    driver.get(URL) #access site
    time.sleep(1.5)
    driver.find_element(By.ID, "home-login").click() #open login page
    time.sleep(1)

    user=driver.find_element(By.ID, "login-username")
    user.send_keys("UItest")

    passwrd=driver.find_element(By.ID, "login-password")
    passwrd.send_keys("Correctpass123") #send correct passwork
    
    time.sleep(1)
    driver.find_element(By.ID, "login-submit").click() #submit currect login
    time.sleep(2)
    

    # -----------NAVBAR-----------
    driver.find_element(By.ID, "nav-workout").click() #open workout page
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-home").click() #go to homepage
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-logo").click() #use logo to go back home
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-user-logo").click() #close user dropdown
    time.sleep(2)
    driver.quit() #close the driver