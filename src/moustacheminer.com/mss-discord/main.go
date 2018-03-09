package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/bwmarrin/discordgo"
)

func main() {
	client, err := discordgo.New("")

	if err != nil {
		fmt.Println("Error creating session\n", err)
		return
	}

	client.AddHandler(messageCreate)

	err = client.Open()

	if err != nil {
		fmt.Println("Error opening connection\n", err)
		return
	}

	// Wait until CTRL-C is sent
	fmt.Println("Press CTRL-C to terminate")
	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt, os.Kill)
	<-sc

	// Close the client
	client.Close()
}

func ready(s *discordgo.Session, event *discordgo.Ready) {
	s.UpdateStatus(2, "testing")
}

func messageCreate(s *discordgo.Session, m *discordgo.MessageCreate) {
	// Check if the author is the bot itself
	if m.Author.ID == s.State.User.ID {
		return
	}

	// Check if the author is a bot
	if m.Author.Bot {
		return
	}
}
