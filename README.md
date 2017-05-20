# MSS-Discord

MSS-Discord (Moustacheminer Server Services for Discord) is another bot made for Discord, utilising reactions to control media.

[If you are trying to add the bot to your server, click here.](https://discordapp.com/oauth2/authorize?&client_id=257547382277931009&scope=bot&permissions=70765632)

*Fun for the whole family!*

## Installation

### Linux

Ubuntu Linux is officially supported from 14.04, your milage may vary with other **Arch**itectures from many **Gentoo**rations. (sorry)

#### Prerequisites

* git (Probably preinstalled)
* node.js
* npm (Should come with node.js)
* python (2.6, 2.7 or 3.2+, required for youtube-dl)
* youtube-dl
* cowsay
* A working internet connection
* API keys for
	* Discord Bot
	* Google (for YouTube)

#### Step 0

Clone this repo!  
It is recommended that you set a name for the folder, in our case, I cloned the bot to `borkbot`

```bash
git clone https://github.com/moustacheminer/mss-discord borkbot
```

#### Step 1

Go into the working folder (src) and install all the node dependancies

```bash
cd borkbot/src
npm i
```

#### Step 2

Copy and configure the `api.json` and `config.json` files

```bash
cp api.json.rename api.json

# If you are professional bubbie hacker, you can replace nano for your text editor of choice
nano api.json
nano config.json

# You can leave the dBots inside api.json blank.
```

#### Step 3

Run the program

```bash
node index.js
```

### Microsoft Windows (Vista and up!)

Microsoft Windows is NOT supported under any circumstances. Please do not attempt to use on Windows unless you somehow are stuck on an island with a Windows based laptop and sattelite internet and not being able to download Linux.

#### Prerequisites

* git for Windows
* node.js
* npm (Should come with node.js)
* youtube-dl (python comes with the exe)
* A working sattelite internet connection
* API keys for
	* Discord Bot
	* Google (for YouTube)

#### Step 0

Clone this repo!  
It is recommended that you set a name for the folder, in our case, I cloned the bot to `borkbot`

```bash
git clone https://github.com/moustacheminer/mss-discord borkbot
```

#### Step 1

Go into the working folder (src) and install all the node dependancies

```bash
cd borkbot/src
npm i
```

#### Step 2

Copy and configure the `api.json` and `config.json` files

```bash
cp api.json.rename api.json

# If you are professional bubbie hacker, you can replace nano for your text editor of choice
nano api.json
nano config.json

# You can leave the dBots inside api.json blank.
```

#### Step 3

Because you are a Microsoft scrub, you will need to fix things for Windows (you scrub)

*this list is non-exauaustive*

Delete cowsay (within `src/commands/cowsay`)
Add youtube-dl to PATH

#### Step 9

Run the program

```bash
node index.js
```