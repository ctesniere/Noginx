#!/bin/bash

mongo
use nodetest1
db.usercollection.insert({ "username" : "testuser1", "email" : "testuser1@testdomain.com" }, 
	{ "username" : "testuser2", "email" : "testuser2@testdomain.com" },
	{ "username" : "testuser3", "email" : "testuser3@testdomain.com" });