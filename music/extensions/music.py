﻿import json
import urllib
from os import path

import math
import re

import discord
from discord.ext import commands
import lavalink

time_rx = re.compile('[0-9]+')

with open(path.abspath(path.join(path.dirname(__file__), '..', '..', '..', 'config', 'default.json'))) as f:
    config = json.load(f)


class Music:
    def __init__(self, bot):
        self.bot = bot
        lavalink.Client(bot=bot, host=config.get('lavalink')['host'], port=config.get('lavalink')['port'], password=config.get('lavalink')['password'], loop=self.bot.loop, log_level='debug')

        self.bot.lavalink.client.register_hook(self.track_hook)
        # As of 2.0, lavalink.Client will be available via self.bot.lavalink.client

    async def track_hook(self, player, event):
        if event == 'TrackStartEvent':
            c = player.fetch('channel')
            if c:
                c = self.bot.get_channel(c)
                if c:
                    embed = discord.Embed(colour=c.guild.me.top_role.colour, title='Now Playing', description=player.current.title)
                    await c.send(embed=embed)
        elif event == 'QueueEndEvent':
            c = player.fetch('channel')
            if c:
                c = self.bot.get_channel(c)
                if c:
                    await c.send('Queue ended! Why not queue more songs?')

    @commands.command(aliases=['tts', 'dictate'])
    async def dectalk(self, ctx, *, query):
        player = self.bot.lavalink.players.get(ctx.guild.id)

        if not player.is_connected:
            if ctx.author.voice is None or ctx.author.voice.channel is None:
                return await ctx.send('Join a voice channel!')
            player.store('channel', ctx.channel.id)
            await player.connect(ctx.author.voice.channel.id)
        else:
            if ctx.author.voice is None or ctx.author.voice.channel is None or player.connected_channel.id != ctx.author.voice.channel.id:
                return await ctx.send('Join my voice channel!')

        query = 'https://talk.moustacheminer.com/api/gen?dectalk=' + urllib.parse.quote(urllib.parse.quote(query))

        tracks = await self.bot.lavalink.client.get_tracks(query)

        if not tracks:
            return await ctx.send('No tracks were found. `talk.moustacheminer.com` may be offline, or `lavalink.py` is broken. It\'s probably Kromatic\'s fault. I should have used pylava. This will be fixed soon. For now, try not to have spaces in your message.')

        await player.add_and_play(requester=ctx.author.id, track=tracks[0])

    @commands.command(aliases=['p', 'yt', 'youtube'])
    async def play(self, ctx, *, query):
        player = self.bot.lavalink.players.get(ctx.guild.id)

        if not player.is_connected:
            if ctx.author.voice is None or ctx.author.voice.channel is None:
                return await ctx.send('Join a voice channel!')
            player.store('channel', ctx.channel.id)
            await player.connect(ctx.author.voice.channel.id)
        else:
            if ctx.author.voice is None or ctx.author.voice.channel is None or player.connected_channel.id != ctx.author.voice.channel.id:
                return await ctx.send('Join my voice channel!')

        query = query.strip('<>')

        if not query.startswith('http'):
            query = f'ytsearch:{query}'

        tracks = await self.bot.lavalink.client.get_tracks(query)

        if not tracks:
            return await ctx.send('Nothing found 👀')

        if 'list' in query and 'ytsearch:' not in query:
            for track in tracks:
                await player.add_and_play(requester=ctx.author.id, track=track)

            embed = discord.Embed(colour=ctx.guild.me.top_role.colour,
                                  title="Playlist Enqueued!",
                                  description=f"Imported {len(tracks)} tracks from the playlist :)")
            await ctx.send(embed=embed)
        else:
            embed = discord.Embed(colour=ctx.guild.me.top_role.colour,
                                  title="Track Enqueued",
                                  description=f'[{tracks[0]["info"]["title"]}]({tracks[0]["info"]["uri"]})')
            await ctx.send(embed=embed)
            await player.add_and_play(requester=ctx.author.id, track=tracks[0])

    @commands.command()
    async def seek(self, ctx, time):
        player = self.bot.lavalink.players.get(ctx.guild.id)

        if not player.is_playing:
            return await ctx.send('Not playing.')

        pos = '+'
        if time.startswith('-'):
            pos = '-'

        seconds = time_rx.search(time)

        if not seconds:
            return await ctx.send('You need to specify the amount of seconds to skip!')

        seconds = int(seconds.group()) * 1000

        if pos == '-':
            seconds = seconds * -1

        track_time = player.position + seconds

        await player.seek(track_time)

        await ctx.send(f'Moved track to **{lavalink.Utils.format_time(track_time)}**')

    @commands.command(aliases=['forceskip', 'fs'])
    async def skip(self, ctx):
        player = self.bot.lavalink.players.get(ctx.guild.id)

        if not player.is_playing:
            return await ctx.send('Not playing.')

        await ctx.send('⏭ | Skipped.')
        await player.skip()

    @commands.command()
    async def stop(self, ctx):
        player = self.bot.lavalink.players.get(ctx.guild.id)

        if not player.is_playing:
            return await ctx.send('Not playing.')

        player.queue.clear()
        await player.stop()
        await ctx.send('⏹ | Stopped.')

    @commands.command(aliases=['np', 'n'])
    async def now(self, ctx):
        player = self.bot.lavalink.players.get(ctx.guild.id)
        song = 'Nothing'

        if player.current:
            pos = lavalink.Utils.format_time(player.position)
            if player.current.stream:
                dur = 'LIVE'
            else:
                dur = lavalink.Utils.format_time(player.current.duration)
            song = f'**[{player.current.title}]({player.current.uri})**\n({pos}/{dur})'

        embed = discord.Embed(colour=ctx.guild.me.top_role.colour, title='Now Playing', description=song)
        await ctx.send(embed=embed)

    @commands.command(aliases=['q', 'list'])
    async def queue(self, ctx, page: int=1):
        player = self.bot.lavalink.players.get(ctx.guild.id)

        if not player.queue:
            return await ctx.send('There\'s nothing in the queue! Why not queue something?')

        items_per_page = 10
        pages = math.ceil(len(player.queue) / items_per_page)

        start = (page - 1) * items_per_page
        end = start + items_per_page

        queue_list = ''

        for i, track in enumerate(player.queue[start:end], start=start):
            queue_list += f'`{i + 1}.` [**{track.title}**]({track.uri})\n'

        embed = discord.Embed(colour=ctx.guild.me.top_role.colour,
                              description=f'**{len(player.queue)} tracks**\n\n{queue_list}')
        embed.set_footer(text=f'Viewing page {page}/{pages}')
        await ctx.send(embed=embed)

    @commands.command(aliases=['resume'])
    async def pause(self, ctx):
        player = self.bot.lavalink.players.get(ctx.guild.id)

        if not player.is_playing:
            return await ctx.send('Not playing.')

        if player.paused:
            await player.set_pause(False)
            await ctx.send('⏯ | Resumed')
        else:
            await player.set_pause(True)
            await ctx.send(' ⏯ | Paused')

    @commands.command(aliases=['vol'])
    async def volume(self, ctx, volume: int=None):
        player = self.bot.lavalink.players.get(ctx.guild.id)

        if not volume:
            return await ctx.send(f'🔈 | {player.volume}%')

        await player.set_volume(volume)
        await ctx.send(f'🔈 | Set to {player.volume}%')

    @commands.command()
    async def shuffle(self, ctx):
        player = self.bot.lavalink.players.get(ctx.guild.id)

        if not player.is_playing:
            return await ctx.send('Nothing playing.')

        player.shuffle = not player.shuffle

        await ctx.send('🔀 | Shuffle ' + ('enabled' if player.shuffle else 'disabled'))

    @commands.command()
    async def repeat(self, ctx):
        await ctx.send('Command pending rewrite.')

        # player = self.bot.lavalink.players.get(ctx.guild.id)

        # if not player.is_playing:
        #     return await ctx.send('Nothing playing.')

        # player.repeat = not player.repeat

        # await ctx.send('🔁 | Repeat ' + ('enabled' if player.repeat else 'disabled'))

    @commands.command()
    async def remove(self, ctx, index: int):
        player = self.bot.lavalink.players.get(ctx.guild.id)

        if not player.queue:
            return await ctx.send('Nothing queued.')

        if index > len(player.queue) or index < 1:
            return await ctx.send('Index has to be >=1 and <=queue size')

        index = index - 1
        removed = player.queue.pop(index)

        await ctx.send('Removed **' + removed.title + '** from the queue.')

    @commands.command()
    async def find(self, ctx, *, query):
        if not query.startswith('ytsearch:') and not query.startswith('scsearch:'):
            query = 'ytsearch:' + query

        tracks = await self.bot.lavalink.client.get_tracks(query)

        if not tracks:
            return await ctx.send('Nothing found')

        tracks = tracks[:10]  # First 10 results

        o = ''
        for i, t in enumerate(tracks, start=1):
            o += f'`{i}.` [{t["info"]["title"]}]({t["info"]["uri"]})\n'

        embed = discord.Embed(colour=ctx.guild.me.top_role.colour,
                              description=o)

        await ctx.send(embed=embed)

    @commands.is_owner()
    @commands.command(aliases=['dc'])
    async def disconnect(self, ctx):
        player = self.bot.lavalink.players.get(ctx.guild.id)

        if not player.is_connected:
            return await ctx.send('Not connected.')

        await player.disconnect()
        await ctx.send('*⃣ | Disconnected.')


def setup(bot):
    bot.add_cog(Music(bot))


def teardown(bot):
    bot.lavalink.client.destroy()
