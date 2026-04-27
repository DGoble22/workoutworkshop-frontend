from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import os
#from dotenv import load_dotenv
import time
from helper import login
import json
import subprocess


URL = "http://localhost:5173/"

if __name__ == "__main__":
    # user doesn't have a coach
    driver = webdriver.Chrome() #use Chrome
    driver.get(URL) #access site
    driver.maximize_window()

    #------------SETUP------------

    time.sleep(1)
    login(driver, "UItest", "Correctpass123")
    time.sleep(1)

    driver.find_element(By.ID, "home-coach").click()
    time.sleep(1)

    action = ActionChains(driver)
    scroll=driver.find_element(By.ID, "coach-scroll")
    action.move_to_element(scroll).perform()

    element=driver.find_element(By.ID, "coach-UITest Coach")
    action.scroll_to_element(element).perform()
    time.sleep(1)

    element.click()
    time.sleep(1)

    driver.find_element(By.ID, "coach-apply").click()
    time.sleep(1)

    applytxt=driver.find_element(By.ID, "application-text")
    applytxt.send_keys("i")
    driver.find_element(By.ID, "apply-button").click()
    time.sleep(1)

    driver.find_element(By.ID, "close-application").click()
    time.sleep(1)
    driver.find_element(By.ID, "coach-close").click()
    time.sleep(1)

    element=driver.find_element(By.ID, "nav-user-logo")
    action.scroll_to_element(element).perform()
    time.sleep(1)
    element.click()

    time.sleep(1)
    driver.find_element(By.ID, "nav-signout").click()
    time.sleep(1)

    login(driver, "UItestCoach", "Correctpass123")
    time.sleep(1)

    driver.find_element(By.ID, "nav-coach").click()
    time.sleep(3)
    driver.find_element(By.ID, "request-accept-UITest last name").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-user-logo").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-signout").click()
    time.sleep(1)

    time.sleep(1)
    login(driver, "UItest", "Correctpass123")
    time.sleep(2)

    driver.find_element(By.ID, "chat-btn").click()
    time.sleep(1)

    driver.find_element(By.ID, "contact-SYSTEM").click()
    time.sleep(2)
    driver.find_element(By.ID, "contact-UITest Coach").click()
    time.sleep(2)

    driver.find_element(By.ID, "submit-msg").click()
    time.sleep(1)
    msg=driver.find_element(By.ID, "new-msg")
    msg.send_keys("Hello")
    time.sleep(1)
    msg.clear()
    msg.send_keys("this is my first message to you")
    time.sleep(1)
    driver.find_element(By.ID, "submit-msg").click()
    time.sleep(2)

    driver.find_element(By.ID, "close-chat").click()
    
    time.sleep(2)
    report = driver.execute_script("return window.__coverage__;")
    time.sleep(1.5)

    #fire coach
    driver.find_element(By.ID, "home-coach").click()
    time.sleep(2)
    driver.find_element(By.ID, "coach-fire").click()
    time.sleep(1)
    driver.find_element(By.ID, "fire-confirm").click()
    time.sleep(1)
    driver.find_element(By.ID, "fire-cancel").click()
    time.sleep(1)

    driver.find_element(By.ID, "coach-close").click()
    time.sleep(2)

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

    subprocess.run(["npx", "nyc", "report",
     "-n", "src/App.jsx",
     "-n", "src/components/ChatModal.jsx"], check=True, shell=True)