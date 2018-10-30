print('Welcome to Moustacheminer Server Services Music Bot')

import json
import traceback

import discord
from os import path
from discord.ext import commands
from discord.ext.commands import errors as commands_errors

with open(path.abspath(path.join(path.dirname(__file__), '..', 'config', 'default.json'))) as f:
    config = json.load(f)

token = config.get('api')['discord']['token']
prefix = config.get('discord')['prefix'][0]

class Bot(commands.AutoShardedBot):
    def __init__(self, **options):
        super().__init__(**options)

    async def on_ready(self):
        app_info = await self.application_info()
        self.invite_url = discord.utils.oauth_url(app_info.id)
        print(f'Logged in as {self.user.name}\nBot invite link: {self.invite_url}')
        self.load_extension('extensions.core')

    async def on_command_error(self, ctx, exception):
        if isinstance(exception, commands_errors.MissingRequiredArgument):
            command = ctx.invoked_subcommand or ctx.command
            _help = await ctx.bot.formatter.format_help_for(ctx, command)

            for page in _help:
                await ctx.send(page)

        elif isinstance(exception, commands_errors.CommandInvokeError):
            exception = exception.original
            _traceback = traceback.format_tb(exception.__traceback__)
            _traceback = ''.join(_traceback)

            error = ('`{0}` in command `{1}`: ```py\nTraceback (most recent call last):\n{2}{0}: {3}\n```')\
                .format(type(exception).__name__, ctx.command.qualified_name, _traceback, exception)

            await ctx.send(error)

        elif isinstance(exception, commands_errors.CommandOnCooldown):
            await ctx.send('You can use this command in {0:.0f} seconds.'.format(exception.retry_after))

        elif isinstance(exception, commands_errors.CommandNotFound):
            pass

        else:
            await ctx.send(exception)

    async def on_message(self, message):
        if message.author.bot:
            return
        if str(message.author.id) in config.get('discord')['ban']:
            return
        
        await self.process_commands(message)


bot = Bot(command_prefix=prefix)
bot.remove_command('help')
bot.run(token)
