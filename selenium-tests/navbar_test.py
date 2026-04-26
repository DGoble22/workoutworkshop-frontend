from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import os
#from dotenv import load_dotenv
import time
import json
import subprocess
from helper import login


#load_dotenv()
URL = "http://localhost:5173/"

#Skip payment
if __name__ == "__main__":
    driver = webdriver.Chrome() #use Chrome
    driver.get(URL) #access site
    driver.maximize_window()

    time.sleep(1)

    #login / register
    driver.find_element(By.ID, "nav-login").click()
    time.sleep(1)
    driver.find_element(By.ID, "close-login").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-register").click()
    time.sleep(1)
    driver.find_element(By.ID, "register-close-btn").click()
    time.sleep(1)

    #---------user-------------
    login(driver, "UItest", "Correctpass123")
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-workout").click() #open workout page
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-home").click() #go to homepage
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-logo").click() #use logo to go back home
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-user-logo").click() #close user dropdown
    time.sleep(1)
    driver.find_element(By.ID, "nav-signout").click()
    time.sleep(1.5)

    # all the user options i.e uploading pics and stuff
    

    #-----------coach--------------
    login(driver, "UItestCoach", "Correctpass123")
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-workout").click() #open workout page
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-home").click() #go to homepage
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-coach").click() #click on coach page
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-logo").click() #use logo to go back home
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-user-logo").click() #open user dropdown
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-signout").click()
    time.sleep(1.5)

    #-----------admin---------------
    login(driver, "UItestAdmin", "Correctpass123")
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-workout").click() #open workout page
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-home").click() #go to homepage
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-admin").click() #click on admin page
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-logo").click() #use logo to go back home
    time.sleep(1)
    driver.find_element(By.ID, "nav-user-logo").click() #close user dropdown
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-signout").click()
    time.sleep(1.5)

    time.sleep(1.5)
    report = driver.execute_script("return window.__coverage__;")
    time.sleep(1.5)
    driver.quit() #close the driver
    print("Execution successful")

    path = os.path.join(".nyc_output", "out.json") # create file in nyc_output folder
    flog = os.path.join(".nyc_output", "navbar_report.json")

    f = open(path, "w")
    f.write(json.dumps(report)) # write the json to standard out.json file
    f.close()
    f = open(flog, "w")
    f.write(json.dumps(report)) # store a record of the report
    f.close() #write to the file

    subprocess.run(["npx", "nyc", "report", "-n", "src/components/Navbar.jsx"], check=True, shell=True)


