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

    #test close button
    driver.find_element(By.ID, "register-close-btn").click()
    time.sleep(2)
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
    passwrd.send_keys("wrongpassword") #insert wrong password

    time.sleep(1.5)

    #valid password
    passwrd.clear() #clear password field
    time.sleep(1)
    passwrd.send_keys("Correctpass123") #send correct passwork
    passwrd = driver.find_element(By.ID, "register-confirmPassword")
    passwrd.send_keys("Correctpass123")
    time.sleep(2)
    driver.find_element(By.ID, "register-next-1").click() #go to next page

    time.sleep(2)

    # show back and next buttons
    driver.find_element(By.ID, "register-back-1").click()
    time.sleep(1.5)
    driver.find_element(By.ID, "register-next-1").click()
    time.sleep(2)
    # -----------User Info Page-----------
    fName = driver.find_element(By.ID, "register-first_name")
    lName = driver.find_element(By.ID, "register-last_name")
    bDay = driver.find_element(By.ID, "register-birthday")

    #set first name
    fName.send_keys("UITest")
    time.sleep(1.5)
    #set last name
    lName.send_keys("wrong last name")
    time.sleep(1.5)
    lName.clear() #clear last name field
    lName.send_keys("last name") #enter new value for last name
    time.sleep(1.5)
    #set birthday
    bDay.send_keys("01011998")
    time.sleep(2)
    driver.find_element(By.ID, "register-next-2").click() #move to next page

    # -----------Goals Page-----------
    # -----------Skip Payment-----------
    currWeight=driver.find_element(By.ID, "register-current_weight")
    goalWeight=driver.find_element(By.ID, "register-goal_weight")
    actions = ActionChains(driver) 
    
    actions.click_and_hold(currWeight).move_by_offset(50, 0).release().perform()
    time.sleep(1.5)
    actions.click_and_hold(goalWeight).move_by_offset(50, 0).release().perform()  
    time.sleep(1.5)
    actions.click_and_hold(goalWeight).move_by_offset(-50, 0).release().perform() 
    
    time.sleep(1.5)   
    driver.find_element(By.ID, "Strength").click()
    time.sleep(1)
    driver.find_element(By.ID, "WeightLoss").click()
    goalText = driver.find_element(By.ID, "register-goal_text")
    goalText.send_keys("This is a text goal")
    time.sleep(2)
    driver.find_element(By.ID, "register-skip").click() #skip payment

    time.sleep(2)
    driver.quit()
