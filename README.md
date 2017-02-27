# MSS-Discord

MSS-Discord (Moustacheminer Server Services for Discord) is another bot made for Discord, utilising reactions to control media.

[If you are trying to add the bot to your server, click here. This bot currently is ran on a DigitalOcean droplet in London.](https://discordapp.com/oauth2/authorize?&client_id=257547382277931009&scope=bot&permissions=70765632)

## Features

- Skip tracks using the provided reaction buttons
- Nothing else. We've blown all our USPs all at once.

> If we somehow get bigger in the future, maybe I'll add more features to it.

## Commands

```
//The help command gives a link to the MSS server.
!!help

//The YouTube command supports either a URL or a search query
//Will only play over 3600 seconds of media if the user is an admin.
!!yt <URL>
!!yt <Search Query>

!!youtube <URL>
!!youtube <Search Query>

//The skip command skips the currently playing song
//ADMIN ONLY
!!skip

//The stop command skips and clears the playlist
//ADMIN ONLY
!!stop

//The list command lists the playlist
!!list

//The error command throws an error
//ADMIN ONLY
!!error

//This command executes javascript code in the script
//OWNER ONLY - CHANGE IF STATEMENT TO YOUR OWN ID IF YOU ARE RUNNING YOUR OWN BOT
!!eval

//Pastes an invite link into the chat.
!!invite
```


> The GNU GPLv3 applies to all files included in this repository  
> A full copy of this licence can be found in licence.txt or in licence.md
> The markdown version of this licence is by TheFox, and can be found here: https://github.com/TheFox/GPLv3.md
