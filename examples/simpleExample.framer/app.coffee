{StoryComponent} = require "StoryComponent"

exampleSet = new StoryComponent
	stories: ["", "", ""]

exampleSet._startStoriesPlayback()

Utils.delay 10, ->
	exampleSet._resetStoriesPlayback()