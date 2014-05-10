# Gestion des utilisateurs

## Installation

Executé le script : lunch.sh

## Init BDD

mongo
use nodetest
db.userlist.insert([{"gender":"male","fullname":"Lance Peters","location":"new york","email":"lance.peters57@example.com","username":"goldenfish238","password":"manchester","age":"32","picture":"http://api.randomuser.me/portraits/men/54.jpg"},
  {"gender":"male","fullname":"larry Brewer","location":"greeley","email":"larry.brewer57@example.com","username":"greengoose535","password":"snapon","age":45,"picture":"http://api.randomuser.me/portraits/men/32.jpg"},
  {"gender":"female","fullname":"Stephanie simmons","location":"aurora","email":"stephanie.simmons50@example.com","username":"whitemouse257","age":"27","password":"john","picture":"http://api.randomuser.me/portraits/women/90.jpg"},
  {"gender":"female","fullname":"Veronica Larson","location":"new york","email":"veronica.larson93@example.com","username":"organicbutterfly844","password":"easton","age":24,"picture":"http://api.randomuser.me/portraits/women/65.jpg"}])
