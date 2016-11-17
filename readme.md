# Plane Spotter

## Overview

A Node app to identify nearby aeroplanes with a Raspberry Pi, Dump1090, Node, an LCD touchscreen and some magic

## Hardware

- Raspberry Pi
- Touchscreen (I used a [Waveshare Raspberry Pi 3.5](http://www.waveshare.com/3.5inch-rpi-lcd-a.htm))
- DVB-T Receiver (I used an [RTLSDR RTL2832U DVB-T Tuner Dongle](http://www.rtl-sdr.com/buy-rtl-sdr-dvb-t-dongles/))

## Pi setup
- [Install Raspbian](https://www.raspberrypi.org/downloads/raspbian/) (tested with Raspbian Jessie)

- Add wifi/network settings

- [Update Raspbian](https://www.raspberrypi.org/documentation/raspbian/updating.md)

- [Add an SSH key for password-less login](https://www.raspberrypi.org/documentation/remote-access/ssh/passwordless.md) (optional)

- [install LCD screen drivers](http://www.waveshare.com/wiki/3.5inch_RPi_LCD_(A)) (optional - these are the specific instructions for the screen I bought, a Waveshare Spotpear 3.5)

- [Disable Pi screensaver](https://oshlab.com/raspberry-pi-kiosk-mode/)

- [Install dump1090](https://github.com/mutability/dump1090)

- [Update Node](http://thisdavej.com/upgrading-to-more-recent-versions-of-node-js-on-the-raspberry-pi/) (Raspbian Jessie comes with v0.12, this codebase requires v7+)

- Install imagemagick:

	```
sudo apt-get install imagemagick graphicsmagick
	```
- [Find your current latitude and longitude](http://en.mygeoposition.com/)

- [Create a custom Google search](https://github.com/vdemedes/google-images#set-up-google-custom-search-engine) (take note of the ID and API key) 

- Set up this project
	1. Clone this repo to the Pi
	2. Install node dependencies: ```npm install```
	3. Set up config file (see below)

- [Install PM2](http://arroyocode.com/raspberry-pi-nodejs-web-server-with-pm2/) and [fix permissions](https://github.com/Unitech/pm2/issues/1654)

## Node app setup

The file `config.sample.js` should be copied and renamed to `config.js`

There are a few options to set: 

 - `planeData`: Change this to the demo json file to use test data
 - `debug`: Output debug statements to both node and chrome console
 - `port`: The port to use
 - `position`: Your current lat/lon position
 - `screen`: The width and height of the display screen, for image resizing
 -  `maxAge`: How long to store cached images and data
 - `timeout`: How frequently to update the screen
 - `launch`: The application to launch (and flags to use) on startup
 - `googleCseId`: The Google custom search engine ID
 - `googleApiKey`: The Google custom search API key

You should now be able to start the application directly with `node index.js` or via `pm2` to have it automatically restart when the Pi powers up

## Placeholder images

The app uses a collection of placeholder images (selected at random) if no plane is found. These are located in the directory `client/images/placeholder/` and can be replaced with others.

## More information and inspiration

- [http://www.rtl-sdr.com/adsb-aircraft-radar-with-rtl-sdr/](http://www.rtl-sdr.com/adsb-aircraft-radar-with-rtl-sdr/)
- [http://jeremybmerrill.com/uncategorized/2016/01/24/flyover.html](http://jeremybmerrill.com/uncategorized/2016/01/24/flyover.html)
