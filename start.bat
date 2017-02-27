@echo off
setlocal EnableDelayedExpansion
setlocal EnableExtensions

echo Moustacheminer Server Services - Discord
title Moustacheminer Server Services - Discord

set discordapi=KEY HERE
set youtubeapi=KEY HERE
:a
node bot.js !discordapi! !youtubeapi!
goto a
