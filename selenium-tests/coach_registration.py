from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
import os
#from dotenv import load_dotenv
import time


#load_dotenv()
URL = "http://localhost:5173/"

#Skip payment
if __name__ == "__main__":
    driver = webdriver.Chrome() #use Chrome
    driver.get(URL) #access site

    time.sleep(1)

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
    lName.send_keys("last name") #enter new value for last name
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
    time.sleep(2)
    driver.find_element(By.ID, "register-next-2").click() #move to next page
    time.sleep(2)

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
    test_file = os.path.abspath("Files/TestFile.jpg")
    coachCert = driver.find_element(By.ID, "cert-upload-0")
    coachCert.send_keys(test_file)
    time.sleep(1.5)
    driver.find_element(By.ID, "register-next-3").click() #move to next page
    time.sleep(1.5)
    nutritionCert = driver.find_element(By.ID, "cert-upload-1")
    nutritionCert.send_keys(test_file)
    time.sleep(2)
    driver.find_element(By.ID, "register-next-3").click() 
    time.sleep(2)

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
    actions = ActionChains(driver) 
    
    actions.click_and_hold(price).move_by_offset(50, 0).release().perform()
    time.sleep(1.5)
    actions.click_and_hold(price).move_by_offset(-45, 0).release().perform()
    time.sleep(2)

    driver.find_element(By.ID, "register-next-4").click()

    # -----------Goals Page-----------
    time.sleep(1.5)   
    driver.find_element(By.ID, "WeightLoss").click()
    goalText = driver.find_element(By.ID, "register-goal_text")
    goalText.send_keys("This is a text goal")
    time.sleep(2)

    # -----------Skip Payment-----------
    driver.find_element(By.ID, "register-skip").click() #skip payment

    time.sleep(2)
    driver.quit()
