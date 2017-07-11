# Parkerbot

![A picture of Matt Parker. Looks rapey.](client/parker.png)

Parkerbot is an all rounded bot designed to do as many things, even if they are terribly implemented. You could say it's a Parker Square of an implementation.

- [If you are trying to add the bot to your server, click here.](https://discordapp.com/oauth2/authorize?&client_id=257547382277931009&scope=bot&permissions=70765632)
- [bots.discord.pw](https://bots.discord.pw/bots/257547382277931009)
- [discordbots.org](https://discordbots.org/bot/257547382277931009)

*Fun for the whole family!*

## Installation

### Linux, GNU/Linux, GNU-Linux, GNU+Linux, GNU?

Ubuntu Linux is officially supported from 14.04, your milage may vary with other **Arch**itectures from many **Gentoo**rations. (sorry)

#### Prerequisites

* git (Probably preinstalled)
* node.js
* npm (Should come with node.js)
* python (2.6, 2.7 or 3.2+, required for youtube-dl)
* youtube-dl
* cowsay
* FFMPEG
* A working internet connection
* Login details for:
	* Discord
	* Google
	* Kahoot
	* Discord Bots API key (bots.discord.pw)
	* Discord Bot List API key (discordbots.org)
* Rethonk DB

#### Step 0

Clone this repo!  
It is recommended that you set a name for the folder, in our case, I cloned the bot to `borkbot`

```bash
git clone https://github.com/moustacheminer/mss-discord borkbot
```

#### Step 1

Go into the folder (MSS-Discord/) and install all the node dependencies

```bash
npm i
```

#### Step 2

Copy and configure the `config/default.json` files

```
##### If you are professional bubbie hacker, you can replace nano for your text editor of choice
nano config/default.json

##### You can leave discordbotsorg and botsdiscordpw empty
```

#### Step 3

Run the database initialisaion program

```bash
npm dbinit
```

#### Step 4

Run the program

```bash
npm start
```

### Microsoft Windows

No.