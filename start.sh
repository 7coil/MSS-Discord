discordapi="<Replace Discord API Key Here.>"
youtubeapi="<Replace YouTube API Key Here.>"

echo "Moustacheminer Server Services - Discord"

while true
do
	node bot.js $discordapi $youtubeapi
done
