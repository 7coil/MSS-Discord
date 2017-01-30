@echo off
setlocal EnableDelayedExpansion
setlocal EnableExtensions

echo Moustacheminer Server Services - Discord
title Moustacheminer Server Services - Discord

set api=KEY HERE
:a
node bot.js !api!
goto a
