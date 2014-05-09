# Gestion des utilisateurs

## Installation

Executé le script : lunch.sh

## Init BDD

mongo
use nodetest
db.userlist.insert({'username' : 'test1','password' : 'test1','email' : 'test1@test.com','fullname' : 'Bob Smith','age' : 27,'location' : 'San Francisco','gender' : 'Male'})