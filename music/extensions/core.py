import discord
import os
from discord.ext import commands


class Core:
    def __init__(self, bot):
        self.bot = bot
        self.init_extensions()

    def init_extensions(self):
        for ext in os.listdir('extensions'):
            if ext.endswith('.py') and not ext.startswith('core'):
                try:
                    self.bot.load_extension(f'extensions.{ext[:-3]}')
                except (ImportError, discord.ClientException) as e:
                    print(e)

    @commands.command()
    @commands.is_owner()
    async def reload(self, ctx, name: str):
        """ (Re)Load an extension in the bot """
        m = await ctx.send(f'Loading {name}')
        try:
            self.bot.unload_extension(f'extensions.{name}')
            self.bot.load_extension(f'extensions.{name}')
            await m.edit(content='Extension reloaded.')
        except (ImportError, discord.ClientException) as e:
            stack_line = str(e).split('\n')[-1]
            await m.edit(content=f'Error while loading {name}\n`{stack_line}`')

    @commands.command()
    @commands.is_owner()
    async def shutdown(self, ctx):
        """ Ends the current bot session """
        quit()


def setup(bot):
    bot.add_cog(Core(bot))
