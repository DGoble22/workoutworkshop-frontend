#helper functionsfrom selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import os
#from dotenv import load_dotenv
import time

def login(driver, username, password):
    """logs user into website"""
    driver.find_element(By.ID, "home-login").click() #open login page
    time.sleep(1)

    user=driver.find_element(By.ID, "login-username")
    user.send_keys(username)

    passwrd=driver.find_element(By.ID, "login-password")
    passwrd.send_keys(password) #send correct passwork
    
    driver.find_element(By.ID, "login-submit").click() #submit currect login
    time.sleep(2)

def login_to_profile_editor(driver, username, password):
    """logs in and navigates to user profile editor"""
    login(driver, username, password) #log in
    driver.find_element(By.ID, "nav-user-logo").click() #open pfp editor

def register_user(driver):
    driver.find_element(By.ID, "home-register").click()
    time.sleep(1.5)

    # -----------LOGIN CREDENTIALS-----------
    #input fields
    user = driver.find_element(By.ID, "register-username")
    user.send_keys("UItest")

    #valid password
    passwrd=driver.find_element(By.ID, "register-password")
    passwrd.send_keys("Correctpass123") #send correct passwork
    passwrd = driver.find_element(By.ID, "register-confirmPassword")
    passwrd.send_keys("Correctpass123")
    time.sleep(1.5)
    driver.find_element(By.ID, "register-next-1").click() #go to next page

    time.sleep(1.5)

    # -----------User Info Page-----------
    fName = driver.find_element(By.ID, "register-first_name")
    lName = driver.find_element(By.ID, "register-last_name")
    bDay = driver.find_element(By.ID, "register-birthday")

    #set first name
    fName.send_keys("UITest")
    time.sleep(1)
    #set last name
    lName.send_keys("last name") #enter new value for last name
    time.sleep(1)
    #set birthday
    bDay.send_keys("01011998")
    time.sleep(1)
    driver.find_element(By.ID, "register-next-2").click() #move to next page

    # -----------Goals Page-----------
    # -----------Skip Payment-----------

    time.sleep(1.5)   
    driver.find_element(By.ID, "WeightLoss").click()
    goalText = driver.find_element(By.ID, "register-goal_text")
    goalText.send_keys("This is a text goal")
    time.sleep(1)
    driver.find_element(By.ID, "register-skip").click() #skip payment
    
    