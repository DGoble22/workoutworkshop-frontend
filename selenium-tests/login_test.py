from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import os
#from dotenv import load_dotenv
import time
import subprocess
import json

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
    time.sleep(1.5)

    report = driver.execute_script("return window.__coverage__;")
    
    time.sleep(2)
    driver.quit() #close the driver
    print("Execution successful")

    path = os.path.join(".nyc_output", "out.json") # create file in nyc_output folder
    flog = os.path.join(".nyc_output", "login_report.json")

    f = open(path, "w")
    f.write(json.dumps(report)) # write the json to standard out.json file
    f.close()
    f = open(flog, "w")
    f.write(json.dumps(report)) # store a record of the report
    f.close() #write to the file

    subprocess.run(["npx", "nyc", "report", "-n", "src/components/Login.jsx"], check=True, shell=True)