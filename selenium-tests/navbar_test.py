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

    #--------------UPDATE USER PFP------------------
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
    test_file = os.path.abspath("selenium-tests/Files/SamplePFP.png")
    pfp = driver.find_element(By.ID, "upload-pfp")
    pfp.send_keys(test_file)

    #submit pfp
    driver.find_element(By.ID, "upload-pfp-submit").click() #click submit without file
    time.sleep(1.5)

    #--------------UPDATE USERNAME------------------
    driver.find_element(By.ID, "nav-user-logo").click() #close user dropdown
    time.sleep(1)
    driver.find_element(By.ID, "nav-username").click() #close user dropdown
    time.sleep(1)
    driver.find_element(By.ID, "username-cancel").click() #close user dropdown
    time.sleep(1)
    driver.find_element(By.ID, "nav-user-logo").click() #close user dropdown
    time.sleep(1)
    driver.find_element(By.ID, "nav-username").click() #close user dropdown
    time.sleep(1)
    driver.find_element(By.ID, "username-submit").click() #close user dropdown
    time.sleep(1.5)
    username = driver.find_element(By.ID, "new-username")
    username.send_keys("UItestnew")
    time.sleep(1.5)
    driver.find_element(By.ID, "username-submit").click() #close user dropdown
    time.sleep(1.5)

    #set username back
    driver.find_element(By.ID, "nav-user-logo").click() #close user dropdown
    time.sleep(1)
    driver.find_element(By.ID, "nav-username").click() #close user dropdown
    time.sleep(1)
    username = driver.find_element(By.ID, "new-username")
    username.send_keys("UItest")
    time.sleep(1)
    driver.find_element(By.ID, "username-submit").click() #close user dropdown
    time.sleep(1.5)

    #--------------CHANGE PASSWORD------------------
    driver.find_element(By.ID, "nav-user-logo").click() #close user dropdown
    time.sleep(1)
    driver.find_element(By.ID, "nav-password").click() #close user dropdown
    time.sleep(1)
    driver.find_element(By.ID, "password-cancel").click()
    time.sleep(1.5)
    driver.find_element(By.ID, "nav-user-logo").click() #close user dropdown
    time.sleep(1)
    driver.find_element(By.ID, "nav-password").click() #close user dropdown
    time.sleep(1)
    driver.find_element(By.ID, "password-submit").click()
    time.sleep(1.5)

    #old pass (incorrect password given)
    old = driver.find_element(By.ID, "old-password")
    old.send_keys("incorrect pass")
    time.sleep(1)
    driver.find_element(By.ID, "password-submit").click()
    time.sleep(1.5)

    #new password
    new = driver.find_element(By.ID, "password-new")
    new.send_keys("123") #invalid password
    time.sleep(1)
    driver.find_element(By.ID, "password-submit").click()
    time.sleep(1.5)
    new.clear()
    new.send_keys("Correctpass123")

    #confirm password
    confirm = driver.find_element(By.ID, "confirm-password")
    confirm.send_keys("wrong") #non-matching password
    time.sleep(1)
    driver.find_element(By.ID, "password-submit").click()
    time.sleep(1.5)
    confirm.clear()
    confirm.send_keys("Correctpass123")
    time.sleep(1)
    driver.find_element(By.ID, "password-submit").click()
    time.sleep(2.5)

    #fix old password
    old.clear()
    old.send_keys("Correctpass123")
    time.sleep(1)
    driver.find_element(By.ID, "password-submit").click()
    time.sleep(1.5)

    #--------------EDIT GOALS------------------
    driver.find_element(By.ID, "nav-user-logo").click() #close user dropdown
    time.sleep(1)
    driver.find_element(By.ID, "nav-goals").click() #close user dropdown
    time.sleep(1)
    driver.find_element(By.ID, "goals-cancel").click()
    time.sleep(1)
    driver.find_element(By.ID, "nav-user-logo").click() #close user dropdown
    time.sleep(1)
    driver.find_element(By.ID, "nav-goals").click() #close user dropdown
    time.sleep(1)

    #set current weight
    curr = driver.find_element(By.ID, "currentWeight")
    curr.clear()
    curr.send_keys("195")
    time.sleep(1)
    
    #set goal weight
    goal = driver.find_element(By.ID, "goalWeight")
    goal.clear()
    goal.send_keys("185")
    time.sleep(1)

    #set goal type
    driver.find_element(By.ID, "goals-Strength").click()
    time.sleep(1)
    driver.find_element(By.ID, "goals-Stamina").click()
    time.sleep(1)

    #set goal notes
    goalText = driver.find_element(By.ID, "goal-notes")
    goalText.send_keys("my goal is the get faster")
    time.sleep(1.5)

    driver.find_element(By.ID, "goals-submit").click() #submit new goals

    #--------------CHANGE PAYMENT INFO------------------
    driver.find_element(By.ID, "nav-user-logo").click()
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
    time.sleep(1.5)

    #------------sign out--------------
    driver.find_element(By.ID, "nav-user-logo").click() #close user dropdown
    time.sleep(1)
    driver.find_element(By.ID, "nav-signout").click()
    time.sleep(1.5)
    

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

    time.sleep(2)
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

    subprocess.run(["npx", "nyc", "report",
     "-n", "src/components/Navbar.jsx",
     "-n", "src/components/UploadProfileModal.jsx",
     "-n", "src/components/EditUsernameModal.jsx",
     "-n", "src/components/ChangePasswordModal.jsx",
     "-n", "src/components/EditGoalsModal.jsx",
     "-n", "src/components/DeleteAccountModal.jsx",
     "-n", "src/components/EditPaymentDetailsModal.jsx"], check=True, shell=True)


