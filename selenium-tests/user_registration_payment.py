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
    user.send_keys("UItestPayment")

    #password
    passwrd=driver.find_element(By.ID, "register-password")
    time.sleep(1)
    passwrd.send_keys("Correctpass123") #send correct passwork
    passwrd = driver.find_element(By.ID, "register-confirmPassword")
    passwrd.send_keys("Correctpass123")
    time.sleep(2)
    driver.find_element(By.ID, "register-next-1").click() #go to next page

    time.sleep(2)

    # -----------User Info Page-----------
    fName = driver.find_element(By.ID, "register-first_name")
    lName = driver.find_element(By.ID, "register-last_name")
    bDay = driver.find_element(By.ID, "register-birthday")

    #set first name
    fName.send_keys("UITest")
    time.sleep(1.5)
    #set last name
    lName.send_keys("last name") #enter new value for last name
    time.sleep(1.5)
    #set birthday
    bDay.send_keys("01011998")
    time.sleep(2)
    driver.find_element(By.ID, "register-next-2").click() #move to next page

    # -----------Goals Page-----------
    # -----------GoTo Payment-----------
    currWeight=driver.find_element(By.ID, "register-current_weight")
    goalWeight=driver.find_element(By.ID, "register-goal_weight")
    actions = ActionChains(driver) 
    
    actions.click_and_hold(currWeight).move_by_offset(50, 0).release().perform()
    time.sleep(1.5)
    actions.click_and_hold(goalWeight).move_by_offset(30, 0).release().perform()  
    
    time.sleep(1.5)   
    driver.find_element(By.ID, "WeightLoss").click()
    goalText = driver.find_element(By.ID, "register-goal_text")
    goalText.send_keys("This is a text goal")
    time.sleep(2)

    # -----------Payment Info-----------
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

    time.sleep(2)
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

    time.sleep(2)
    driver.quit()
