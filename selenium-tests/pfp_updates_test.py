from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import os
#from dotenv import load_dotenv
import time
from helper import login

#load_dotenv()
URL = "http://localhost:5173/"

#Skip payment
if __name__ == "__main__":
    driver = webdriver.Chrome() #use Chrome
    driver.get(URL) #access site

    time.sleep(1)
    login(driver, "UItest", "Correctpass123") #login into site
    time.sleep(1)
    driver.find_element(By.ID, "nav-user-logo").click()
    time.sleep(1.5)

    #change profile picture
    driver.find_element(By.ID, "nav-pfp").click()
    time.sleep(1.5)

    driver.find_element(By.ID, "upload-pfp-submit").click() #click submit without file
    time.sleep(1)
    driver.find_element(By.ID, "upload-pfp-cancel").click() #show cancel button
    time.sleep(1)

    driver.find_element(By.ID, "nav-user-logo").click() #re-open
    driver.find_element(By.ID, "nav-pfp").click()
    time.sleep(.5)
    #send file
    test_file = os.path.abspath("Files/SamplePFP.png")
    pfp = driver.find_element(By.ID, "upload-pfp")
    pfp.send_keys(test_file)

    #submit pfp
    driver.find_element(By.ID, "upload-pfp-submit").click() #click submit without file
    time.sleep(2)

    driver.quit()