from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import os
#from dotenv import load_dotenv
import time
import json
import subprocess
import argparse


#load_dotenv()
URL = "http://localhost:5173/"

#get arguments
parser = argparse.ArgumentParser()
parser.add_argument('-s', action='store_true')
args = parser.parse_args()

#Skip payment
if __name__ == "__main__":
    driver = webdriver.Chrome() #use Chrome
    driver.get(URL) #access site
    driver.maximize_window()

    time.sleep(1)

    #--------------------USER----------------------

    driver.find_element(By.ID, "home-register").click()
    time.sleep(1.5)

    #test close button
    driver.find_element(By.ID, "register-close-btn").click()
    time.sleep(1.5)
    driver.find_element(By.ID, "home-register").click()

    # -----------LOGIN CREDENTIALS-----------
    #input fields
    user = driver.find_element(By.ID, "register-username")
    user.send_keys("Manny") # taken user name
    time.sleep(1.5)
    user.clear()
    user.send_keys("UItest")

    #invalid password
    passwrd=driver.find_element(By.ID, "register-password")
    confirmPass=driver.find_element(By.ID, "register-confirmPassword")
    passwrd.send_keys("123")
    confirmPass.send_keys("123") #insert non-matching password
    driver.find_element(By.ID, "register-next-1").click() #go to next page
    time.sleep(1.5)
    passwrd.clear()
    confirmPass.clear()
    passwrd.send_keys("Wrongpassword1") #insert wrong password
    confirmPass.send_keys("Correctpass123") #insert non-matching password
    driver.find_element(By.ID, "register-next-1").click()
    time.sleep(1.5)

    #valid password
    passwrd.clear() #clear password field
    passwrd.send_keys("Correctpass123") #send correct passwork
    confirmPass.clear()
    confirmPass.send_keys("Correctpass123") #insert non-matching password

    time.sleep(1.5)
    driver.find_element(By.ID, "register-next-1").click() #go to next page

    time.sleep(1.5)

    # show back and next buttons
    driver.find_element(By.ID, "register-back-1").click()
    time.sleep(1.5)
    driver.find_element(By.ID, "register-next-1").click()
    time.sleep(1.5)
    # -----------User Info Page-----------
    fName = driver.find_element(By.ID, "register-first_name")
    lName = driver.find_element(By.ID, "register-last_name")
    bDay = driver.find_element(By.ID, "register-birthday")

    driver.find_element(By.ID, "register-next-2").click()
    time.sleep(1.5)
    #set first name
    fName.send_keys("UITest")
    driver.find_element(By.ID, "register-next-2").click()
    time.sleep(1.5)
    #set last name
    lName.send_keys("wrong last name")
    time.sleep(1.5)
    lName.clear() #clear last name field
    lName.send_keys("last name") #enter new value for last name
    driver.find_element(By.ID, "register-next-2").click()
    time.sleep(1.5)
    #set birthday
    bDay.send_keys("01011998")
    time.sleep(1.5)
    driver.find_element(By.ID, "register-next-2").click() #move to next page

    # -----------Goals Page-----------
    # -----------Skip Payment-----------
    currWeight=driver.find_element(By.ID, "register-current_weight")
    goalWeight=driver.find_element(By.ID, "register-goal_weight")
    
    driver.find_element(By.ID, "register-skip").click() 
    time.sleep(1)
    currWeight.click()
    for i in range(50):
        currWeight.send_keys(Keys.ARROW_RIGHT)
    goalWeight.click()
    for i in range(25):
        goalWeight.send_keys(Keys.ARROW_RIGHT)
    driver.find_element(By.ID, "Strength").click()
    time.sleep(1)
    driver.find_element(By.ID, "WeightLoss").click()
    goalText = driver.find_element(By.ID, "register-goal_text")
    goalText.send_keys("This is a text goal")
    time.sleep(1.5)
    
    driver.find_element(By.ID, "register-next-4").click()
    time.sleep(1.5)

    cardName = driver.find_element(By.ID, "register-cardName")
    cardNumber = driver.find_element(By.ID, "register-cardNumber")
    expMonth = driver.find_element(By.ID, "register-cardExpMonth")
    expYear = driver.find_element(By.ID, "register-cardExpYear")
    CVC = driver.find_element(By.ID, "register-cardCVC")

    #invalid selections
    cardName.send_keys("UI Test")
    cardNumber.send_keys("Invalid card #")
    expMonth.send_keys("99")
    expYear.send_keys("1998")
    CVC.send_keys("12345")

    time.sleep(1.5)
    driver.find_element(By.ID, "register-finish").click()
    time.sleep(1.5)

    #valid card number
    cardNumber.clear()
    cardNumber.send_keys("1234567891234567")
    driver.find_element(By.ID, "register-finish").click()
    time.sleep(1.5)
    
    #valid expMonth
    expMonth.clear()
    expMonth.send_keys("08")
    driver.find_element(By.ID, "register-finish").click()
    time.sleep(1.5)

    #valid expYear
    expYear.clear()
    expYear.send_keys("2030")
    driver.find_element(By.ID, "register-finish").click()
    time.sleep(1.5)

    #valid CVC
    CVC.clear()
    CVC.send_keys("1234")
    
    driver.find_element(By.ID, "register-finish").click()
    time.sleep(1)

    # delete user
    if not args.s:
        driver.find_element(By.ID, "nav-user-logo").click() 
        time.sleep(1)
        driver.find_element(By.ID, "nav-delete").click()
        time.sleep(1)
        driver.find_element(By.ID, "delete-confirm").click()
        time.sleep(1)
    else:
        driver.find_element(By.ID, "nav-user-logo").click() 
        time.sleep(1)
        driver.find_element(By.ID, "nav-signout").click()
        time.sleep(1)


    #------------------COACH--------------------------
    driver.find_element(By.ID, "home-register").click()
    time.sleep(1.5)

    # -----------LOGIN CREDENTIALS-----------
    #input fields
    user = driver.find_element(By.ID, "register-username")
    time.sleep(1.5)
    user.send_keys("UItestCoach")

    passwrd=driver.find_element(By.ID, "register-password")

    time.sleep(1.5)

    time.sleep(1)
    passwrd.send_keys("Correctpass123") #send correct passwork
    passwrd = driver.find_element(By.ID, "register-confirmPassword")
    passwrd.send_keys("Correctpass123")
    time.sleep(1.5)

    #make user a coach
    driver.find_element(By.ID, "register-isCoach").click()
    time.sleep(1.5)
    driver.find_element(By.ID, "register-isCoach").click()
    time.sleep(1.5)
    driver.find_element(By.ID, "register-isCoach").click()

    driver.find_element(By.ID, "register-next-1").click() #go to next page
    time.sleep(2)

    # -----------Coach Info Page-----------
    fName = driver.find_element(By.ID, "register-first_name")
    lName = driver.find_element(By.ID, "register-last_name")
    bDay = driver.find_element(By.ID, "register-birthday")
    bio = driver.find_element(By.ID, "register-bio")

    #set first name
    fName.send_keys("UITest")
    time.sleep(1.5)
    #set last name
    lName.send_keys("Coach") #enter new value for last name
    time.sleep(1.5)
    #set birthday
    bDay.send_keys("01011998")
    time.sleep(1.5)
    driver.find_element(By.ID, "register-next-2").click() #move to next page
    time.sleep(1.5)
    bio.send_keys("i am a coach")
    time.sleep(1)
    bio.clear()
    time.sleep(1)
    bio.send_keys("i am the best coach")
    time.sleep(1.5)
    driver.find_element(By.ID, "register-next-2").click() #move to next page
    time.sleep(1.5)

    #-----------Coach Info Page 2-----------
    driver.find_element(By.ID, "register-next-3").click() #move to next page
    time.sleep(1.5)
    driver.find_element(By.ID, "register-Coach").click()
    time.sleep(1.5)
    driver.find_element(By.ID, "register-next-3").click() #move to next page
    time.sleep(1.5)
    driver.find_element(By.ID, "register-Coach").click()
    time.sleep(1.5)
    driver.find_element(By.ID, "register-Nutritionist").click()
    time.sleep(1.5)
    driver.find_element(By.ID, "register-next-3").click() #move to next page
    time.sleep(1.5)
    driver.find_element(By.ID, "register-Coach").click()
    time.sleep(1.5)
    # upload files
    test_file = os.path.abspath("selenium-tests/Files/TestFile.jpg")
    coachCert = driver.find_element(By.ID, "cert-upload-0")
    coachCert.send_keys(test_file)
    time.sleep(1.5)
    driver.find_element(By.ID, "register-next-3").click() #move to next page
    time.sleep(1.5)
    nutritionCert = driver.find_element(By.ID, "cert-upload-1")
    nutritionCert.send_keys(test_file)
    time.sleep(1.5)
    driver.find_element(By.ID, "register-next-3").click() 
    time.sleep(1.5)

    # -----------Availibility Page-----------

    
    #click on available days
    driver.find_element(By.ID, "register-M").click()
    time.sleep(1)
    driver.find_element(By.ID, "register-T").click()
    time.sleep(1)
    driver.find_element(By.ID, "register-TH").click()
    time.sleep(1)
    driver.find_element(By.ID, "register-M").click()
    time.sleep(1)

    Tstart = driver.find_element(By.ID, "start-time-T")
    Tend = driver.find_element(By.ID, "end-time-T")

    Tstart.send_keys("0900p") #invalid time
    time.sleep(1)
    Tstart.send_keys("0930a")
    time.sleep(1)

    #set price
    price = driver.find_element(By.ID, "register-pricing")
    price.click()
    for i in range(10):
        price.send_keys(Keys.ARROW_RIGHT)

    time.sleep(1)

    driver.find_element(By.ID, "register-next-4").click()

    # -----------Goals Page-----------
    time.sleep(1.5)   
    driver.find_element(By.ID, "WeightLoss").click()
    goalText = driver.find_element(By.ID, "register-goal_text")
    goalText.send_keys("This is a text goal")
    time.sleep(1.5)

    # -----------Skip Payment-----------
    driver.find_element(By.ID, "register-skip").click() #skip payment
    time.sleep(1)
    #------------delete---------------
    if not args.s:
        driver.find_element(By.ID, "nav-user-logo").click() 
        time.sleep(1)
        driver.find_element(By.ID, "nav-delete").click()
        time.sleep(1)
        driver.find_element(By.ID, "delete-confirm").click()
        time.sleep(1)
    else:
        driver.find_element(By.ID, "nav-user-logo").click() 
        time.sleep(1)
        driver.find_element(By.ID, "nav-signout").click()
        time.sleep(1)

    #-----------------REPORT--------------------------
    time.sleep(1.5)
    report = driver.execute_script("return window.__coverage__;")
    time.sleep(1.5)


    time.sleep(2)
    driver.quit()
    print("Execution successful")

    path = os.path.join(".nyc_output", "out.json") # create file in nyc_output folder
    flog = os.path.join(".nyc_output", "registration_report.json")

    f = open(path, "w")
    f.write(json.dumps(report)) # write the json to standard out.json file
    f.close()
    f = open(flog, "w")
    f.write(json.dumps(report)) # store a record of the report
    f.close() #write to the file

    subprocess.run(["npx", "nyc", "report", "-n", "src/components/Register.jsx", "-n", "src/components/CoachAvailabilityEditor.jsx"], check=True, shell=True)

