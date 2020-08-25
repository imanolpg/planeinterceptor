# Plane Interceptor

Program to scan and visualize planes brodcasting ads-b

[![Author](http://img.shields.io/badge/author-imanolpg-blue.svg)](https://github.com/imanolpg)
[![Source Code](http://img.shields.io/badge/source-imanolpg/planeinterceptor-green.svg)](https://github.com/imanolpg/planeinterceptor)

## Table of content

* [Technologies](#technologies)
* [Installation](#Installation)
* [Usage](#Usage)
* [Dependencies](#Dependencies)

## Technologies
- NodeJS 12.x
- Express 6.14.x
- MongoDB
- Leaflet

## Installation

Clone this repository ```git clone https://github.com/imanolpg/planeinterceptor```.

Install and compile dump1090 and set it in the enviroment path. The program sould be run from terminal.

Install a MongoDB localhost server. Create a database called planeinterceptor and a collection called flights. 

## Usage

Run the local MongoDB server on port 10101.

Run index file ```node index``` and navigate to localhost:3000 


## Dependencies
- Dump1090 (https://github.com/antirez/dump1090)
