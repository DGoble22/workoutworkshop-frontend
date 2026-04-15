from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import os
from dotenv import load_dotenv
import time

load_dotenv()
URL = os.getenv(VITE_API_URL)

if __name__ == "__main__":
    driver = webdriver.Chrome() #use Chrome
    driver.get(URL) #access site

    driver.find_element(By.ID, "login").click() #open login page
    time.sleep(1)
    driver.find_element(By.ID, "login-register").click() #click register from login-screen
    time.sleep(1)
    driver.quit() #close the driver


